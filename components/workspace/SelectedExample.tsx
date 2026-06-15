import Image from "next/image";
import { ChevronDown, RefreshCw } from "lucide-react";
import type { GenerationMode, PromptExample } from "@/lib/types";

type SelectedExampleProps = {
  example: PromptExample;
  mode: GenerationMode;
  promptOpen: boolean;
  onTogglePrompt: () => void;
  onOpenDrawer: () => void;
};

export function SelectedExample({
  example,
  mode,
  promptOpen,
  onTogglePrompt,
  onOpenDrawer
}: SelectedExampleProps) {
  if (mode === "free") {
    return (
      <section className="border-b border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-200/40 lg:p-5">
        <p className="text-xs font-medium text-teal-700">当前模式</p>
        <h2 className="text-lg font-semibold text-slate-950">自由提示词</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          直接描述画面主体、场景、风格和比例，系统会优化提示词并生成图片。
        </p>
      </section>
    );
  }
  return (
    <section className="border-b border-slate-200 bg-white/95 p-3 shadow-sm shadow-slate-200/40 lg:p-5">
      <div className="flex gap-3 lg:gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 lg:size-24">
          <Image
            src={example.sampleImageUrl}
            alt={example.title}
            fill
            sizes="(min-width: 1024px) 96px, 64px"
            priority
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-teal-700">当前样例</p>
              <h2 className="truncate text-base font-semibold text-slate-950 lg:text-lg">{example.title}</h2>
            </div>
            <button
              type="button"
              onClick={onOpenDrawer}
              className="grid size-11 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm shadow-slate-200/50 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 lg:hidden"
            >
              <RefreshCw size={15} />
              <span className="sr-only">换一个样例</span>
            </button>
          </div>
          <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">{example.description}</p>
          <div className="mt-2 flex flex-wrap gap-2 lg:mt-3">
            {example.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={onTogglePrompt}
            className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-md px-1 text-sm font-medium text-teal-700 transition hover:bg-teal-50 lg:mt-3"
          >
            查看原始提示词
            <ChevronDown size={15} className={promptOpen ? "rotate-180 transition" : "transition"} />
          </button>
        </div>
      </div>
      {promptOpen ? (
        <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
          {example.originalPrompt}
        </div>
      ) : null}
    </section>
  );
}
