import { Search } from "lucide-react";
import { categories } from "@/lib/examples";
import type { PromptExample } from "@/lib/types";
import { ExampleCard } from "@/components/workspace/ExampleCard";

type TemplatePanelProps = {
  examples: PromptExample[];
  selectedExample: PromptExample;
  category: string;
  query: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onSelectExample: (example: PromptExample) => void;
};

export function TemplatePanel({
  examples,
  selectedExample,
  category,
  query,
  onCategoryChange,
  onQueryChange,
  onSelectExample
}: TemplatePanelProps) {
  return (
    <aside className="hidden h-dvh w-[340px] shrink-0 border-l border-slate-200 bg-white/95 lg:flex lg:flex-col">
      <div className="border-b border-slate-100 p-5 shadow-sm shadow-slate-200/30">
        <h2 className="text-base font-semibold text-slate-950">模板库</h2>
        <label className="mt-4 flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-teal-400 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-teal-900/10">
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
                "min-h-9 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                item === category
                  ? "bg-teal-600 text-white shadow-sm shadow-teal-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
      </div>
    </aside>
  );
}
