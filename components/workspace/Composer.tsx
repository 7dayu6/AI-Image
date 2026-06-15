import { SendHorizontal } from "lucide-react";

type ComposerProps = {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function Composer({ value, disabled, placeholder, onChange, onSubmit }: ComposerProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm shadow-slate-200/60 transition focus-within:border-teal-400 focus-within:shadow-md focus-within:shadow-teal-900/10">
          <textarea
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            rows={2}
            placeholder={placeholder}
            className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
          />
          <button
            type="button"
            disabled={disabled || !value.trim()}
            onClick={onSubmit}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <SendHorizontal size={16} />
            生成图片
          </button>
        </div>
      </div>
    </div>
  );
}
