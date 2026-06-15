export type RateLimitReason =
  | "HOURLY_LIMIT"
  | "DAILY_LIMIT"
  | "RATE_LIMIT_CONFIGURATION_ERROR"
  | "RATE_LIMIT_SERVICE_UNAVAILABLE";

export type RateLimitResult =
  | {
      allowed: true;
      remainingHourly: number;
      remainingDaily: number;
    }
  | {
      allowed: false;
      reason: RateLimitReason;
      retryAfterSeconds: number;
    };

type RateLimitEntry = {
  hourWindowStartedAt: number;
  dayWindowStartedAt: number;
  hourlyCount: number;
  dailyCount: number;
};

type RateLimiterOptions = {
  hourlyLimit: number;
  dailyLimit: number;
  now?: () => number;
};

type GenerationRateLimitCheckerOptions = RateLimiterOptions & {
  fetchImpl?: typeof fetch;
  nodeEnv?: string;
  redisUrl?: string;
  redisToken?: string;
};

type RedisResponse = {
  result?: unknown;
  error?: string;
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const DISTRIBUTED_RATE_LIMIT_FAIL_CLOSED_SECONDS = 60;

function parsePositiveIntegerEnvLimit(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const entries = new Map<string, RateLimitEntry>();
  const now = options.now ?? (() => Date.now());

  function normalizeKey(key: string): string {
    return key.trim() || "anonymous";
  }

  function check(key: string): RateLimitResult {
    const normalizedKey = normalizeKey(key);
    const timestamp = now();
    const existing = entries.get(normalizedKey);
    const entry: RateLimitEntry = existing ?? {
      hourWindowStartedAt: timestamp,
      dayWindowStartedAt: timestamp,
      hourlyCount: 0,
      dailyCount: 0
    };

    if (timestamp - entry.hourWindowStartedAt >= HOUR_MS) {
      entry.hourWindowStartedAt = timestamp;
      entry.hourlyCount = 0;
    }

    if (timestamp - entry.dayWindowStartedAt >= DAY_MS) {
      entry.dayWindowStartedAt = timestamp;
      entry.dailyCount = 0;
    }

    if (entry.hourlyCount >= options.hourlyLimit) {
      return {
        allowed: false,
        reason: "HOURLY_LIMIT",
        retryAfterSeconds: Math.max(
          Math.ceil((HOUR_MS - (timestamp - entry.hourWindowStartedAt)) / 1000),
          1
        )
      };
    }

    if (entry.dailyCount >= options.dailyLimit) {
      return {
        allowed: false,
        reason: "DAILY_LIMIT",
        retryAfterSeconds: Math.max(
          Math.ceil((DAY_MS - (timestamp - entry.dayWindowStartedAt)) / 1000),
          1
        )
      };
    }

    entry.hourlyCount += 1;
    entry.dailyCount += 1;
    entries.set(normalizedKey, entry);

    return {
      allowed: true,
      remainingHourly: Math.max(options.hourlyLimit - entry.hourlyCount, 0),
      remainingDaily: Math.max(options.dailyLimit - entry.dailyCount, 0)
    };
  }

  return { check };
}

function normalizeKey(key: string): string {
  return key.trim() || "anonymous";
}

function getWindowInfo(timestamp: number, windowMs: number) {
  const windowStartedAt = Math.floor(timestamp / windowMs) * windowMs;
  return {
    retryAfterSeconds: Math.max(Math.ceil((windowStartedAt + windowMs - timestamp) / 1000), 1),
    windowId: Math.floor(timestamp / windowMs)
  };
}

function buildRedisUrl(baseUrl: string, ...segments: string[]): string {
  const trimmedBaseUrl = baseUrl.replace(/\/+$/, "");
  return `${trimmedBaseUrl}/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}

async function readRedisResult<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as RedisResponse | null;
  if (!response.ok || !payload || typeof payload !== "object" || payload.error) {
    throw new Error("REDIS_REST_FAILED");
  }

  return payload.result as T;
}

async function redisIncr(
  fetchImpl: typeof fetch,
  redisUrl: string,
  redisToken: string,
  key: string
): Promise<number> {
  const response = await fetchImpl(buildRedisUrl(redisUrl, "incr", key), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`
    }
  });

  const result = await readRedisResult<number>(response);
  if (typeof result !== "number") {
    throw new Error("REDIS_REST_FAILED");
  }

  return result;
}

async function redisExpire(
  fetchImpl: typeof fetch,
  redisUrl: string,
  redisToken: string,
  key: string,
  ttlSeconds: number
): Promise<void> {
  const response = await fetchImpl(buildRedisUrl(redisUrl, "expire", key, String(ttlSeconds)), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`
    }
  });

  const result = await readRedisResult<number>(response);
  if (typeof result !== "number") {
    throw new Error("REDIS_REST_FAILED");
  }
}

async function checkGenerationRateLimitWithRedis(
  key: string,
  options: Required<Pick<GenerationRateLimitCheckerOptions, "hourlyLimit" | "dailyLimit">> & {
    fetchImpl: typeof fetch;
    redisUrl: string;
    redisToken: string;
    now: () => number;
  }
): Promise<RateLimitResult> {
  const normalizedKey = normalizeKey(key);
  const timestamp = options.now();
  const hourlyWindow = getWindowInfo(timestamp, HOUR_MS);
  const dailyWindow = getWindowInfo(timestamp, DAY_MS);
  const hourlyKey = `generation:hour:${normalizedKey}:${hourlyWindow.windowId}`;
  const dailyKey = `generation:day:${normalizedKey}:${dailyWindow.windowId}`;

  try {
    const hourlyCount = await redisIncr(
      options.fetchImpl,
      options.redisUrl,
      options.redisToken,
      hourlyKey
    );
    if (hourlyCount === 1) {
      await redisExpire(
        options.fetchImpl,
        options.redisUrl,
        options.redisToken,
        hourlyKey,
        hourlyWindow.retryAfterSeconds
      );
    }
    if (hourlyCount > options.hourlyLimit) {
      return {
        allowed: false,
        reason: "HOURLY_LIMIT",
        retryAfterSeconds: hourlyWindow.retryAfterSeconds
      };
    }

    const dailyCount = await redisIncr(
      options.fetchImpl,
      options.redisUrl,
      options.redisToken,
      dailyKey
    );
    if (dailyCount === 1) {
      await redisExpire(
        options.fetchImpl,
        options.redisUrl,
        options.redisToken,
        dailyKey,
        dailyWindow.retryAfterSeconds
      );
    }
    if (dailyCount > options.dailyLimit) {
      return {
        allowed: false,
        reason: "DAILY_LIMIT",
        retryAfterSeconds: dailyWindow.retryAfterSeconds
      };
    }

    return {
      allowed: true,
      remainingHourly: Math.max(options.hourlyLimit - hourlyCount, 0),
      remainingDaily: Math.max(options.dailyLimit - dailyCount, 0)
    };
  } catch {
    return {
      allowed: false,
      reason: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: DISTRIBUTED_RATE_LIMIT_FAIL_CLOSED_SECONDS
    };
  }
}

export function createGenerationRateLimitChecker(options?: GenerationRateLimitCheckerOptions) {
  const hourlyLimit =
    options?.hourlyLimit ??
    parsePositiveIntegerEnvLimit(process.env.GENERATION_RATE_LIMIT_PER_HOUR, 3);
  const dailyLimit =
    options?.dailyLimit ?? parsePositiveIntegerEnvLimit(process.env.GENERATION_RATE_LIMIT_PER_DAY, 10);
  const now = options?.now ?? (() => Date.now());
  const fetchImpl = options?.fetchImpl ?? fetch;
  const nodeEnv = options?.nodeEnv ?? process.env.NODE_ENV;
  const redisUrl = options?.redisUrl ?? process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = options?.redisToken ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    if (nodeEnv === "production") {
      return {
        check: async (): Promise<RateLimitResult> => ({
          allowed: false,
          reason: "RATE_LIMIT_CONFIGURATION_ERROR",
          retryAfterSeconds: DISTRIBUTED_RATE_LIMIT_FAIL_CLOSED_SECONDS
        })
      };
    }

    const limiter = createRateLimiter({
      hourlyLimit,
      dailyLimit,
      now
    });

    return {
      check: async (key: string) => limiter.check(key)
    };
  }

  return {
    check: (key: string) =>
      checkGenerationRateLimitWithRedis(key, {
        hourlyLimit,
        dailyLimit,
        fetchImpl,
        now,
        redisUrl,
        redisToken
      })
  };
}

const defaultGenerationRateLimitChecker = createGenerationRateLimitChecker();

export function checkGenerationRateLimit(key: string) {
  return defaultGenerationRateLimitChecker.check(key);
}
