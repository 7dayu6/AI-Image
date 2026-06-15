import { describe, expect, it } from "vitest";
import {
  buildFreePromptInput,
  buildRewriteInput,
  normalizeFreePrompt,
  normalizeUserInstruction
} from "@/lib/promptRewrite";
import { examples } from "@/lib/examples";

describe("prompt rewrite helpers", () => {
  it("normalizes user instructions", () => {
    expect(normalizeUserInstruction("  把主角换成橘猫\n背景改成海边日落  ")).toBe(
      "把主角换成橘猫 背景改成海边日落"
    );
  });

  it("rejects empty instructions", () => {
    expect(() => normalizeUserInstruction("   ")).toThrow("EMPTY_INSTRUCTION");
  });

  it("rejects overly long instructions", () => {
    expect(() => normalizeUserInstruction("a".repeat(501))).toThrow("INSTRUCTION_TOO_LONG");
  });

  it("builds a Chinese rewrite instruction with original prompt and user change", () => {
    const input = buildRewriteInput({
      example: examples[0],
      userInstruction: "把主角换成橘猫"
    });

    expect(input).toContain("你是 AI 生图提示词改写器");
    expect(input).toContain("主题海报版式设计");
    expect(input).toContain("把主角换成橘猫");
    expect(input).toContain(examples[0].originalPrompt);
    expect(input).toContain("只输出最终可用于生图的提示词");
  });

  it("normalizes, truncates, and omits the previous rewritten prompt", () => {
    const longPreviousPrompt = `  第一行\n第二行   ${"x".repeat(3100)}`;
    const normalizedLongPreviousPrompt = `第一行 第二行 ${"x".repeat(3100)}`.slice(0, 3000);
    const inputWithPrevious = buildRewriteInput({
      example: examples[0],
      userInstruction: "把主角换成橘猫",
      previousRewrittenPrompt: longPreviousPrompt
    });

    expect(inputWithPrevious).toContain(`上一轮优化提示词：\n${normalizedLongPreviousPrompt}\n`);
    expect(inputWithPrevious).not.toContain(`${normalizedLongPreviousPrompt}x`);

    const inputWithoutPrevious = buildRewriteInput({
      example: examples[0],
      userInstruction: "把主角换成橘猫",
      previousRewrittenPrompt: "   \n  "
    });

    expect(inputWithoutPrevious).not.toContain("上一轮优化提示词");
  });
});

describe("free prompt helpers", () => {
  it("normalizes free prompts", () => {
    expect(normalizeFreePrompt("  一只橘猫\n坐在雨夜霓虹街道中央  ")).toBe(
      "一只橘猫 坐在雨夜霓虹街道中央"
    );
  });

  it("rejects empty free prompts", () => {
    expect(() => normalizeFreePrompt("   ")).toThrow("EMPTY_PROMPT");
  });

  it("rejects overly long free prompts", () => {
    expect(() => normalizeFreePrompt("a".repeat(2001))).toThrow("PROMPT_TOO_LONG");
  });

  it("builds a free prompt normalization instruction", () => {
    const input = buildFreePromptInput("一只橘猫坐在雨夜霓虹街道中央");

    expect(input).toContain("你是 AI 生图提示词优化器");
    expect(input).toContain("一只橘猫坐在雨夜霓虹街道中央");
    expect(input).toContain("只输出最终可用于生图的提示词");
  });
});
