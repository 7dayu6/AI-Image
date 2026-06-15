import { describe, expect, it } from "vitest";
import {
  appendGenerationStart,
  assignAssistantGenerationJob,
  completeAssistantMessage,
  createChatSession,
  failAssistantMessage
} from "@/lib/chatHistory";

describe("chat history helpers", () => {
  it("creates a chat session as soon as the user sends an instruction", () => {
    const session = createChatSession({
      id: "session-1",
      mode: "template",
      title: "把主角换成橘猫",
      now: "2026-06-12T00:00:00.000Z"
    });

    expect(session).toMatchObject({
      id: "session-1",
      mode: "template",
      title: "把主角换成橘猫",
      messages: [],
      messageCount: 0,
      imageCount: 0,
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:00.000Z"
    });
  });

  it("appends a user message and a generating assistant message", () => {
    const session = createChatSession({
      id: "session-1",
      mode: "template",
      title: "把主角换成橘猫",
      now: "2026-06-12T00:00:00.000Z"
    });

    const next = appendGenerationStart(session, {
      userMessageId: "user-1",
      assistantMessageId: "assistant-1",
      content: "把主角换成橘猫",
      mode: "template",
      exampleId: "awesome-case-5",
      exampleTitle: "主题海报版式设计",
      exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
      now: "2026-06-12T00:00:01.000Z"
    });

    expect(session.messages).toHaveLength(0);
    expect(next.messages).toHaveLength(2);
    expect(next.messages[0]).toMatchObject({
      id: "user-1",
      sessionId: "session-1",
      role: "user",
      content: "把主角换成橘猫",
      mode: "template",
      exampleId: "awesome-case-5",
      exampleTitle: "主题海报版式设计",
      exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
      createdAt: "2026-06-12T00:00:01.000Z"
    });
    expect(next.messages[1]).toMatchObject({
      id: "assistant-1",
      sessionId: "session-1",
      role: "assistant",
      status: "generating",
      mode: "template",
      createdAt: "2026-06-12T00:00:01.000Z",
      updatedAt: "2026-06-12T00:00:01.000Z"
    });
    expect(next.messageCount).toBe(2);
    expect(next.imageCount).toBe(0);
    expect(next.lastStatus).toBe("generating");
    expect(next.lastUserInput).toBe("把主角换成橘猫");
    expect(next.updatedAt).toBe("2026-06-12T00:00:01.000Z");
  });

  it("updates the same assistant message to success with image and rewritten prompt", () => {
    const session = appendGenerationStart(
      createChatSession({
        id: "session-1",
        mode: "free",
        title: "雨夜橘猫",
        now: "2026-06-12T00:00:00.000Z"
      }),
      {
        userMessageId: "user-1",
        assistantMessageId: "assistant-1",
        content: "一只橘猫坐在雨夜霓虹街道中央",
        mode: "free",
        now: "2026-06-12T00:00:01.000Z"
      }
    );

    const next = completeAssistantMessage(session, {
      assistantMessageId: "assistant-1",
      imageUrl: "data:image/png;base64,abc",
      rewrittenPrompt: "一只橘猫坐在雨夜霓虹街道中央，电影感光影",
      now: "2026-06-12T00:00:10.000Z"
    });

    expect(session.messages[1]).toMatchObject({ role: "assistant", status: "generating" });
    expect(next.messages[0]).toBe(session.messages[0]);
    expect(next.messages[1]).toMatchObject({
      id: "assistant-1",
      role: "assistant",
      status: "success",
      imageUrl: "data:image/png;base64,abc",
      rewrittenPrompt: "一只橘猫坐在雨夜霓虹街道中央，电影感光影",
      updatedAt: "2026-06-12T00:00:10.000Z"
    });
    expect(next.imageCount).toBe(1);
    expect(next.lastStatus).toBe("success");
    expect(next.lastImageUrl).toBe("data:image/png;base64,abc");
    expect(next.lastError).toBeUndefined();
  });

  it("attaches a generation job id to the pending assistant message", () => {
    const session = appendGenerationStart(
      createChatSession({
        id: "session-1",
        mode: "free",
        title: "雨夜橘猫",
        now: "2026-06-12T00:00:00.000Z"
      }),
      {
        userMessageId: "user-1",
        assistantMessageId: "assistant-1",
        content: "一只橘猫坐在雨夜霓虹街道中央",
        mode: "free",
        now: "2026-06-12T00:00:01.000Z"
      }
    );

    const next = assignAssistantGenerationJob(session, {
      assistantMessageId: "assistant-1",
      generationJobId: "job-1",
      now: "2026-06-12T00:00:02.000Z"
    });

    expect(next.messages[1]).toMatchObject({
      id: "assistant-1",
      role: "assistant",
      status: "generating",
      generationJobId: "job-1",
      updatedAt: "2026-06-12T00:00:02.000Z"
    });
    expect(next.lastStatus).toBe("generating");
  });

  it("updates the same assistant message to error while preserving user message and rewritten prompt", () => {
    const session = appendGenerationStart(
      createChatSession({
        id: "session-1",
        mode: "template",
        title: "失败也要保留",
        now: "2026-06-12T00:00:00.000Z"
      }),
      {
        userMessageId: "user-1",
        assistantMessageId: "assistant-1",
        content: "把背景改成海边日落",
        mode: "template",
        exampleId: "sport-campaign",
        exampleTitle: "运动品牌广告",
        exampleThumbnailUrl: "/examples/sport-campaign.jpg",
        now: "2026-06-12T00:00:01.000Z"
      }
    );

    const next = failAssistantMessage(session, {
      assistantMessageId: "assistant-1",
      errorMessage: "生成服务还没有配置，请稍后再试。",
      rewrittenPrompt: "运动品牌广告，背景为海边日落",
      now: "2026-06-12T00:00:10.000Z"
    });

    expect(session.messages[1]).toMatchObject({ role: "assistant", status: "generating" });
    expect(next.messages).toHaveLength(2);
    expect(next.messages[0]).toMatchObject({
      id: "user-1",
      role: "user",
      content: "把背景改成海边日落"
    });
    expect(next.messages[1]).toMatchObject({
      id: "assistant-1",
      role: "assistant",
      status: "error",
      errorMessage: "生成服务还没有配置，请稍后再试。",
      rewrittenPrompt: "运动品牌广告，背景为海边日落",
      updatedAt: "2026-06-12T00:00:10.000Z"
    });
    expect(next.imageCount).toBe(0);
    expect(next.lastStatus).toBe("error");
    expect(next.lastError).toBe("生成服务还没有配置，请稍后再试。");
  });
});
