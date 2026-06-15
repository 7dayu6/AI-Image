import { Search } from "lucide-react";
import { categories } from "@/lib/examples";
import type { LocalGenerationRecord, PromptExample } from "@/lib/types";
import { ExampleCard } from "@/components/workspace/ExampleCard";

type SidebarProps = {
  examples: PromptExample[];
  selectedExample: PromptExample;
  category: string;
  query: string;
  history: LocalGenerationRecord[];
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onSelectExample: (example: PromptExample) => void;
  onOpenHistoryRecord: (record: LocalGenerationRecord) => void;
};

export function Sidebar({
  examples,
  selectedExample,
  category,
  query,
  history,
  onCategoryChange,
  onQueryChange,
  onSelectExample,
  onOpenHistoryRecord
}: SidebarProps) {
  const recentHistory = history.slice(0, 4);

  return (
    <aside className="hidden h-dvh w-[360px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-teal-600 text-lg font-bold text-white">
            灵
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-950">灵感绘图</h1>
            <p className="text-xs text-slate-500">一句话改出你的专属图片</p>
          </div>
        </div>
        <label className="mt-5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="搜索样例、风格或用途"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onCategoryChange(item)}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-medium",
                item === category
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {examples.map((example, index) => (
          <ExampleCard
            key={example.id}
            example={example}
            active={example.id === selectedExample.id}
            priority={index === 0}
            onSelect={onSelectExample}
          />
        ))}
        <section className="pt-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">最近生成</h2>
            <span className="text-xs text-slate-400">{history.length}</span>
          </div>
          {recentHistory.length ? (
            <div className="space-y-2">
              {recentHistory.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onOpenHistoryRecord(record)}
                  className="flex w-full gap-3 rounded-lg border border-slate-200 bg-white p-2 text-left transition hover:border-teal-300 hover:bg-teal-50"
                >
                  {/* Generated images may be data URLs, so use a plain image element. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={record.imageUrl}
                    alt={`${record.exampleTitle} 生成记录`}
                    className="size-12 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">{record.exampleTitle}</span>
                    <span className="line-clamp-2 text-xs leading-5 text-slate-500">{record.userInstruction}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-xs leading-5 text-slate-500">
              生成后的图片会保存在这个浏览器里，方便继续改。
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
