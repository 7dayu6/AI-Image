export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export type PromptExample = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  sampleImageUrl: string;
  originalPrompt: string;
  defaultAspectRatio: AspectRatio;
};

export type GenerationMode = "template" | "free";

export type AssistantStatus = "generating" | "success" | "error";

export type ChatUserMessage = {
  id: string;
  sessionId?: string;
  role: "user";
  content: string;
  mode?: GenerationMode;
  exampleId?: string;
  exampleTitle?: string;
  exampleThumbnailUrl?: string;
  createdAt: string;
};

export type ChatAssistantMessage = {
  id: string;
  sessionId?: string;
  role: "assistant";
  status: AssistantStatus;
  mode?: GenerationMode;
  generationJobId?: string;
  imageUrl?: string;
  rewrittenPrompt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ChatMessage = ChatUserMessage | ChatAssistantMessage;

export type ChatSession = {
  id: string;
  title: string;
  mode: GenerationMode;
  messages: ChatMessage[];
  messageCount: number;
  imageCount: number;
  lastUserInput?: string;
  lastImageUrl?: string;
  lastStatus?: AssistantStatus;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};

export type TemplateGenerationRequestBody = {
  mode?: "template";
  sessionId?: string;
  messageId?: string;
  exampleId: string;
  userInstruction: string;
  previousRewrittenPrompt?: string;
};

export type FreeGenerationRequestBody = {
  mode: "free";
  sessionId?: string;
  messageId?: string;
  prompt: string;
};

export type GenerationRequestBody = TemplateGenerationRequestBody | FreeGenerationRequestBody;

export type GenerationResponseBody = {
  ok: boolean;
  sessionId?: string;
  messageId?: string;
  jobId?: string;
  status?: "queued" | "running" | "success" | "error";
  imageUrl?: string;
  rewrittenPrompt?: string;
  error?: string;
  retryAfterSeconds?: number;
};

export type LocalGenerationRecord = {
  id: string;
  exampleId: string;
  exampleTitle: string;
  userInstruction: string;
  imageUrl: string;
  rewrittenPrompt: string;
  createdAt: string;
};

export type LocalChatSession = ChatSession;

export type LocalChatMessage = ChatMessage;
