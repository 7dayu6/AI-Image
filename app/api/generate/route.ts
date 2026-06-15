import OpenAI from "openai";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming
} from "openai/resources/chat/completions";
import { NextRequest, NextResponse } from "next/server";
import { findExampleById } from "@/lib/examples";
import {
  buildFreePromptInput,
  buildFallbackRewrittenPrompt,
  buildRewriteInput,
  normalizeFreePrompt,
  normalizeUserInstruction
} from "@/lib/promptRewrite";
import { createGenerationJob, runGenerationJob, toGenerationResponse } from "@/lib/generationJobs";
import { checkGenerationRateLimit } from "@/lib/rateLimit";
import type { GenerationRequestBody, GenerationResponseBody } from "@/lib/types";

type ChatCompletionCreatePayload = ChatCompletionCreateParamsNonStreaming & {
  extra_body?: {
    thinking?: {
      type: "enabled" | "disabled";
    };
  };
};

const textApiKey = process.env.TEXT_API_KEY || process.env.OPENAI_API_KEY;
const textBaseUrl = process.env.TEXT_BASE_URL || process.env.OPENAI_BASE_URL;
const imageApiKey = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY;
const imageBaseUrl = process.env.IMAGE_BASE_URL || process.env.OPENAI_BASE_URL;

function readTimeoutMs(envName: string): number | undefined {
  const rawValue = process.env[envName] || process.env.OPENAI_TIMEOUT_MS;
  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.floor(value);
}

const textTimeoutMs = readTimeoutMs("TEXT_TIMEOUT_MS");
const imageTimeoutMs = readTimeoutMs("IMAGE_TIMEOUT_MS");

const textClient = textApiKey
  ? new OpenAI({
      apiKey: textApiKey,
      baseURL: textBaseUrl || undefined,
      ...(textTimeoutMs === undefined ? {} : { timeout: textTimeoutMs })
    })
  : null;

const imageClient = imageApiKey
  ? new OpenAI({
      apiKey: imageApiKey,
      baseURL: imageBaseUrl || undefined,
      ...(imageTimeoutMs === undefined ? {} : { timeout: imageTimeoutMs })
    })
  : null;

function json(status: number, payload: GenerationResponseBody) {
  return NextResponse.json(payload, { status });
}

function generationErrorCode(error: unknown): string {
  if (!(error instanceof Error)) {
    return "IMAGE_GENERATION_FAILED";
  }

  const message = error.message;

  if (message === "OPENAI_NOT_CONFIGURED") {
    return "SERVER_NOT_CONFIGURED";
  }
  if (message === "IMAGE_API_TIMEOUT") {
    return "IMAGE_API_TIMEOUT";
  }
  if (message === "IMAGE_NETWORK_ERROR") {
    return "IMAGE_NETWORK_ERROR";
  }
  if (message.startsWith("IMAGE_API_ERROR:")) {
    const apiMessage = message.slice("IMAGE_API_ERROR:".length).trim();
    return `图片生成失败: ${apiMessage}`;
  }
  return "IMAGE_GENERATION_FAILED";
}

function getClientIp(request: NextRequest): string {
  // Trust these only when they are set by the deployment platform or a trusted proxy.
  // If this app is directly exposed, callers can spoof these headers.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const forwardedFor = request.headers.get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwardedFor) {
    return forwardedFor;
  }

  return "anonymous";
}

type ParsedRequestBody =
  | {
      ok: true;
      body: GenerationRequestBody;
    }
  | {
      ok: false;
      sessionId?: string;
      messageId?: string;
      error:
        | "INVALID_REQUEST"
        | "MISSING_EXAMPLE_ID"
        | "MISSING_USER_INSTRUCTION"
        | "MISSING_PROMPT";
    };

function readOptionalIdentifier(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

async function readBody(request: NextRequest): Promise<ParsedRequestBody> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return { ok: false, error: "INVALID_REQUEST" };
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "INVALID_REQUEST" };
  }

  const record = payload as Record<string, unknown>;
  const sessionId = readOptionalIdentifier(record.sessionId);
  const messageId = readOptionalIdentifier(record.messageId);
  const mode = record.mode === undefined ? "template" : record.mode;

  if (mode !== "template" && mode !== "free") {
    return { ok: false, sessionId, messageId, error: "INVALID_REQUEST" };
  }

  if (mode === "free") {
    const prompt = typeof record.prompt === "string" ? record.prompt : "";
    if (!prompt.trim()) {
      return { ok: false, sessionId, messageId, error: "MISSING_PROMPT" };
    }

    return {
      ok: true,
      body: {
        mode: "free",
        sessionId,
        messageId,
        prompt
      }
    };
  }

  const exampleId = typeof record.exampleId === "string" ? record.exampleId.trim() : "";
  if (!exampleId) {
    return { ok: false, sessionId, messageId, error: "MISSING_EXAMPLE_ID" };
  }

  const userInstruction =
    typeof record.userInstruction === "string" ? record.userInstruction.trim() : "";
  if (!userInstruction) {
    return { ok: false, sessionId, messageId, error: "MISSING_USER_INSTRUCTION" };
  }

  return {
    ok: true,
    body: {
      mode: record.mode === "template" ? "template" : undefined,
      sessionId,
      messageId,
      exampleId,
      userInstruction,
      previousRewrittenPrompt:
        typeof record.previousRewrittenPrompt === "string"
          ? record.previousRewrittenPrompt
          : undefined
    }
  };
}

async function rewritePromptWithModel(input: string): Promise<string> {
  if (!textClient) {
    throw new Error("OPENAI_NOT_CONFIGURED");
  }

  if (
    process.env.TEXT_API_MODE === "chat" ||
    (textBaseUrl && process.env.TEXT_API_MODE !== "responses")
  ) {
    const payload: ChatCompletionCreatePayload = {
      model: process.env.TEXT_MODEL || "gpt-4.1-mini",
      stream: false,
      messages: [
        {
          role: "user",
          content: input
        }
      ]
    };
    if (process.env.TEXT_THINKING === "enabled" || process.env.TEXT_THINKING === "disabled") {
      payload.extra_body = {
        thinking: {
          type: process.env.TEXT_THINKING
        }
      };
    }

    const response = (await textClient.chat.completions.create(payload)) as ChatCompletion;

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("REWRITE_FAILED");
    }
    return text;
  }

  const response = await textClient.responses.create({
    model: process.env.TEXT_MODEL || "gpt-4.1-mini",
    input
  });

  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("REWRITE_FAILED");
  }
  return text;
}

async function generateImage(prompt: string): Promise<string> {
  if (!imageApiKey || !imageClient) {
    throw new Error("OPENAI_NOT_CONFIGURED");
  }

  if (imageBaseUrl) {
    const controller = imageTimeoutMs === undefined ? undefined : new AbortController();
    const timeoutId =
      controller && imageTimeoutMs !== undefined
        ? setTimeout(() => controller.abort(), imageTimeoutMs)
        : undefined;
    const url = `${imageBaseUrl.replace(/\/$/, "")}/images/generations`;

    try {
      console.log("🖼  调用图片 API:", url, "model:", process.env.IMAGE_MODEL || "gpt-image-2");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${imageApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.IMAGE_MODEL || "gpt-image-2",
          prompt,
          size: "1024x1024"
        }),
        signal: controller?.signal
      });

      const payload = (await response.json()) as
        | {
            data?: Array<{
              b64_json?: string;
              url?: string;
            }>;
            error?: {
              message?: string;
            };
          }
        | null;

      if (!response.ok) {
        const apiError = payload?.error?.message || `HTTP ${response.status}`;
        console.error("❌ 图片 API 返回错误:", response.status, apiError);
        throw new Error(`IMAGE_API_ERROR: ${apiError}`);
      }

      console.log("✅ 图片 API 返回 200");
      const image = payload?.data?.[0];
      if (image?.b64_json) {
        return `data:image/png;base64,${image.b64_json}`;
      }
      if (image?.url) {
        return image.url;
      }
      throw new Error("IMAGE_API_ERROR: 响应中未包含图片数据");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (imageTimeoutMs !== undefined) {
          console.warn("⚠ 图片 API 超时:", imageTimeoutMs, "ms");
        }
        throw new Error("IMAGE_API_TIMEOUT");
      }
      if (error instanceof Error && error.message.startsWith("IMAGE_API_")) {
        throw error;
      }
      throw new Error("IMAGE_NETWORK_ERROR");
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  const result = await imageClient.images.generate({
    model: process.env.IMAGE_MODEL || "gpt-image-2",
    prompt,
    size: "1024x1024"
  });

  const image = result.data?.[0];
  if (image?.b64_json) {
    return `data:image/png;base64,${image.b64_json}`;
  }
  if (image?.url) {
    return image.url;
  }
  throw new Error("IMAGE_API_ERROR: 响应中未包含图片数据");
}

export async function POST(request: NextRequest) {
  const body = await readBody(request);
  if (!body.ok) {
    return json(400, {
      ok: false,
      sessionId: body.sessionId,
      messageId: body.messageId,
      error: body.error
    });
  }

  const { sessionId, messageId } = body.body;
  let rewriteInput: string;
  let fallbackRewrittenPrompt: string;

  if (body.body.mode === "free") {
    let normalizedPrompt: string;
    try {
      normalizedPrompt = normalizeFreePrompt(body.body.prompt);
    } catch (error) {
      const code = error instanceof Error ? error.message : "INVALID_PROMPT";
      return json(400, { ok: false, sessionId, messageId, error: code });
    }

    rewriteInput = buildFreePromptInput(normalizedPrompt);
    fallbackRewrittenPrompt = normalizedPrompt;
  } else {
    const example = findExampleById(body.body.exampleId);
    if (!example) {
      return json(404, { ok: false, sessionId, messageId, error: "EXAMPLE_NOT_FOUND" });
    }

    let normalizedInstruction: string;
    try {
      normalizedInstruction = normalizeUserInstruction(body.body.userInstruction);
    } catch (error) {
      const code = error instanceof Error ? error.message : "INVALID_INSTRUCTION";
      return json(400, { ok: false, sessionId, messageId, error: code });
    }

    rewriteInput = buildRewriteInput({
      example,
      userInstruction: normalizedInstruction,
      previousRewrittenPrompt: body.body.previousRewrittenPrompt
    });
    fallbackRewrittenPrompt = buildFallbackRewrittenPrompt({
      example,
      userInstruction: normalizedInstruction,
      previousRewrittenPrompt: body.body.previousRewrittenPrompt
    });
  }

  const rateLimit = await checkGenerationRateLimit(getClientIp(request));
  if (!rateLimit.allowed) {
    return json(429, {
      ok: false,
      sessionId,
      messageId,
      error: rateLimit.reason,
      retryAfterSeconds: rateLimit.retryAfterSeconds
    });
  }

  const job = createGenerationJob({ sessionId, messageId });

  runGenerationJob(job.id, async () => {
    let rewrittenPrompt: string;
    const rewriteTimer = `⏱  prompt-rewrite ${job.id}`;
    console.time(rewriteTimer);
    try {
      rewrittenPrompt = await rewritePromptWithModel(rewriteInput);
      console.timeEnd(rewriteTimer);
    } catch (rewriteError) {
      console.timeEnd(rewriteTimer);
      console.warn("⚠ rewrite failed, using fallback:", rewriteError);
      rewrittenPrompt = fallbackRewrittenPrompt;
    }

    const imageTimer = `⏱  image-generate ${job.id}`;
    try {
      console.time(imageTimer);
      const imageUrl = await generateImage(rewrittenPrompt);
      console.timeEnd(imageTimer);
      return { imageUrl, rewrittenPrompt };
    } catch (error) {
      console.timeEnd(imageTimer);
      throw new Error(generationErrorCode(error));
    }
  });

  return json(202, toGenerationResponse(job));
}
