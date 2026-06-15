import { beforeEach, describe, expect, it, vi } from "vitest";

const rateLimitCheck = vi.hoisted(() => vi.fn());
const findExampleByIdMock = vi.hoisted(() => vi.fn());
const chatCreateMock = vi.hoisted(() => vi.fn());
const responsesCreateMock = vi.hoisted(() => vi.fn());
const imageGenerateMock = vi.hoisted(() => vi.fn());
const openAiConstructorMock = vi.hoisted(() =>
  vi.fn(function OpenAIMock(this: {
    chat: { completions: { create: typeof chatCreateMock } };
    responses: { create: typeof responsesCreateMock };
    images: { generate: typeof imageGenerateMock };
  }) {
    this.chat = { completions: { create: chatCreateMock } };
    this.responses = { create: responsesCreateMock };
    this.images = { generate: imageGenerateMock };
  })
);

vi.mock("@/lib/rateLimit", () => ({
  checkGenerationRateLimit: rateLimitCheck
}));

vi.mock("@/lib/examples", () => ({
  findExampleById: findExampleByIdMock
}));

vi.mock("openai", () => ({
  default: openAiConstructorMock
}));

const example = {
  id: "cyberpunk-avatar",
  title: "赛博朋克头像",
  category: "头像",
  tags: ["头像", "霓虹", "酷炫"],
  description: "霓虹灯、电影感、强烈角色氛围。",
  sampleImageUrl: "/examples/awesome-case-5.jpg",
  originalPrompt:
    "生成一张赛博朋克风格头像，主体位于画面中心，半身近景，背景是雨夜城市霓虹灯和浅景深光斑。画面具有电影感光影，冷暖对比明显，脸部边缘有蓝紫色轮廓光，细节清晰，质感高级，适合作为社交媒体头像。",
  defaultAspectRatio: "1:1"
} as const;

async function loadRoute() {
  return import("@/app/api/generate/route");
}

async function loadStatusRoute() {
  return import("@/app/api/generate/status/route");
}

describe("generation api route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    rateLimitCheck.mockReset();
    findExampleByIdMock.mockReset();
    findExampleByIdMock.mockReturnValue(example);
    chatCreateMock.mockReset();
    responsesCreateMock.mockReset();
    imageGenerateMock.mockReset();
    openAiConstructorMock.mockClear();
  });

  it("rejects malformed JSON before rate limiting", async () => {
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: "{"
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, error: "INVALID_REQUEST" });
    expect(findExampleByIdMock).not.toHaveBeenCalled();
    expect(rateLimitCheck).not.toHaveBeenCalled();
  });

  it("rejects missing required fields before rate limiting", async () => {
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, error: "MISSING_USER_INSTRUCTION" });
    expect(findExampleByIdMock).not.toHaveBeenCalled();
    expect(rateLimitCheck).not.toHaveBeenCalled();
  });

  it("rejects missing exampleId before rate limiting", async () => {
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "   ",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, error: "MISSING_EXAMPLE_ID" });
    expect(findExampleByIdMock).not.toHaveBeenCalled();
    expect(rateLimitCheck).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown example before consuming a rate-limit slot", async () => {
    findExampleByIdMock.mockReturnValue(null);
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "missing",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toMatchObject({ ok: false, error: "EXAMPLE_NOT_FOUND" });
    expect(findExampleByIdMock).toHaveBeenCalledWith("missing");
    expect(rateLimitCheck).not.toHaveBeenCalled();
  });

  it("includes retryAfterSeconds on 429 responses", async () => {
    rateLimitCheck.mockResolvedValue({
      allowed: false,
      reason: "HOURLY_LIMIT",
      retryAfterSeconds: 321
    });
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "x-real-ip": " 203.0.113.9 ",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toMatchObject({
      ok: false,
      error: "HOURLY_LIMIT",
      retryAfterSeconds: 321
    });
    expect(findExampleByIdMock).toHaveBeenCalledWith("cyberpunk-avatar");
    expect(rateLimitCheck).toHaveBeenCalledWith("203.0.113.9");
  });

  it("surfaces async limiter configuration failures as 429 responses", async () => {
    rateLimitCheck.mockResolvedValue({
      allowed: false,
      reason: "RATE_LIMIT_CONFIGURATION_ERROR",
      retryAfterSeconds: 60
    });
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      ok: false,
      error: "RATE_LIMIT_CONFIGURATION_ERROR",
      retryAfterSeconds: 60
    });
  });

  it("surfaces async limiter service failures as 429 responses", async () => {
    rateLimitCheck.mockResolvedValue({
      allowed: false,
      reason: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: 60
    });
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      ok: false,
      error: "RATE_LIMIT_SERVICE_UNAVAILABLE",
      retryAfterSeconds: 60
    });
  });

  it("can use separate providers for text rewriting and image generation", async () => {
    vi.stubEnv("TEXT_API_KEY", "text-key");
    vi.stubEnv("TEXT_BASE_URL", "https://text.example/v1");
    vi.stubEnv("TEXT_MODEL", "text-model");
    vi.stubEnv("TEXT_API_MODE", "chat");
    vi.stubEnv("IMAGE_API_KEY", "image-key");
    vi.stubEnv("IMAGE_BASE_URL", "https://image.example/v1");
    vi.stubEnv("IMAGE_MODEL", "image-model");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    chatCreateMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: "改写后的图片提示词"
          }
        }
      ]
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              b64_json: "abc123"
            }
          ]
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      )
    );

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({
      ok: true,
      jobId: expect.any(String),
      status: expect.stringMatching(/queued|running|success/)
    });
    expect(openAiConstructorMock).toHaveBeenCalledWith({
      apiKey: "text-key",
      baseURL: "https://text.example/v1"
    });
    expect(openAiConstructorMock).toHaveBeenCalledWith({
      apiKey: "image-key",
      baseURL: "https://image.example/v1"
    });
    expect(chatCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "text-model"
      })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "https://image.example/v1/images/generations",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer image-key"
        }),
        body: JSON.stringify({
          model: "image-model",
          prompt: "改写后的图片提示词",
          size: "1024x1024"
        })
      })
    );

    const { GET } = await loadStatusRoute();
    await vi.waitFor(async () => {
      const statusResponse = await GET(
        new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
      );
      const statusPayload = await statusResponse.json();
      expect(statusResponse.status).toBe(200);
      expect(statusPayload).toMatchObject({
        ok: true,
        jobId: payload.jobId,
        status: "success",
        imageUrl: "data:image/png;base64,abc123",
        rewrittenPrompt: "改写后的图片提示词"
      });
    });
  });

  it("supports free prompt generation without an exampleId", async () => {
    vi.stubEnv("OPENAI_API_KEY", "openai-key");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    responsesCreateMock.mockResolvedValue({
      output_text: "优化后自由提示词"
    });
    imageGenerateMock.mockResolvedValue({
      data: [{ b64_json: "free-image" }]
    });

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "free",
        sessionId: "session-1",
        messageId: "assistant-1",
        prompt: "一只橘猫坐在雨夜霓虹街道中央"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({
      ok: true,
      sessionId: "session-1",
      messageId: "assistant-1",
      jobId: expect.any(String)
    });
    expect(findExampleByIdMock).not.toHaveBeenCalled();

    const { GET } = await loadStatusRoute();
    await vi.waitFor(async () => {
      const statusResponse = await GET(
        new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
      );
      const statusPayload = await statusResponse.json();
      expect(statusPayload).toMatchObject({
        ok: true,
        sessionId: "session-1",
        messageId: "assistant-1",
        status: "success",
        imageUrl: "data:image/png;base64,free-image",
        rewrittenPrompt: "优化后自由提示词"
      });
    });
  });

  it("rejects missing free prompts before rate limiting", async () => {
    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "free",
        prompt: "   "
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, error: "MISSING_PROMPT" });
    expect(rateLimitCheck).not.toHaveBeenCalled();
  });

  it("includes session and message ids on image generation failures", async () => {
    vi.stubEnv("OPENAI_API_KEY", "openai-key");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    responsesCreateMock.mockResolvedValue({
      output_text: "优化后自由提示词"
    });
    imageGenerateMock.mockRejectedValue(new Error("IMAGE_GENERATION_FAILED"));

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "free",
        sessionId: "session-1",
        messageId: "assistant-1",
        prompt: "一只橘猫坐在雨夜霓虹街道中央"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({
      ok: true,
      sessionId: "session-1",
      messageId: "assistant-1",
      jobId: expect.any(String)
    });

    const { GET } = await loadStatusRoute();
    await vi.waitFor(async () => {
      const statusResponse = await GET(
        new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
      );
      const statusPayload = await statusResponse.json();
      expect(statusPayload).toMatchObject({
        ok: false,
        sessionId: "session-1",
        messageId: "assistant-1",
        status: "error",
        error: "IMAGE_GENERATION_FAILED"
      });
    });
  });

  it("returns a stable timeout error code when image generation times out", async () => {
    vi.stubEnv("OPENAI_API_KEY", "openai-key");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    responsesCreateMock.mockResolvedValue({
      output_text: "优化后自由提示词"
    });
    imageGenerateMock.mockRejectedValue(new Error("IMAGE_API_TIMEOUT"));

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "free",
        sessionId: "session-1",
        messageId: "assistant-1",
        prompt: "一只橘猫坐在雨夜霓虹街道中央"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({
      ok: true,
      sessionId: "session-1",
      messageId: "assistant-1",
      jobId: expect.any(String)
    });

    const { GET } = await loadStatusRoute();
    await vi.waitFor(async () => {
      const statusResponse = await GET(
        new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
      );
      const statusPayload = await statusResponse.json();
      expect(statusPayload).toMatchObject({
        ok: false,
        sessionId: "session-1",
        messageId: "assistant-1",
        status: "error",
        error: "IMAGE_API_TIMEOUT"
      });
    });
  });

  it("aborts custom image provider requests using IMAGE_TIMEOUT_MS", async () => {
    vi.useFakeTimers();
    vi.stubEnv("TEXT_API_KEY", "text-key");
    vi.stubEnv("TEXT_BASE_URL", "https://text.example/v1");
    vi.stubEnv("TEXT_API_MODE", "chat");
    vi.stubEnv("IMAGE_API_KEY", "image-key");
    vi.stubEnv("IMAGE_BASE_URL", "https://image.example/v1");
    vi.stubEnv("IMAGE_TIMEOUT_MS", "5");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    chatCreateMock.mockResolvedValue({
      choices: [{ message: { content: "改写后的图片提示词" } }]
    });
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;
          signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        })
    );

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({ ok: true, jobId: expect.any(String) });

    await vi.advanceTimersByTimeAsync(5);

    const { GET } = await loadStatusRoute();
    await vi.waitFor(async () => {
      const statusResponse = await GET(
        new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
      );
      const statusPayload = await statusResponse.json();
      expect(statusResponse.status).toBe(200);
      expect(statusPayload).toMatchObject({ ok: false, status: "error", error: "IMAGE_API_TIMEOUT" });
    });
    expect(console.warn).toHaveBeenCalledWith("⚠ 图片 API 超时:", 5, "ms");
    vi.useRealTimers();
  });

  it("does not abort custom image provider requests by default", async () => {
    vi.useFakeTimers();
    vi.stubEnv("TEXT_API_KEY", "text-key");
    vi.stubEnv("TEXT_BASE_URL", "https://text.example/v1");
    vi.stubEnv("TEXT_API_MODE", "chat");
    vi.stubEnv("IMAGE_API_KEY", "image-key");
    vi.stubEnv("IMAGE_BASE_URL", "https://image.example/v1");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    chatCreateMock.mockResolvedValue({
      choices: [{ message: { content: "改写后的图片提示词" } }]
    });
    const abortMock = vi.fn();
    vi.spyOn(globalThis, "fetch").mockImplementation(
      (_url, init) =>
        new Promise<Response>(() => {
          init?.signal?.addEventListener("abort", abortMock);
        })
    );

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        exampleId: "cyberpunk-avatar",
        userInstruction: "把主角换成橘猫"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    await vi.advanceTimersByTimeAsync(61_000);

    const { GET } = await loadStatusRoute();
    const statusResponse = await GET(
      new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
    );
    const statusPayload = await statusResponse.json();

    expect(response.status).toBe(202);
    expect(abortMock).not.toHaveBeenCalled();
    expect(statusPayload).toMatchObject({ ok: true, status: "running" });
    vi.useRealTimers();
  });

  it("returns a job id before a slow image provider finishes", async () => {
    vi.stubEnv("TEXT_API_KEY", "text-key");
    vi.stubEnv("TEXT_BASE_URL", "https://text.example/v1");
    vi.stubEnv("TEXT_API_MODE", "chat");
    vi.stubEnv("IMAGE_API_KEY", "image-key");
    vi.stubEnv("IMAGE_BASE_URL", "https://image.example/v1");
    rateLimitCheck.mockResolvedValue({ allowed: true });
    chatCreateMock.mockResolvedValue({
      choices: [{ message: { content: "改写后的图片提示词" } }]
    });
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise<Response>(() => undefined));

    const { POST } = await loadRoute();
    const request = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: "free",
        sessionId: "session-1",
        messageId: "assistant-1",
        prompt: "一只橘猫坐在雨夜霓虹街道中央"
      })
    });

    const response = await POST(request as unknown as never);
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(payload).toMatchObject({
      ok: true,
      sessionId: "session-1",
      messageId: "assistant-1",
      jobId: expect.any(String),
      status: expect.stringMatching(/queued|running/)
    });

    const { GET } = await loadStatusRoute();
    const statusResponse = await GET(
      new Request(`http://localhost/api/generate/status?jobId=${payload.jobId}`) as unknown as never
    );
    const statusPayload = await statusResponse.json();
    expect(statusPayload).toMatchObject({
      ok: true,
      jobId: payload.jobId,
      status: "running"
    });
  });
});
