import type { PromptExample } from "@/lib/types";

export function normalizeUserInstruction(value: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    throw new Error("EMPTY_INSTRUCTION");
  }
  if (normalized.length > 500) {
    throw new Error("INSTRUCTION_TOO_LONG");
  }
  return normalized;
}

export function normalizeFreePrompt(value: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    throw new Error("EMPTY_PROMPT");
  }
  if (normalized.length > 2000) {
    throw new Error("PROMPT_TOO_LONG");
  }
  return normalized;
}

function normalizePreviousRewrittenPrompt(value?: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, 3000);
}

export function buildRewriteInput({
  example,
  userInstruction,
  previousRewrittenPrompt
}: {
  example: PromptExample;
  userInstruction: string;
  previousRewrittenPrompt?: string;
}): string {
  const instruction = normalizeUserInstruction(userInstruction);
  const normalizedPreviousPrompt = normalizePreviousRewrittenPrompt(previousRewrittenPrompt);

  return [
    "你是 AI 生图提示词改写器。",
    "你的任务是基于一个已有提示词样例和用户的一句话修改要求，生成一条新的高质量生图提示词。",
    "只输出最终可用于生图的提示词，不要解释，不要 Markdown，不要编号。",
    "",
    `样例标题：${example.title}`,
    `样例分类：${example.category}`,
    `样例标签：${example.tags.join(" / ")}`,
    `推荐比例：${example.defaultAspectRatio}`,
    "",
    "原始提示词：",
    example.originalPrompt,
    "",
    normalizedPreviousPrompt ? `上一轮优化提示词：\n${normalizedPreviousPrompt}\n` : "",
    "用户修改要求：",
    instruction,
    "",
    "改写规则：",
    "1. 保留原始样例的视觉质量、构图逻辑和风格核心。",
    "2. 明确执行用户修改要求。",
    "3. 如果用户要求改变比例，在提示词末尾明确比例。",
    "4. 如果用户要求不要文字，要明确画面中不出现文字。",
    "5. 使用自然、具体、可执行的中文提示词。",
    "6. 不输出解释，只输出最终提示词。"
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildFreePromptInput(prompt: string): string {
  const normalizedPrompt = normalizeFreePrompt(prompt);

  return [
    "你是 AI 生图提示词优化器。",
    "你的任务是把用户直接输入的画面描述优化成一条高质量生图提示词。",
    "只输出最终可用于生图的提示词，不要解释，不要 Markdown，不要编号。",
    "",
    "用户画面描述：",
    normalizedPrompt,
    "",
    "优化规则：",
    "1. 保留用户指定的主体、场景、风格和比例。",
    "2. 补充清晰的构图、光线、材质、镜头和画面质量描述。",
    "3. 如果用户要求不要文字，要明确画面中不出现文字。",
    "4. 使用自然、具体、可执行的中文提示词。",
    "5. 不输出解释，只输出最终提示词。"
  ].join("\n");
}

export function buildFallbackRewrittenPrompt({
  example,
  userInstruction,
  previousRewrittenPrompt
}: {
  example: PromptExample;
  userInstruction: string;
  previousRewrittenPrompt?: string;
}): string {
  const basePrompt = normalizePreviousRewrittenPrompt(previousRewrittenPrompt) || example.originalPrompt;
  const instruction = normalizeUserInstruction(userInstruction);
  return `${basePrompt}\n\n用户修改要求：${instruction}\n\n请严格根据修改要求调整主体、场景、风格或比例，同时保持画面高级、清晰、构图完整。`;
}
