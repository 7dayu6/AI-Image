import type { GenerationMode } from "@/lib/types";

type ModeSwitchProps = {
  mode: GenerationMode;
  onChange: (mode: GenerationMode) => void;
};

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 ring-1 ring-slate-200/70">
      <button
        type="button"
        onClick={() => onChange("template")}
        className={[
          "min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition",
          mode === "template"
            ? "bg-white text-slate-950 shadow-sm shadow-slate-200/80"
            : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
        ].join(" ")}
      >
        模板改图
      </button>
      <button
        type="button"
        onClick={() => onChange("free")}
        className={[
          "min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition",
          mode === "free"
            ? "bg-white text-slate-950 shadow-sm shadow-slate-200/80"
            : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
        ].join(" ")}
      >
        自由提示词
      </button>
    </div>
  );
}
