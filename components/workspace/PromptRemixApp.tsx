"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  appendGenerationStart,
  assignAssistantGenerationJob,
  completeAssistantMessage,
  createChatSession,
  failAssistantMessage
} from "@/lib/chatHistory";
import { examples as allExamples, filterExamples, findExampleById } from "@/lib/examples";
import {
  createStoredImageReference,
  hasStoredImageReferences,
  replaceInlineImagesWithReferences,
  resolveStoredImages
} from "@/lib/imagePersistence";
import {
  addOrUpdateLocalSession,
  LOCAL_CHAT_HISTORY_KEY,
  parseChatHistory,
  removeLocalSession,
  serializeChatHistory,
  stripInlineImagesForStorage,
  updateLocalSession
} from "@/lib/localHistory";
import type {
  ChatAssistantMessage,
  GenerationMode,
  GenerationRequestBody,
  GenerationResponseBody,
  LocalChatSession,
  PromptExample
} from "@/lib/types";
import { ChatStream } from "@/components/workspace/ChatStream";
import { Composer } from "@/components/workspace/Composer";
import { DeleteSessionDialog } from "@/components/workspace/DeleteSessionDialog";
import { ExampleDrawer } from "@/components/workspace/ExampleDrawer";
import { HistorySidebar } from "@/components/workspace/HistorySidebar";
import { SelectedExample } from "@/components/workspace/SelectedExample";
import { TemplatePanel } from "@/components/workspace/TemplatePanel";

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) =>
    (Number(character) ^ (Math.random() * 16) >> (Number(character) / 4)).toString(16)
  );
}

function errorMessage(code?: string) {
  if (code === "HOURLY_LIMIT" || code === "DAILY_LIMIT") return "今天的免费生成次数用完了，晚点再试试。";
  if (code === "RATE_LIMIT_CONFIGURATION_ERROR" || code === "RATE_LIMIT_SERVICE_UNAVAILABLE") {
    return "生成服务正在限流保护中，请稍后再试。";
  }
  if (code === "SERVER_NOT_CONFIGURED") return "生成服务还没有配置，请稍后再试。";
  if (code === "IMAGE_API_TIMEOUT") return "图片生成超时，请稍后重试。";
  if (code === "IMAGE_NETWORK_ERROR") return "无法连接到图片生成服务，请检查网络。";
  if (code === "EXAMPLE_NOT_FOUND") return "这个样例暂时不可用，请换一个试试。";
  if (code === "EMPTY_INSTRUCTION" || code === "INVALID_REQUEST") return "先说一句你想怎么改。";
  if (code?.startsWith("图片生成失败:")) return code;
  return "这次生成没有成功，可以稍后重试，或者换个说法再试一次。";
}

const historyStoreEvent = "prompt-remix-history-change";
const generationPollIntervalMs = 1000;
const storedImagePrefix = "indexeddb-image:";

function subscribeHistoryStore(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(historyStoreEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(historyStoreEvent, onStoreChange);
  };
}

function getHistorySnapshot() {
  try {
    return window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerHistorySnapshot() {
  return "";
}

function wait(milliseconds: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function PromptRemixApp() {
  const [selectedExample, setSelectedExample] = useState<PromptExample>(allExamples[0]);
  const [mode, setMode] = useState<GenerationMode>("template");
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [composerValue, setComposerValue] = useState("");
  const [activeSession, setActiveSession] = useState<LocalChatSession | null>(null);
  const [continuationPrompt, setContinuationPrompt] = useState<string | undefined>();
  const [promptOpen, setPromptOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resolvedThumbnails, setResolvedThumbnails] = useState<Record<string, string>>({});
  const [pendingDeleteSession, setPendingDeleteSession] = useState<LocalChatSession | null>(null);
  const [copyToast, setCopyToast] = useState(false);
  const resumedGenerationJobs = useRef<Set<string>>(new Set());
  const pollGenerationJobRef = useRef<
    ((jobId: string, assistantMessageId: string, initialSession: LocalChatSession) => Promise<void>) | null
  >(null);
  const historySnapshot = useSyncExternalStore(
    subscribeHistoryStore,
    getHistorySnapshot,
    getServerHistorySnapshot
  );

  const filteredExamples = useMemo(() => filterExamples({ category, query }), [category, query]);
  const history = useMemo(() => parseChatHistory(historySnapshot), [historySnapshot]);
  const messages = activeSession?.messages ?? [];
  const displaySessions = useMemo(
    () =>
      history.map((session) => ({
        ...session,
        lastImageUrl:
          resolvedThumbnails[session.id] ??
          (session.lastImageUrl?.startsWith(storedImagePrefix) ? undefined : session.lastImageUrl)
      })),
    [history, resolvedThumbnails]
  );

  useEffect(() => {
    let alive = true;
    const sessionsToResolve = history.filter(
      (session) => hasStoredImageReferences(session) && !resolvedThumbnails[session.id]
    );

    sessionsToResolve.forEach((session) => {
      resolveStoredImages(session).then((resolvedSession) => {
        if (!alive || !resolvedSession.lastImageUrl) return;
        const lastImageUrl = resolvedSession.lastImageUrl;

        setResolvedThumbnails((current) => {
          if (current[session.id] === lastImageUrl) {
            return current;
          }
          return {
            ...current,
            [session.id]: lastImageUrl
          };
        });
      });
    });

    return () => {
      alive = false;
    };
  }, [history, resolvedThumbnails]);

  function writeLocalSession(session: LocalChatSession, behavior: "add" | "update", compactImages = false) {
    const current = parseChatHistory(getHistorySnapshot());
    const nextHistory =
      behavior === "add" ? addOrUpdateLocalSession(current, session) : updateLocalSession(current, session);
    const persistedHistory = compactImages ? nextHistory.map(stripInlineImagesForStorage) : nextHistory;
    window.localStorage.setItem(LOCAL_CHAT_HISTORY_KEY, serializeChatHistory(persistedHistory));
    window.dispatchEvent(new Event(historyStoreEvent));
  }

  function saveSession(
    session: LocalChatSession,
    behavior: "add" | "update",
    fallbackSession: LocalChatSession = stripInlineImagesForStorage(session)
  ) {
    try {
      writeLocalSession(session, behavior);
    } catch {
      try {
        writeLocalSession(fallbackSession, behavior, true);
      } catch {
        // Keep the visible chat even if storage is unavailable.
      }
    }
  }

  async function completeSessionWithImage(
    session: LocalChatSession,
    assistantMessageId: string,
    imageUrl: string,
    rewrittenPrompt: string
  ) {
    const completedSession = completeAssistantMessage(session, {
      assistantMessageId,
      imageUrl,
      rewrittenPrompt,
      now: new Date().toISOString()
    });
    const storedImageReference = await createStoredImageReference(assistantMessageId, imageUrl);
    const fallbackSession = storedImageReference
      ? replaceInlineImagesWithReferences(completedSession, { [assistantMessageId]: storedImageReference })
      : stripInlineImagesForStorage(completedSession);
    setActiveSession((current) => (current?.id === completedSession.id ? completedSession : current));
    saveSession(storedImageReference ? fallbackSession : completedSession, "update", fallbackSession);
    return completedSession;
  }

  function failSession(
    session: LocalChatSession,
    assistantMessageId: string,
    code: string | undefined,
    rewrittenPrompt?: string
  ) {
    const failedSession = failAssistantMessage(session, {
      assistantMessageId,
      errorMessage: errorMessage(code),
      rewrittenPrompt,
      now: new Date().toISOString()
    });
    setActiveSession((current) => (current?.id === failedSession.id ? failedSession : current));
    saveSession(failedSession, "update");
    return failedSession;
  }

  function startNewChat() {
    setActiveSession(null);
    setContinuationPrompt(undefined);
    setComposerValue("");
    setPromptOpen(false);
    setDrawerOpen(false);
  }

  function requestDeleteSession(session: LocalChatSession) {
    setPendingDeleteSession(session);
  }

  function confirmDeleteSession() {
    if (!pendingDeleteSession) return;
    const session = pendingDeleteSession;

    try {
      const nextHistory = removeLocalSession(parseChatHistory(getHistorySnapshot()), session.id);
      window.localStorage.setItem(LOCAL_CHAT_HISTORY_KEY, serializeChatHistory(nextHistory));
      window.dispatchEvent(new Event(historyStoreEvent));
      setResolvedThumbnails((current) => {
        const remaining = { ...current };
        delete remaining[session.id];
        return remaining;
      });
      setPendingDeleteSession(null);
      if (activeSession?.id === session.id) {
        startNewChat();
      }
    } catch {
      // Keep current UI state if storage is unavailable.
    }
  }

  async function pollGenerationJob(
    jobId: string,
    assistantMessageId: string,
    initialSession: LocalChatSession
  ) {
    for (;;) {
      await wait(generationPollIntervalMs);

      const response = await fetch(`/api/generate/status?jobId=${encodeURIComponent(jobId)}`);
      const payload = (await response.json().catch(() => ({}))) as GenerationResponseBody;

      if (payload.status === "success" && payload.imageUrl && payload.rewrittenPrompt) {
        await completeSessionWithImage(
          initialSession,
          assistantMessageId,
          payload.imageUrl,
          payload.rewrittenPrompt
        );
        return;
      }

      if (payload.status === "error" || !response.ok || payload.ok === false) {
        failSession(initialSession, assistantMessageId, payload.error, payload.rewrittenPrompt);
        return;
      }
    }
  }
  pollGenerationJobRef.current = pollGenerationJob;

  useEffect(() => {
    history.forEach((session) => {
      session.messages.forEach((message) => {
        if (message.role !== "assistant" || message.status !== "generating" || !message.generationJobId) {
          return;
        }

        if (resumedGenerationJobs.current.has(message.generationJobId)) {
          return;
        }

        resumedGenerationJobs.current.add(message.generationJobId);
        void pollGenerationJobRef.current?.(message.generationJobId, message.id, session);
      });
    });
  }, [history]);

  useEffect(() => {
    if (!copyToast) return;
    const timer = setTimeout(() => setCopyToast(false), 2500);
    return () => clearTimeout(timer);
  }, [copyToast]);

  async function handleSubmit() {
    const userInput = composerValue.trim();
    if (!userInput || isGenerating) return;

    const now = new Date().toISOString();
    const userMessageId = createId();
    const assistantMessageId = createId();
    const currentSession =
      activeSession ||
      createChatSession({
        id: createId(),
        mode,
        title: userInput,
        now
      });
    const previousSuccess = [...currentSession.messages]
      .reverse()
      .find(
        (message): message is ChatAssistantMessage => message.role === "assistant" && message.status === "success"
      );
    const previousRewrittenPrompt = continuationPrompt || previousSuccess?.rewrittenPrompt;
    const startedSession = appendGenerationStart(currentSession, {
      userMessageId,
      assistantMessageId,
      content: userInput,
      mode,
      exampleId: mode === "template" ? selectedExample.id : undefined,
      exampleTitle: mode === "template" ? selectedExample.title : undefined,
      exampleThumbnailUrl: mode === "template" ? selectedExample.sampleImageUrl : undefined,
      now
    });
    setActiveSession(startedSession);
    saveSession(startedSession, "add");
    setComposerValue("");
    setIsGenerating(true);

    const requestBody: GenerationRequestBody =
      mode === "template"
        ? {
            mode: "template",
            sessionId: startedSession.id,
            messageId: assistantMessageId,
            exampleId: selectedExample.id,
            userInstruction: userInput,
            previousRewrittenPrompt
          }
        : {
            mode: "free",
            sessionId: startedSession.id,
            messageId: assistantMessageId,
            prompt: userInput
          };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const payload = (await response.json().catch(() => ({}))) as GenerationResponseBody;
      if (response.ok && payload.jobId) {
        const queuedSession = assignAssistantGenerationJob(startedSession, {
          assistantMessageId,
          generationJobId: payload.jobId,
          now: new Date().toISOString()
        });
        setActiveSession((current) => (current?.id === queuedSession.id ? queuedSession : current));
        saveSession(queuedSession, "update");
        await pollGenerationJob(payload.jobId, assistantMessageId, queuedSession);
        return;
      }

      if (!response.ok || !payload.ok || !payload.imageUrl || !payload.rewrittenPrompt) {
        failSession(startedSession, assistantMessageId, payload.error, payload.rewrittenPrompt);
        return;
      }

      await completeSessionWithImage(
        startedSession,
        assistantMessageId,
        payload.imageUrl,
        payload.rewrittenPrompt
      );
    } catch (error) {
      const code = error instanceof Error ? error.message : undefined;
      failSession(startedSession, assistantMessageId, code);
    } finally {
      setContinuationPrompt(undefined);
      setIsGenerating(false);
    }
  }

  function handleSelectExample(example: PromptExample) {
    setSelectedExample(example);
    setMode("template");
    setActiveSession(null);
    setContinuationPrompt(undefined);
    setPromptOpen(false);
    setDrawerOpen(false);
  }

  function handleModeChange(nextMode: GenerationMode) {
    setMode(nextMode);
    setActiveSession(null);
    setContinuationPrompt(undefined);
    setPromptOpen(false);
  }

  function handleOpenSession(session: LocalChatSession) {
    setActiveSession(session);
    setMode(session.mode);
    if (hasStoredImageReferences(session)) {
      resolveStoredImages(session).then((resolvedSession) => {
        setActiveSession((current) => (current?.id === session.id ? resolvedSession : current));
      });
    }

    const latestTemplateMessage = [...session.messages]
      .reverse()
      .find((message) => message.role === "user" && message.mode === "template" && message.exampleId);
    if (latestTemplateMessage?.role === "user" && latestTemplateMessage.exampleId) {
      const example = findExampleById(latestTemplateMessage.exampleId);
      if (example) setSelectedExample(example);
    }

    const latestSuccess = [...session.messages]
      .reverse()
      .find(
        (message): message is ChatAssistantMessage => message.role === "assistant" && message.status === "success"
      );
    setContinuationPrompt(latestSuccess?.rewrittenPrompt);
    setPromptOpen(false);
    setDrawerOpen(false);
  }

  function handleContinue(prompt: string) {
    if (prompt) setContinuationPrompt(prompt);
    setComposerValue("继续基于这张图修改：");
  }

  function handleCopyPrompt(prompt: string) {
    navigator.clipboard?.writeText(prompt).then(() => setCopyToast(true));
  }

  return (
    <main className="flex h-dvh overflow-hidden bg-[#f4f7fb] text-slate-950">
      <HistorySidebar
        sessions={displaySessions}
        mode={mode}
        activeSessionId={activeSession?.id}
        onModeChange={handleModeChange}
        onNewChat={startNewChat}
        onOpenSession={handleOpenSession}
        onDeleteSession={requestDeleteSession}
      />
      <section className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/40 backdrop-blur lg:hidden">
          <div className="grid size-10 place-items-center rounded-lg bg-teal-600 text-base font-bold text-white shadow-sm shadow-teal-900/20">灵</div>
          <div>
            <p className="text-sm font-semibold text-slate-950">灵感绘图</p>
            <p className="text-xs text-slate-500">一句话改出你的专属图片</p>
          </div>
        </div>
        <SelectedExample
          mode={mode}
          example={selectedExample}
          promptOpen={promptOpen}
          onTogglePrompt={() => setPromptOpen((open) => !open)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
        <ChatStream
          mode={mode}
          messages={messages}
          onUseStarter={setComposerValue}
          onCopyPrompt={handleCopyPrompt}
          onContinue={handleContinue}
        />
        <Composer
          value={composerValue}
          disabled={isGenerating}
          placeholder={mode === "template" ? "说一句你想怎么改，比如：把主角换成橘猫" : "直接描述你想生成的画面"}
          onChange={setComposerValue}
          onSubmit={handleSubmit}
        />
        <div className={`absolute bottom-20 inset-x-0 z-50 mx-auto w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition-opacity duration-300 ${copyToast ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          ✓ 已复制到剪贴板
        </div>
      </section>
      <TemplatePanel
        examples={filteredExamples}
        selectedExample={selectedExample}
        category={category}
        query={query}
        onCategoryChange={setCategory}
        onQueryChange={setQuery}
        onSelectExample={handleSelectExample}
      />
      <ExampleDrawer
        open={drawerOpen}
        examples={filteredExamples.length ? filteredExamples : allExamples}
        selectedExample={selectedExample}
        onClose={() => setDrawerOpen(false)}
        onSelectExample={handleSelectExample}
      />
      <DeleteSessionDialog
        session={pendingDeleteSession}
        onCancel={() => setPendingDeleteSession(null)}
        onConfirm={confirmDeleteSession}
      />
    </main>
  );
}
