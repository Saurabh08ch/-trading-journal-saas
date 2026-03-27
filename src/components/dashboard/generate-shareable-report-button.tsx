"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Loader2 } from "lucide-react";

type ReportGenerationResponse = {
  publicPath?: string;
  error?: string;
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export function GenerateShareableReportButton() {
  const [statusMessage, setStatusMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="secondary-button w-full justify-between"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            setStatusMessage("");

            try {
              const response = await fetch("/api/report/generate", {
                method: "POST",
              });
              const body = (await response.json().catch(() => null)) as
                | ReportGenerationResponse
                | null;

              if (!response.ok || !body?.publicPath) {
                setCopiedUrl("");
                setStatusMessage(
                  body?.error ?? "Unable to generate a shareable report right now.",
                );
                return;
              }

              const publicUrl = new URL(body.publicPath, window.location.origin).toString();
              await copyToClipboard(publicUrl);

              setCopiedUrl(publicUrl);
              setStatusMessage("Shareable report link copied to your clipboard.");
            } catch {
              setCopiedUrl("");
              setStatusMessage("Unable to copy the report link right now.");
            }
          });
        }}
      >
        {isPending ? (
          <>
            Generating report
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Generate shareable report
            <Link2 className="h-4 w-4" />
          </>
        )}
      </button>

      {statusMessage ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            {copiedUrl ? (
              <Check className="h-3.5 w-3.5 text-emerald-300" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-rose-300" />
            )}
            <span>{statusMessage}</span>
          </div>
          {copiedUrl ? <div className="mt-2 truncate text-slate-500">{copiedUrl}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
