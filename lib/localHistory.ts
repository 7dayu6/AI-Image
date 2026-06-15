import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatUserMessage,
  LocalChatSession,
  LocalGenerationRecord
} from "@/lib/types";

export const LEGACY_LOCAL_HISTORY_KEY = "prompt-remix-chat-history:v1";
export const LOCAL_HISTORY_KEY = LEGACY_LOCAL_HISTORY_KEY;
export const LOCAL_CHAT_HISTORY_KEY = "prompt-remix-chat-history:v2";
export const LOCAL_HISTORY_LIMIT = 12;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAssistantStatus(value: unknown): value is ChatAssistantMessage["status"] {
  return value === "generating" || value === "success" || value === "error";
}

function isMode(value: unknown): value is LocalChatSession["mode"] {
  return value === "template" || value === "free";
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isRecord(value: unknown): value is LocalGenerationRecord {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.exampleId === "string" &&
    typeof value.exampleTitle === "string" &&
    typeof value.userInstruction === "string" &&
    typeof value.imageUrl === "string" &&
    typeof value.rewrittenPrompt === "string" &&
    typeof value.createdAt === "string"
  );
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!isObject(value)) return false;

  if (value.role === "user") {
    const user = value as Partial<ChatUserMessage>;

    return (
      typeof user.id === "string" &&
      isOptionalString(user.sessionId) &&
      typeof user.content === "string" &&
      (user.mode === undefined || isMode(user.mode)) &&
      isOptionalString(user.exampleId) &&
      isOptionalString(user.exampleTitle) &&
      isOptionalString(user.exampleThumbnailUrl) &&
      typeof user.createdAt === "string"
    );
  }

  if (value.role === "assistant") {
    const assistant = value as Partial<ChatAssistantMessage>;

    return (
      typeof assistant.id === "string" &&
      isOptionalString(assistant.sessionId) &&
      isAssistantStatus(assistant.status) &&
      (assistant.mode === undefined || isMode(assistant.mode)) &&
      isOptionalString(assistant.generationJobId) &&
      isOptionalString(assistant.imageUrl) &&
      isOptionalString(assistant.rewrittenPrompt) &&
      isOptionalString(assistant.errorMessage) &&
      typeof assistant.createdAt === "string" &&
      isOptionalString(assistant.updatedAt)
    );
  }

  return false;
}

function isLocalChatSession(value: unknown): value is LocalChatSession {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    isMode(value.mode) &&
    Array.isArray(value.messages) &&
    value.messages.every(isChatMessage) &&
    typeof value.messageCount === "number" &&
    typeof value.imageCount === "number" &&
    isOptionalString(value.lastUserInput) &&
    isOptionalString(value.lastImageUrl) &&
    (value.lastStatus === undefined || isAssistantStatus(value.lastStatus)) &&
    isOptionalString(value.lastError) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isInlineImageUrl(value: string | undefined): boolean {
  return typeof value === "string" && value.startsWith("data:image/");
}

function countPersistableImages(messages: ChatMessage[]): number {
  return messages.filter(
    (message) =>
      message.role === "assistant" &&
      message.status === "success" &&
      Boolean(message.imageUrl) &&
      !isInlineImageUrl(message.imageUrl)
  ).length;
}

function legacyRecordToSession(record: LocalGenerationRecord): LocalChatSession {
  return {
    id: record.id,
    title: record.exampleTitle,
    mode: "template",
    messages: [
      {
        id: `${record.id}-user`,
        sessionId: record.id,
        role: "user",
        content: record.userInstruction,
        mode: "template",
        exampleId: record.exampleId,
        exampleTitle: record.exampleTitle,
        createdAt: record.createdAt
      },
      {
        id: `${record.id}-assistant`,
        sessionId: record.id,
        role: "assistant",
        status: "success",
        mode: "template",
        imageUrl: record.imageUrl,
        rewrittenPrompt: record.rewrittenPrompt,
        createdAt: record.createdAt,
        updatedAt: record.createdAt
      }
    ],
    messageCount: 2,
    imageCount: 1,
    lastUserInput: record.userInstruction,
    lastImageUrl: record.imageUrl,
    lastStatus: "success",
    createdAt: record.createdAt,
    updatedAt: record.createdAt
  };
}

export function parseHistory(raw: string | null): LocalGenerationRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecord).slice(0, LOCAL_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function serializeHistory(records: LocalGenerationRecord[]): string {
  return JSON.stringify(records.filter(isRecord).slice(0, LOCAL_HISTORY_LIMIT));
}

export function addHistoryRecord(
  records: LocalGenerationRecord[],
  nextRecord: LocalGenerationRecord
): LocalGenerationRecord[] {
  return [nextRecord, ...records.filter((record) => record.id !== nextRecord.id)].slice(
    0,
    LOCAL_HISTORY_LIMIT
  );
}

export function migrateLegacyRecords(records: LocalGenerationRecord[]): LocalChatSession[] {
  return records.filter(isRecord).map(legacyRecordToSession).slice(0, LOCAL_HISTORY_LIMIT);
}

export function parseChatHistory(raw: string | null): LocalChatSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .flatMap((item): LocalChatSession[] => {
        if (isLocalChatSession(item)) return [item];
        if (isRecord(item)) return [legacyRecordToSession(item)];
        return [];
      })
      .slice(0, LOCAL_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function serializeChatHistory(records: LocalChatSession[]): string {
  return JSON.stringify(records.filter(isLocalChatSession).slice(0, LOCAL_HISTORY_LIMIT));
}

export function stripInlineImagesForStorage(session: LocalChatSession): LocalChatSession {
  const messages = session.messages.map((message) => {
    if (message.role !== "assistant" || !isInlineImageUrl(message.imageUrl)) {
      return message;
    }

    return {
      ...message,
      imageUrl: undefined
    };
  });

  return {
    ...session,
    messages,
    imageCount: countPersistableImages(messages),
    lastImageUrl: isInlineImageUrl(session.lastImageUrl) ? undefined : session.lastImageUrl
  };
}

export function addOrUpdateLocalSession(
  records: LocalChatSession[],
  nextSession: LocalChatSession
): LocalChatSession[] {
  return [nextSession, ...records.filter((record) => record.id !== nextSession.id)].slice(
    0,
    LOCAL_HISTORY_LIMIT
  );
}

export function updateLocalSession(
  records: LocalChatSession[],
  nextSession: LocalChatSession
): LocalChatSession[] {
  const nextRecords = records.map((record) => (record.id === nextSession.id ? nextSession : record));

  return nextRecords.some((record) => record.id === nextSession.id)
    ? nextRecords.slice(0, LOCAL_HISTORY_LIMIT)
    : addOrUpdateLocalSession(records, nextSession);
}

export function removeLocalSession(
  records: LocalChatSession[],
  sessionId: string
): LocalChatSession[] {
  return records.filter((record) => record.id !== sessionId).slice(0, LOCAL_HISTORY_LIMIT);
}
