"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import type { LocalChatSession } from "@/lib/types";

type DeleteSessionDialogProps = {
  session: LocalChatSession | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteSessionDialog({ session, onCancel, onConfirm }: DeleteSessionDialogProps) {
  useEffect(() => {
    if (!session) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, session]);

  if (!session) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-session-title"
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-left shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0">
            <h2 id="delete-session-title" className="text-base font-semibold text-slate-950">
              删除聊天
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">确定要删除“{session.title}”吗？</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">删除后，这条本地历史记录无法恢复。</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            确认删除
          </button>
        </div>
      </section>
    </div>
  );
}
