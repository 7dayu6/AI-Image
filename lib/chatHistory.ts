import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatSession,
  ChatUserMessage,
  GenerationMode
} from "@/lib/types";

function truncateTitle(value: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (normalized.length <= 24) {
    return normalized;
  }

  return `${normalized.slice(0, 24)}...`;
}

function countImages(messages: ChatMessage[]): number {
  return messages.filter(
    (message) => message.role === "assistant" && message.status === "success" && Boolean(message.imageUrl)
  ).length;
}

function findLastMessage<T extends ChatMessage>(
  messages: ChatMessage[],
  predicate: (message: ChatMessage) => message is T
): T | undefined;
function findLastMessage(
  messages: ChatMessage[],
  predicate: (message: ChatMessage) => boolean
): ChatMessage | undefined;
function findLastMessage(
  messages: ChatMessage[],
  predicate: (message: ChatMessage) => boolean
): ChatMessage | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];

    if (predicate(message)) {
      return message;
    }
  }

  return undefined;
}

function summarizeSession(session: ChatSession, messages: ChatMessage[], updatedAt: string): ChatSession {
  const lastUserMessage = findLastMessage(messages, (message) => message.role === "user");
  const lastAssistantMessage = findLastMessage(
    messages,
    (message): message is ChatAssistantMessage => message.role === "assistant"
  );
  const lastSuccessfulImage = findLastMessage(
    messages,
    (message): message is ChatAssistantMessage =>
      message.role === "assistant" && message.status === "success" && Boolean(message.imageUrl)
  );

  return {
    ...session,
    messages,
    messageCount: messages.length,
    imageCount: countImages(messages),
    lastUserInput: lastUserMessage?.content,
    lastImageUrl: lastSuccessfulImage?.imageUrl,
    lastStatus: lastAssistantMessage?.status,
    lastError: lastAssistantMessage?.status === "error" ? lastAssistantMessage.errorMessage : undefined,
    updatedAt
  };
}

export function createChatSession({
  id,
  mode,
  title,
  now
}: {
  id: string;
  mode: GenerationMode;
  title: string;
  now: string;
}): ChatSession {
  return {
    id,
    title: truncateTitle(title) || "新的聊天",
    mode,
    messages: [],
    messageCount: 0,
    imageCount: 0,
    createdAt: now,
    updatedAt: now
  };
}

export function appendGenerationStart(
  session: ChatSession,
  input: {
    userMessageId: string;
    assistantMessageId: string;
    content: string;
    mode: GenerationMode;
    exampleId?: string;
    exampleTitle?: string;
    exampleThumbnailUrl?: string;
    now: string;
  }
): ChatSession {
  const userMessage: ChatUserMessage = {
    id: input.userMessageId,
    sessionId: session.id,
    role: "user",
    content: input.content,
    mode: input.mode,
    exampleId: input.exampleId,
    exampleTitle: input.exampleTitle,
    exampleThumbnailUrl: input.exampleThumbnailUrl,
    createdAt: input.now
  };

  const assistantMessage: ChatAssistantMessage = {
    id: input.assistantMessageId,
    sessionId: session.id,
    role: "assistant",
    status: "generating",
    mode: input.mode,
    createdAt: input.now,
    updatedAt: input.now
  };

  return summarizeSession(session, [...session.messages, userMessage, assistantMessage], input.now);
}

export function completeAssistantMessage(
  session: ChatSession,
  input: {
    assistantMessageId: string;
    imageUrl: string;
    rewrittenPrompt: string;
    now: string;
  }
): ChatSession {
  const messages = session.messages.map((message) => {
    if (message.role !== "assistant" || message.id !== input.assistantMessageId) {
      return message;
    }

    return {
      ...message,
      status: "success",
      imageUrl: input.imageUrl,
      rewrittenPrompt: input.rewrittenPrompt,
      errorMessage: undefined,
      updatedAt: input.now
    } satisfies ChatAssistantMessage;
  });

  return summarizeSession(session, messages, input.now);
}

export function assignAssistantGenerationJob(
  session: ChatSession,
  input: {
    assistantMessageId: string;
    generationJobId: string;
    now: string;
  }
): ChatSession {
  const messages = session.messages.map((message) => {
    if (message.role !== "assistant" || message.id !== input.assistantMessageId) {
      return message;
    }

    return {
      ...message,
      generationJobId: input.generationJobId,
      updatedAt: input.now
    } satisfies ChatAssistantMessage;
  });

  return summarizeSession(session, messages, input.now);
}

export function failAssistantMessage(
  session: ChatSession,
  input: {
    assistantMessageId: string;
    errorMessage: string;
    rewrittenPrompt?: string;
    now: string;
  }
): ChatSession {
  const messages = session.messages.map((message) => {
    if (message.role !== "assistant" || message.id !== input.assistantMessageId) {
      return message;
    }

    return {
      ...message,
      status: "error",
      errorMessage: input.errorMessage,
      rewrittenPrompt: input.rewrittenPrompt ?? message.rewrittenPrompt,
      updatedAt: input.now
    } satisfies ChatAssistantMessage;
  });

  return summarizeSession(session, messages, input.now);
}
