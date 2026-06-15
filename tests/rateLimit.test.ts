import { describe, expect, it, vi } from "vitest";
import { createGenerationRateLimitChecker, createRateLimiter } from "@/lib/rateLimit";

describe("rate limiter", () => {
  it("allows requests within the hourly and daily limits", () => {
    const limiter = createRateLimiter({
      hourlyLimit: 2,
      dailyLimit: 3,
      now: () => 1000
    });

    expect(limiter.check("127.0.0.1").allowed).toBe(true);
    expect(limiter.check("127.0.0.1").allowed).toBe(true);
  });

  it("blocks after the hourly limit", () => {
    const limiter = createRateLimiter({
      hourlyLimit: 1,
      dailyLimit: 10,
      now: () => 1000
    });

    expect(limiter.check("127.0.0.1").allowed).toBe(true);
    expect(limiter.check("127.0.0.1")).toMatchObject({
      allowed: false,
      reason: "HOURLY_LIMIT",
      retryAfterSeconds: 3600
    });
  });

  it("blocks after the daily limit", () => {
    const limiter = createRateLimiter({
      hourlyLimit: 10,
      dailyLimit: 1,
      now: () => 1000
    });

    expect(limiter.check("127.0.0.1").allowed).toBe(true);
    expect(limiter.check("127.0.0.1")).toMatchObject({
      allowed: false,
      reason: "DAILY_LIMIT",
      retryAfterSeconds: 24 * 60 * 60
    });
  });

  it("resets the hourly window", () => {
    let current = 1000;
    const limiter = createRateLimiter({
      hourlyLimit: 1,
      dailyLimit: 10,
      now: () => current
    });

    expect(limiter.check("127.0.0.1").allowed).toBe(true);
    current += 60 * 60 * 1000 + 1;
    expect(limiter.check("127.0.0.1").allowed).toBe(true);
  });

  it("uses a stable fallback key for missing IPs", () => {
    const limiter = createRateLimiter({
      hourlyLimit: 1,
      dailyLimit: 1,
      now: () => 1000
    });

    expect(limiter.check("").allowed).toBe(true);
    expect(limiter.check("")).toMatchObject({
      allowed: false,
      reason: "HOURLY_LIMIT"
    });
  });

  it("falls back to the in-memory limiter outside production when redis env is unavailable", async () => {
    const checker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      nodeEnv: "development",
      redisUrl: "",
      redisToken: "",
      now: () => 1000
    });

    expect(await checker.check("127.0.0.1")).toMatchObject({ allowed: true });
    expect(await checker.check("127.0.0.1")).toMatchObject({
      allowed: false,
      reason: "HOURLY_LIMIT"
    });
  });

  it("fails closed in production when redis env is unavailable", async () => {
    const missingBothChecker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      nodeEnv: "production",
      redisUrl: "",
      redisToken: "",
      now: () => 1000
    });
    const missingTokenChecker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      nodeEnv: "production",
      redisUrl: "https://example.upstash.io",
      redisToken: "",
      now: () => 1000
    });

    const expectedResult = {
      allowed: false,
      reason: "RATE_LIMIT_CONFIGURATION_ERROR",
      retryAfterSeconds: 60
    } as const;

    expect(await missingBothChecker.check("127.0.0.1")).toEqual(expectedResult);
    expect(await missingTokenChecker.check("127.0.0.1")).toEqual(expectedResult);
  });

  it("uses redis rest when configured and returns remaining counts", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: 1 }), { status: 200 }));
    const checker = createGenerationRateLimitChecker({
      hourlyLimit: 2,
      dailyLimit: 3,
      now: () => 0,
      redisUrl: "https://example.upstash.io",
      redisToken: "secret-token",
      fetchImpl: fetchMock
    });

    const result = await checker.check(" 127.0.0.1 ");

    expect(result).toEqual({
      allowed: true,
      remainingHourly: 1,
      remainingDaily: 2
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://example.upstash.io/incr/generation%3Ahour%3A127.0.0.1%3A0",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer secret-token" }
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://example.upstash.io/expire/generation%3Ahour%3A127.0.0.1%3A0/3600",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer secret-token" }
      })
    );
  });

  it("fails closed when redis rest is unavailable", async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error("network down");
    });
    const checker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      now: () => 0,
      redisUrl: "https://example.upstash.io",
      redisToken: "secret-token",
      fetchImpl: fetchMock
    });

    const result = await checker.check("127.0.0.1");

    expect(result).toEqual({
      allowed: false,
      reason: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: 60
    });
  });

  it("fails closed when redis rest returns a malformed response", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ result: "not-a-number" }), { status: 200 })
    );
    const checker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      now: () => 0,
      redisUrl: "https://example.upstash.io",
      redisToken: "secret-token",
      fetchImpl: fetchMock
    });

    expect(await checker.check("127.0.0.1")).toEqual({
      allowed: false,
      reason: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: 60
    });
  });

  it("fails closed when a partial redis rest command fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: 1 }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "ERR" }), { status: 500 }));
    const checker = createGenerationRateLimitChecker({
      hourlyLimit: 1,
      dailyLimit: 1,
      now: () => 0,
      redisUrl: "https://example.upstash.io",
      redisToken: "secret-token",
      fetchImpl: fetchMock
    });

    expect(await checker.check("127.0.0.1")).toEqual({
      allowed: false,
      reason: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: 60
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
