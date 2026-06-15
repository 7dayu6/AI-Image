import { describe, expect, it } from "vitest";
import {
  addHistoryRecord,
  addOrUpdateLocalSession,
  LEGACY_LOCAL_HISTORY_KEY,
  LOCAL_CHAT_HISTORY_KEY,
  LOCAL_HISTORY_KEY,
  LOCAL_HISTORY_LIMIT,
  migrateLegacyRecords,
  parseChatHistory,
  parseHistory,
  removeLocalSession,
  serializeChatHistory,
  serializeHistory,
  updateLocalSession
} from "@/lib/localHistory";
import type { LocalChatSession, LocalGenerationRecord } from "@/lib/types";

const legacyRecord: LocalGenerationRecord = {
  id: "record-1",
  exampleId: "cyberpunk-avatar",
  exampleTitle: "赛博朋克头像",
  userInstruction: "换成橘猫",
  imageUrl: "data:image/png;base64,abc",
  rewrittenPrompt: "生成一张橘猫头像",
  createdAt: "2026-06-10T00:00:00.000Z"
};

const session: LocalChatSession = {
  id: "session-1",
  title: "把主角换成橘猫",
  mode: "template",
  messages: [
    {
      id: "user-1",
      sessionId: "session-1",
      role: "user",
      content: "把主角换成橘猫",
      mode: "template",
      exampleId: "awesome-case-5",
      exampleTitle: "主题海报版式设计",
      exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
      createdAt: "2026-06-12T00:00:00.000Z"
    },
    {
      id: "assistant-1",
      sessionId: "session-1",
      role: "assistant",
      status: "generating",
      mode: "template",
      createdAt: "2026-06-12T00:00:00.000Z",
      updatedAt: "2026-06-12T00:00:00.000Z"
    }
  ],
  messageCount: 2,
  imageCount: 0,
  lastUserInput: "把主角换成橘猫",
  lastStatus: "generating",
  createdAt: "2026-06-12T00:00:00.000Z",
  updatedAt: "2026-06-12T00:00:00.000Z"
};

describe("legacy local history helpers", () => {
  it("keeps the v1 storage key for current UI compatibility", () => {
    expect(LOCAL_HISTORY_KEY).toBe("prompt-remix-chat-history:v1");
    expect(LEGACY_LOCAL_HISTORY_KEY).toBe(LOCAL_HISTORY_KEY);
    expect(LOCAL_CHAT_HISTORY_KEY).toBe("prompt-remix-chat-history:v2");
  });

  it("serializes and parses successful generation records", () => {
    expect(parseHistory(serializeHistory([legacyRecord]))).toEqual([legacyRecord]);
  });

  it("returns empty legacy history for invalid JSON", () => {
    expect(parseHistory("{")).toEqual([]);
  });

  it("drops malformed legacy records", () => {
    expect(parseHistory(JSON.stringify([{ id: "bad" }, legacyRecord]))).toEqual([legacyRecord]);
  });

  it("adds legacy records first, deduplicates by id, and caps the list", () => {
    const records = Array.from({ length: 20 }, (_, index): LocalGenerationRecord => ({
      ...legacyRecord,
      id: `record-${index}`
    }));

    const next = addHistoryRecord(records, {
      ...legacyRecord,
      id: "record-5",
      userInstruction: "更新后的指令"
    });

    expect(next[0]).toMatchObject({
      id: "record-5",
      userInstruction: "更新后的指令"
    });
    expect(next).toHaveLength(LOCAL_HISTORY_LIMIT);
    expect(next.filter((record) => record.id === "record-5")).toHaveLength(1);
  });
});

describe("local chat history helpers", () => {
  it("returns empty chat history for invalid JSON", () => {
    expect(parseChatHistory("{")).toEqual([]);
  });

  it("drops malformed chat records", () => {
    expect(parseChatHistory(JSON.stringify([{ id: "bad" }, session]))).toEqual([session]);
  });

  it("serializes and parses chat sessions", () => {
    expect(parseChatHistory(serializeChatHistory([session]))).toEqual([session]);
  });

  it("adds new sessions first, deduplicates by id, and caps the list", () => {
    const records = Array.from({ length: 20 }, (_, index): LocalChatSession => ({
      ...session,
      id: `session-${index}`,
      title: `session-${index}`
    }));

    const next = addOrUpdateLocalSession(records, {
      ...session,
      id: "session-5",
      title: "updated-session"
    });

    expect(next[0]).toMatchObject({
      id: "session-5",
      title: "updated-session"
    });
    expect(next).toHaveLength(LOCAL_HISTORY_LIMIT);
    expect(next.filter((record) => record.id === "session-5")).toHaveLength(1);
  });

  it("updates an existing session without duplicating it", () => {
    const next = updateLocalSession([session], {
      ...session,
      lastStatus: "error",
      lastError: "生成失败",
      updatedAt: "2026-06-12T00:01:00.000Z"
    });

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({
      id: "session-1",
      lastStatus: "error",
      lastError: "生成失败"
    });
  });

  it("removes a chat session by id without mutating the remaining sessions", () => {
    const otherSession: LocalChatSession = {
      ...session,
      id: "session-2",
      title: "保留的聊天"
    };

    const next = removeLocalSession([session, otherSession], "session-1");

    expect(next).toEqual([otherSession]);
  });

  it("migrates legacy successful generation records into chat sessions", () => {
    const [migrated] = migrateLegacyRecords([legacyRecord]);

    expect(migrated).toMatchObject({
      id: "record-1",
      title: "赛博朋克头像",
      mode: "template",
      imageCount: 1,
      lastStatus: "success",
      lastUserInput: "换成橘猫",
      lastImageUrl: "data:image/png;base64,abc"
    });
    expect(migrated.messages).toEqual([
      {
        id: "record-1-user",
        sessionId: "record-1",
        role: "user",
        content: "换成橘猫",
        mode: "template",
        exampleId: "cyberpunk-avatar",
        exampleTitle: "赛博朋克头像",
        createdAt: "2026-06-10T00:00:00.000Z"
      },
      {
        id: "record-1-assistant",
        sessionId: "record-1",
        role: "assistant",
        status: "success",
        mode: "template",
        imageUrl: "data:image/png;base64,abc",
        rewrittenPrompt: "生成一张橘猫头像",
        createdAt: "2026-06-10T00:00:00.000Z",
        updatedAt: "2026-06-10T00:00:00.000Z"
      }
    ]);
  });

  it("parseChatHistory migrates legacy successful generation records", () => {
    expect(parseChatHistory(JSON.stringify([legacyRecord]))).toEqual(migrateLegacyRecords([legacyRecord]));
  });
});
