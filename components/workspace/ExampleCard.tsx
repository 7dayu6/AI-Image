import Image from "next/image";
import type { PromptExample } from "@/lib/types";

type ExampleCardProps = {
  example: PromptExample;
  active: boolean;
  onSelect: (example: PromptExample) => void;
  priority?: boolean;
};

export function ExampleCard({ example, active, onSelect, priority = false }: ExampleCardProps) {
  return (
    <article
      className={[
        "rounded-lg border p-2 transition",
        active
          ? "border-teal-400 bg-teal-50/45 shadow-sm shadow-teal-900/10"
          : "border-slate-200 bg-white shadow-sm shadow-slate-200/50 hover:border-teal-200 hover:bg-slate-50"
      ].join(" ")}
    >
      <div className="grid grid-cols-[82px_1fr] gap-3">
        <div className="relative h-24 overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200/70">
          <Image
            src={example.sampleImageUrl}
            alt={example.title}
            fill
            sizes="82px"
            priority={priority}
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-950">{example.title}</h3>
            <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
              {example.defaultAspectRatio}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{example.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {example.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/75 px-2 py-0.5 text-[11px] font-medium text-teal-700 ring-1 ring-teal-100">
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onSelect(example)}
            className={[
              "mt-2 min-h-9 rounded-md px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-teal-600 text-white shadow-sm shadow-teal-900/20 hover:bg-teal-700"
                : "bg-slate-950 text-white hover:bg-slate-800"
            ].join(" ")}
          >
            用这个
          </button>
        </div>
      </div>
    </article>
  );
}
