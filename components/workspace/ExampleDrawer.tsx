import type { PromptExample } from "@/lib/types";
import { ExampleCard } from "@/components/workspace/ExampleCard";

type ExampleDrawerProps = {
  open: boolean;
  examples: PromptExample[];
  selectedExample: PromptExample;
  onClose: () => void;
  onSelectExample: (example: PromptExample) => void;
};

export function ExampleDrawer({
  open,
  examples,
  selectedExample,
  onClose,
  onSelectExample
}: ExampleDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm lg:hidden">
      <div className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-950">选择提示词样例</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-md px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            关闭
          </button>
        </div>
        <div className="space-y-3">
          {examples.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              active={example.id === selectedExample.id}
              onSelect={(nextExample) => {
                onSelectExample(nextExample);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
