"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MessageSquare, Send } from "lucide-react";

import type { SerializedTradeComment } from "@/lib/mentor-service";

type TradeCommentPanelProps = {
  tradeId: string;
  comments: SerializedTradeComment[];
};

export function TradeCommentPanel({ tradeId, comments }: TradeCommentPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <MessageSquare className="h-4 w-4 text-accent" />
        Mentor feedback
      </div>

      <div className="mt-4 space-y-3">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            No comments yet. Leave guidance on entry timing, stop placement, or execution
            quality.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium text-white">
                  {comment.mentor.name ?? comment.mentor.email ?? "Mentor"}
                </div>
                <div className="text-xs text-slate-500">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(comment.createdAt))}
                </div>
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-300">{comment.comment}</div>
            </div>
          ))
        )}
      </div>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setErrorMessage("");
          setSuccessMessage("");

          startTransition(async () => {
            const response = await fetch(`/api/mentor/trades/${tradeId}/comments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                comment: draft,
              }),
            });

            const body = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;

            if (!response.ok) {
              setErrorMessage(body?.error ?? "Unable to save feedback right now.");
              return;
            }

            setDraft("");
            setSuccessMessage("Comment added.");
            router.refresh();
          });
        }}
      >
        <textarea
          className="textarea min-h-28"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='Examples: "Entry was too early" or "Good trade execution."'
        />

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        <div className="flex justify-end">
          <button type="submit" className="primary-button gap-2" disabled={isPending}>
            <Send className="h-4 w-4" />
            {isPending ? "Saving..." : "Leave comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
