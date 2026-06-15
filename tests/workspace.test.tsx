import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PromptRemixApp } from "@/components/workspace/PromptRemixApp";
import { LOCAL_CHAT_HISTORY_KEY } from "@/lib/localHistory";

function createStoredSession(id: string, title: string, imageUrl = "data:image/png;base64,saved") {
  return {
    id,
    title,
    mode: "template",
    messages: [
      {
        id: `${id}-user`,
        sessionId: id,
        role: "user",
        content: `${title} 指令`,
        mode: "template",
        exampleId: "awesome-case-5",
        exampleTitle: "主题海报版式设计",
        exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
        createdAt: "2026-06-11T00:00:00.000Z"
      },
      {
        id: `${id}-assistant`,
        sessionId: id,
        role: "assistant",
        status: "success",
        mode: "template",
        imageUrl,
        rewrittenPrompt: `${title} 提示词`,
        createdAt: "2026-06-11T00:00:01.000Z",
        updatedAt: "2026-06-11T00:00:01.000Z"
      }
    ],
    messageCount: 2,
    imageCount: imageUrl ? 1 : 0,
    lastUserInput: `${title} 指令`,
    lastImageUrl: imageUrl,
    lastStatus: "success",
    createdAt: "2026-06-11T00:00:00.000Z",
    updatedAt: "2026-06-11T00:00:01.000Z"
  };
}

describe("prompt remix workspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("switches examples and toggles the source prompt", () => {
    render(<PromptRemixApp />);

    const posterCard = screen.getByRole("heading", { name: "科普百科图", level: 3 }).closest("article");
    expect(posterCard).not.toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: "用这个" })[1]);

    expect(screen.getByRole("heading", { name: "科普百科图", level: 2 })).toBeTruthy();
    expect(screen.queryByText(/根据【主题】生成一张高质量竖版/)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "查看原始提示词" }));
    expect(screen.getByText(/根据【主题】生成一张高质量竖版/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "查看原始提示词" }));
    expect(screen.queryByText(/根据【主题】生成一张高质量竖版/)).toBeNull();
  });

  it("loads saved history after the first client render", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([
        {
          id: "session-1",
          title: "主题海报版式设计",
          mode: "template",
          messages: [
            {
              id: "user-1",
              sessionId: "session-1",
              role: "user",
              content: "历史里的指令",
              mode: "template",
              exampleId: "awesome-case-5",
              exampleTitle: "主题海报版式设计",
              exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
              createdAt: "2026-06-11T00:00:00.000Z"
            },
            {
              id: "assistant-1",
              sessionId: "session-1",
              role: "assistant",
              status: "success",
              mode: "template",
              imageUrl: "data:image/png;base64,test",
              rewrittenPrompt: "历史里的提示词",
              createdAt: "2026-06-11T00:00:01.000Z",
              updatedAt: "2026-06-11T00:00:01.000Z"
            }
          ],
          messageCount: 2,
          imageCount: 1,
          lastUserInput: "历史里的指令",
          lastImageUrl: "data:image/png;base64,test",
          lastStatus: "success",
          createdAt: "2026-06-11T00:00:00.000Z",
          updatedAt: "2026-06-11T00:00:01.000Z"
        }
      ])
    );

    const serverHtml = renderToString(<PromptRemixApp />);
    expect(serverHtml).toContain("历史聊天");
    expect(serverHtml).toContain(">0<");
    expect(serverHtml).not.toContain("历史里的指令");

    render(<PromptRemixApp />);
    await waitFor(() => {
      expect(screen.getByText("历史里的指令")).toBeTruthy();
    });
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("does not show login or register actions", () => {
    render(<PromptRemixApp />);

    expect(screen.queryByRole("link", { name: "登录" })).toBeNull();
    expect(screen.queryByRole("link", { name: "注册" })).toBeNull();
    expect(screen.queryByText("本地保存历史，不需要登录。")).toBeNull();
  });

  it("starts a new chat from the sidebar without deleting saved history", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([createStoredSession("session-1", "历史聊天")])
    );

    render(<PromptRemixApp />);

    await waitFor(() => {
      expect(screen.getByText("历史聊天 指令")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("历史聊天 指令"));
    expect(screen.getByRole("img", { name: "生成结果" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "新建聊天" }));

    expect(screen.queryByRole("img", { name: "生成结果" })).toBeNull();
    expect(screen.getByText("历史聊天 指令")).toBeTruthy();
  });

  it("keeps a history item when the custom delete dialog is canceled", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([createStoredSession("session-1", "待保留聊天")])
    );

    render(<PromptRemixApp />);

    await waitFor(() => {
      expect(screen.getByText("待保留聊天 指令")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "删除聊天 待保留聊天" }));

    expect(screen.getByRole("dialog", { name: "删除聊天" })).toBeTruthy();
    expect(screen.getByText("确定要删除“待保留聊天”吗？")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "取消" }));

    expect(screen.queryByRole("dialog", { name: "删除聊天" })).toBeNull();
    expect(screen.getByText("待保留聊天 指令")).toBeTruthy();
    expect(window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY)).toContain("待保留聊天");
  });

  it("removes a history item after confirming the custom delete dialog", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([
        createStoredSession("session-1", "待删除聊天"),
        createStoredSession("session-2", "保留聊天")
      ])
    );

    render(<PromptRemixApp />);

    await waitFor(() => {
      expect(screen.getByText("待删除聊天 指令")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "删除聊天 待删除聊天" }));
    fireEvent.click(screen.getByRole("button", { name: "确认删除" }));

    expect(screen.queryByText("待删除聊天 指令")).toBeNull();
    expect(screen.getByText("保留聊天 指令")).toBeTruthy();
    expect(window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY)).not.toContain("待删除聊天");
  });

  it("clears the open chat when confirming deletion of the active history item", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([createStoredSession("session-1", "当前聊天")])
    );

    render(<PromptRemixApp />);

    await waitFor(() => {
      expect(screen.getByText("当前聊天 指令")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("当前聊天 指令"));
    expect(screen.getByRole("img", { name: "生成结果" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "删除聊天 当前聊天" }));
    fireEvent.click(screen.getByRole("button", { name: "确认删除" }));

    expect(screen.queryByRole("img", { name: "生成结果" })).toBeNull();
    expect(screen.queryByText("当前聊天 指令")).toBeNull();
    expect(screen.getByText("发送第一条指令后，这里会出现聊天记录。")).toBeTruthy();
  });

  it("shows an IndexedDB-backed history thumbnail after resolving it", async () => {
    const openMock = vi.fn();
    const request = {
      result: {
        objectStoreNames: {
          contains: () => true
        },
        transaction: () => ({
          objectStore: () => ({
            get: () => {
              const getRequest: Partial<IDBRequest> = {};
              window.setTimeout(() => {
                Object.defineProperty(getRequest, "result", { value: "data:image/png;base64,resolved" });
                getRequest.onsuccess?.({} as Event);
              }, 0);
              return getRequest as IDBRequest;
            }
          })
        }),
        close: vi.fn()
      },
      onsuccess: undefined as ((event: Event) => void) | undefined,
      onerror: undefined as ((event: Event) => void) | undefined,
      onupgradeneeded: undefined as ((event: IDBVersionChangeEvent) => void) | undefined
    };
    openMock.mockReturnValue(request);
    vi.stubGlobal("indexedDB", { open: openMock });
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([createStoredSession("session-1", "带图聊天", "indexeddb-image:session-1-assistant")])
    );

    render(<PromptRemixApp />);
    request.onsuccess?.({} as Event);

    const historyRow = await screen.findByText("带图聊天 指令");
    await waitFor(() => {
      const image = (historyRow.closest("article") as HTMLElement).querySelector("img");
      expect(image).not.toBeNull();
      expect(image?.getAttribute("src")).toBe("data:image/png;base64,resolved");
    });
  });

  it("writes a local chat history entry as soon as the user submits", async () => {
    let resolveFetch: (response: Response) => void = () => {};
    vi.spyOn(globalThis, "fetch").mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }) as Promise<Response>
    );

    render(<PromptRemixApp />);

    const textarea = screen.getByPlaceholderText("说一句你想怎么改，比如：把主角换成橘猫");
    fireEvent.change(textarea, { target: { value: "把主角换成橘猫" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));

    await waitFor(() => {
      expect(screen.getAllByText("把主角换成橘猫").length).toBeGreaterThan(0);
      expect(screen.getByText("正在根据你的修改生成图片...")).toBeTruthy();
    });

    const rawHistory = window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
    expect(rawHistory).toContain("把主角换成橘猫");
    expect(rawHistory).toContain("generating");

    resolveFetch(
      new Response(
        JSON.stringify({
          ok: true,
          imageUrl: "data:image/png;base64,abc",
          rewrittenPrompt: "改写后的提示词"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    await waitFor(() => {
      expect(window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY)).toContain("success");
    });
  });

  it("does not leave local history stuck as generating when saving the full image exceeds storage quota", async () => {
    const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
    vi.spyOn(Storage.prototype, "setItem")
      .mockImplementationOnce(originalSetItem)
      .mockImplementationOnce(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      });

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          imageUrl: `data:image/png;base64,${"a".repeat(128)}`,
          rewrittenPrompt: "改写后的提示词"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    render(<PromptRemixApp />);

    const textarea = screen.getByPlaceholderText("说一句你想怎么改，比如：把主角换成橘猫");
    fireEvent.change(textarea, { target: { value: "改为手机样品图" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "生成结果" })).toBeTruthy();
    });

    const rawHistory = window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
    expect(rawHistory).toContain("success");
    expect(rawHistory).not.toContain("generating");
    expect(screen.queryByText("图片数据过大，已保留聊天状态和提示词")).toBeNull();
  });

  it("resumes polling a saved generating job after the workspace remounts", async () => {
    window.localStorage.setItem(
      LOCAL_CHAT_HISTORY_KEY,
      JSON.stringify([
        {
          ...createStoredSession("session-1", "刷新中的聊天", undefined),
          messages: [
            {
              id: "session-1-user",
              sessionId: "session-1",
              role: "user",
              content: "刷新中的聊天 指令",
              mode: "template",
              exampleId: "awesome-case-5",
              exampleTitle: "主题海报版式设计",
              exampleThumbnailUrl: "/examples/awesome-case-5.jpg",
              createdAt: "2026-06-11T00:00:00.000Z"
            },
            {
              id: "session-1-assistant",
              sessionId: "session-1",
              role: "assistant",
              status: "generating",
              mode: "template",
              generationJobId: "job-after-refresh",
              createdAt: "2026-06-11T00:00:01.000Z",
              updatedAt: "2026-06-11T00:00:01.000Z"
            }
          ],
          imageCount: 0,
          lastImageUrl: undefined,
          lastStatus: "generating"
        }
      ])
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          jobId: "job-after-refresh",
          status: "success",
          imageUrl: "data:image/png;base64,resumed",
          rewrittenPrompt: "刷新后恢复的提示词"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    render(<PromptRemixApp />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/generate/status?jobId=job-after-refresh");
    }, { timeout: 1500 });
    await waitFor(() => {
      const rawHistory = window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
      expect(rawHistory).toContain("success");
      expect(rawHistory).toContain("刷新后恢复的提示词");
      expect(rawHistory).toContain("data:image/png;base64,resumed");
      expect(rawHistory).not.toContain("generating");
    });
  });

  it("enables one-sentence generation, shows the no-key error state, and keeps it in history", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "SERVER_NOT_CONFIGURED" }), {
        status: 500,
        headers: { "content-type": "application/json" }
      })
    );

    render(<PromptRemixApp />);

    const textarea = screen.getByPlaceholderText("说一句你想怎么改，比如：把主角换成橘猫");
    const submit = screen.getByRole("button", { name: "生成图片" });
    expect(submit.hasAttribute("disabled")).toBe(true);

    fireEvent.change(textarea, { target: { value: "把主角换成橘猫，背景改成海边日落" } });
    expect(submit.hasAttribute("disabled")).toBe(false);

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getAllByText("把主角换成橘猫，背景改成海边日落").length).toBeGreaterThan(0);
      expect(screen.getByText("正在根据你的修改生成图片...")).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByText("生成服务还没有配置，请稍后再试。")).toBeTruthy();
    });

    const rawHistory = window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
    expect(rawHistory).toContain("把主角换成橘猫，背景改成海边日落");
    expect(rawHistory).toContain("error");
    expect(rawHistory).toContain("生成服务还没有配置");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/generate",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows a specific message when image generation times out", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: "IMAGE_API_TIMEOUT" }), {
        status: 502,
        headers: { "content-type": "application/json" }
      })
    );

    render(<PromptRemixApp />);

    const textarea = screen.getByPlaceholderText("说一句你想怎么改，比如：把主角换成橘猫");
    fireEvent.change(textarea, { target: { value: "改成手机样品图" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));

    await waitFor(() => {
      expect(screen.getByText("图片生成超时，请稍后重试。")).toBeTruthy();
    });
  });

  it("sends free mode requests and uses the free prompt placeholder", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          imageUrl: "data:image/png;base64,free",
          rewrittenPrompt: "自由模式优化提示词"
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    render(<PromptRemixApp />);

    fireEvent.click(screen.getByRole("button", { name: "自由提示词" }));

    expect(screen.queryByRole("button", { name: /换主角/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /改背景/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /调比例/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /换风格/ })).toBeNull();

    const textarea = screen.getByPlaceholderText("直接描述你想生成的画面");
    fireEvent.change(textarea, { target: { value: "雨夜霓虹街道上的橘猫" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    const request = vi.mocked(globalThis.fetch).mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(request.body))).toMatchObject({
      mode: "free",
      prompt: "雨夜霓虹街道上的橘猫"
    });
  });

  it("polls async generation jobs and updates the pending chat", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, jobId: "job-1", status: "running" }), {
          status: 202,
          headers: { "content-type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, jobId: "job-1", status: "running" }), {
          status: 200,
          headers: { "content-type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ok: true,
            jobId: "job-1",
            status: "success",
            imageUrl: "data:image/png;base64,async",
            rewrittenPrompt: "异步完成提示词"
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      );

    render(<PromptRemixApp />);

    const textarea = screen.getByPlaceholderText("说一句你想怎么改，比如：把主角换成橘猫");
    fireEvent.change(textarea, { target: { value: "改成手机样品图" } });
    fireEvent.click(screen.getByRole("button", { name: "生成图片" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/generate",
        expect.objectContaining({ method: "POST" })
      );
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/generate/status?jobId=job-1");
    }, { timeout: 1500 });

    await waitFor(() => {
      expect(screen.getByRole("img", { name: "生成结果" })).toBeTruthy();
    }, { timeout: 3000 });

    const rawHistory = window.localStorage.getItem(LOCAL_CHAT_HISTORY_KEY);
    expect(rawHistory).toContain("success");
    expect(rawHistory).toContain("异步完成提示词");
    expect(rawHistory).not.toContain("generating");
  });

});
