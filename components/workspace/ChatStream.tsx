import { Copy, Download, ImagePlus, Maximize2, Palette, RotateCcw, WandSparkles } from "lucide-react";
import type { ChatMessage, GenerationMode } from "@/lib/types";

type ChatStreamProps = {
  mode: GenerationMode;
  messages: ChatMessage[];
  onUseStarter: (prompt: string) => void;
  onCopyPrompt: (prompt: string) => void;
  onContinue: (prompt: string) => void;
};

const starterPrompts = [
  {
    title: "换主角",
    description: "把主角换成橘猫，保留原构图",
    icon: ImagePlus
  },
  {
    title: "改背景",
    description: "背景改成海边日落，光线柔和",
    icon: Palette
  },
  {
    title: "调比例",
    description: "改成 9:16 竖版海报，主体居中",
    icon: Maximize2
  },
  {
    title: "换风格",
    description: "换成电影感，增加景深和颗粒",
    icon: WandSparkles
  }
];

export function ChatStream({ mode, messages, onUseStarter, onCopyPrompt, onContinue }: ChatStreamProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 pb-36 text-center lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="mx-auto mb-5 grid size-12 place-items-center rounded-lg border border-teal-100 bg-white text-teal-700 shadow-sm shadow-teal-900/5">
            <WandSparkles size={22} />
          </div>
          <p className="text-xl font-semibold text-slate-950">
            {mode === "template" ? "先选一个样例，再说一句怎么改" : "直接描述你想生成的画面"}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {mode === "template" ? "比如：把主角换成橘猫，背景改成海边日落。" : "比如：雨夜霓虹街道上的橘猫。"}
          </p>
          {mode === "template" ? (
            <div className="mt-7 grid grid-cols-2 gap-3">
              {starterPrompts.map((starter) => {
                const Icon = starter.icon;
                return (
                  <button
                    key={starter.title}
                    type="button"
                    onClick={() => onUseStarter(starter.description)}
                    className="group min-h-[92px] rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md hover:shadow-teal-900/10 lg:min-h-24 lg:p-4"
                  >
                    <span className="flex items-start gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white lg:size-10">
                        <Icon size={17} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-950">{starter.title}</span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">
                          {starter.description}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-4 pb-36 lg:p-6 lg:pb-36">
      {messages.map((message) =>
        message.role === "user" ? (
          <div key={message.id} className="flex justify-end">
            <div className="max-w-[78%] rounded-lg bg-slate-950 px-4 py-3 text-sm leading-6 text-white shadow-sm shadow-slate-950/15">
              {message.content}
            </div>
          </div>
        ) : (
          <div key={message.id} className="max-w-2xl">
            {message.status === "generating" ? (
              <div className="rounded-lg border border-teal-100 bg-white p-4 text-sm text-slate-500 shadow-sm shadow-slate-200/50">
                正在根据你的修改生成图片...
              </div>
            ) : null}
            {message.status === "error" ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p>{message.errorMessage || "这次生成没有成功，可以稍后重试，或者换个说法再试一次。"}</p>
                {message.rewrittenPrompt ? (
                  <button
                    type="button"
                    onClick={() => onCopyPrompt(message.rewrittenPrompt || "")}
                    className="mt-3 inline-flex items-center gap-1 rounded-md border border-red-200 bg-white/70 px-3 py-2 text-xs font-medium text-red-700 hover:bg-white"
                  >
                    <Copy size={14} />
                    复制提示词
                  </button>
                ) : null}
              </div>
            ) : null}
            {message.status === "success" && message.imageUrl ? (
              <figure className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/60">
                <div className="overflow-hidden rounded-md bg-slate-100">
                  {/* Generated images may be data URLs, so use a plain image element. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={message.imageUrl} alt="生成结果" className="aspect-square w-full object-cover" />
                </div>
                <figcaption className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={message.imageUrl}
                    download
                    className="inline-flex min-h-9 items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                  >
                    <Download size={14} />
                    下载
                  </a>
                  <button
                    type="button"
                    onClick={() => onContinue(message.rewrittenPrompt || "")}
                    className="inline-flex min-h-9 items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                  >
                    <RotateCcw size={14} />
                    继续修改
                  </button>
                  <button
                    type="button"
                    onClick={() => onCopyPrompt(message.rewrittenPrompt || "")}
                    className="inline-flex min-h-9 items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                  >
                    <Copy size={14} />
                    复制提示词
                  </button>
                </figcaption>
                {message.rewrittenPrompt ? (
                  <details className="mt-3 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    <summary className="cursor-pointer font-medium text-slate-700">查看优化提示词</summary>
                    <p className="mt-2 whitespace-pre-wrap">{message.rewrittenPrompt}</p>
                  </details>
                ) : null}
              </figure>
            ) : null}
            {message.status === "success" && !message.imageUrl ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p>图片已生成，但图片数据过大，刷新后未能从本地恢复。</p>
                {message.rewrittenPrompt ? (
                  <button
                    type="button"
                    onClick={() => onCopyPrompt(message.rewrittenPrompt || "")}
                    className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-200 bg-white/70 px-3 py-2 text-xs font-medium text-amber-800 hover:bg-white"
                  >
                    <Copy size={14} />
                    复制提示词
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        )
      )}
    </div>
  );
}
