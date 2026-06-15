import { ImageIcon, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import type { MouseEvent } from "react";
import type { GenerationMode, LocalChatSession } from "@/lib/types";
import { ModeSwitch } from "@/components/workspace/ModeSwitch";

type HistorySidebarProps = {
  sessions: LocalChatSession[];
  mode: GenerationMode;
  activeSessionId?: string;
  onModeChange: (mode: GenerationMode) => void;
  onNewChat: () => void;
  onOpenSession: (session: LocalChatSession) => void;
  onDeleteSession: (session: LocalChatSession) => void;
};

function statusText(session: LocalChatSession): string {
  if (session.lastStatus === "generating") return "生成中";
  if (session.lastStatus === "error") return "生成失败";
  if (session.lastStatus === "success") return session.imageCount > 0 ? `${session.imageCount} 张图片` : "已生成";
  if (session.imageCount > 0) return `${session.imageCount} 张图片`;
  return "暂无图片";
}

function StatusIcon({ status }: { status: LocalChatSession["lastStatus"] }) {
  if (status === "generating") return <Loader2 size={14} className="animate-spin text-teal-600" />;
  if (status === "error") return <XCircle size={14} className="text-red-500" />;
  return <ImageIcon size={14} className="text-slate-400" />;
}

export function HistorySidebar({
  sessions,
  mode,
  activeSessionId,
  onModeChange,
  onNewChat,
  onOpenSession,
  onDeleteSession
}: HistorySidebarProps) {
  return (
    <aside className="hidden h-dvh w-[300px] shrink-0 border-r border-slate-200 bg-white/95 lg:flex lg:flex-col">
      <div className="border-b border-slate-100 p-5 shadow-sm shadow-slate-200/30">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-teal-600 text-lg font-bold text-white shadow-sm shadow-teal-900/20">
            灵
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-950">灵感绘图</h1>
            <p className="text-xs text-slate-500">一句话改出你的专属图片</p>
          </div>
        </div>
        <div className="mt-5">
          <ModeSwitch mode={mode} onChange={onModeChange} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">历史聊天</h2>
            <span className="text-xs text-slate-400">{sessions.length}</span>
          </div>
          <button
            type="button"
            onClick={onNewChat}
            className="grid size-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm shadow-slate-200/50 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
            aria-label="新建聊天"
            title="新建聊天"
          >
            <Plus size={16} />
          </button>
        </div>
        {sessions.length ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <article
                key={session.id}
                className={[
                  "group relative rounded-lg border transition",
                  session.id === activeSessionId
                    ? "border-teal-300 bg-teal-50/80 shadow-sm shadow-teal-900/10"
                    : "border-slate-200 bg-white shadow-sm shadow-slate-200/40 hover:border-teal-200 hover:bg-slate-50"
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => onOpenSession(session)}
                  className="flex min-h-[72px] w-full gap-3 p-3 pr-10 text-left"
                >
                  {session.lastImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.lastImageUrl} alt="" className="size-12 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-md bg-slate-100 ring-1 ring-slate-200/70">
                      <StatusIcon status={session.lastStatus} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">{session.title}</span>
                    <span className="block truncate text-xs text-slate-500">{session.lastUserInput}</span>
                    <span className="mt-1 block text-[11px] text-slate-400">{statusText(session)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    onDeleteSession(session);
                  }}
                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-md text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label={`删除聊天 ${session.title}`}
                  title="删除聊天"
                >
                  <Trash2 size={14} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-xs leading-5 text-slate-500">
            发送第一条指令后，这里会出现聊天记录。
          </p>
        )}
      </div>
    </aside>
  );
}
