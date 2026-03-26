"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type DeleteTradeButtonProps = {
  tradeId: string;
};

export function DeleteTradeButton({ tradeId }: DeleteTradeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-sm text-rose-300 transition hover:text-rose-200"
      disabled={isPending}
      onClick={() => {
        const shouldDelete = window.confirm("Delete this trade?");

        if (!shouldDelete) {
          return;
        }

        startTransition(async () => {
          const response = await fetch(`/api/trades/${tradeId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            window.alert("Unable to delete this trade right now.");
            return;
          }

          router.refresh();
        });
      }}
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
