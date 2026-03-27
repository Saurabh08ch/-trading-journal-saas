"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, Calculator, ImagePlus, X } from "lucide-react";

import {
  EMOTION_OPTIONS,
  INSTRUMENT_OPTIONS,
  OUTCOME_LABELS,
  TRADE_TYPE_LABELS,
  TRADE_TYPE_OPTIONS,
} from "@/lib/constants";
import { calculateTradeMetrics } from "@/lib/trade-math";
import { SerializedTrade } from "@/lib/trade-service";
import { formatCurrency, formatDecimal, toDateInputValue } from "@/lib/utils";

type TradeFormProps = {
  mode: "create" | "edit";
  trade?: SerializedTrade;
};

type TradeFormState = {
  date: string;
  instrument: (typeof INSTRUMENT_OPTIONS)[number]["value"];
  tradeType: (typeof TRADE_TYPE_OPTIONS)[number]["value"];
  strategy: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  riskPercent: string;
  positionSize: string;
  emotion: (typeof EMOTION_OPTIONS)[number]["value"];
  notes: string;
  existingScreenshotUrl: string;
  removeScreenshot: boolean;
};

function getInitialState(trade?: SerializedTrade): TradeFormState {
  return {
    date: trade ? toDateInputValue(trade.date) : new Date().toISOString().slice(0, 10),
    instrument: trade?.instrument ?? "NIFTY",
    tradeType: trade?.tradeType ?? "BUY",
    strategy: trade?.strategy ?? "",
    entryPrice: trade ? String(trade.entryPrice) : "",
    exitPrice: trade ? String(trade.exitPrice) : "",
    stopLoss: trade ? String(trade.stopLoss) : "",
    riskPercent: trade ? String(trade.riskPercent) : "",
    positionSize: trade ? String(trade.positionSize) : "",
    emotion: trade?.emotion ?? "DISCIPLINE",
    notes: trade?.notes ?? "",
    existingScreenshotUrl: trade?.screenshotUrl ?? "",
    removeScreenshot: false,
  };
}

export function TradeForm({ mode, trade }: TradeFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<TradeFormState>(() => getInitialState(trade));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(trade?.screenshotUrl ?? "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const liveMetrics = calculateTradeMetrics({
    tradeType: formState.tradeType,
    entryPrice: Number(formState.entryPrice) || 0,
    exitPrice: Number(formState.exitPrice) || 0,
    stopLoss: Number(formState.stopLoss) || 0,
    positionSize: Number(formState.positionSize) || 0,
  });

  const submitLabel = mode === "create" ? "Save trade" : "Update trade";
  const endpoint = mode === "create" ? "/api/trades" : `/api/trades/${trade?.id}`;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form
        className="panel p-6 md:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setErrorMessage("");

          startTransition(async () => {
            const payload = new FormData();

            payload.append("date", formState.date);
            payload.append("instrument", formState.instrument);
            payload.append("tradeType", formState.tradeType);
            payload.append("strategy", formState.strategy);
            payload.append("entryPrice", formState.entryPrice);
            payload.append("exitPrice", formState.exitPrice);
            payload.append("stopLoss", formState.stopLoss);
            payload.append("riskPercent", formState.riskPercent);
            payload.append("positionSize", formState.positionSize);
            payload.append("emotion", formState.emotion);
            payload.append("notes", formState.notes);
            payload.append("existingScreenshotUrl", formState.existingScreenshotUrl);
            payload.append("removeScreenshot", String(formState.removeScreenshot));

            if (selectedFile) {
              payload.append("screenshot", selectedFile);
            }

            const response = await fetch(endpoint, {
              method: mode === "create" ? "POST" : "PUT",
              body: payload,
            });

            if (!response.ok) {
              const body = (await response.json().catch(() => null)) as
                | { error?: string }
                | null;
              setErrorMessage(body?.error ?? "Unable to save the trade right now.");
              return;
            }

            router.push("/dashboard");
            router.refresh();
          });
        }}
      >
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6">
          <span className="eyebrow">Trade capture</span>
          <h1 className="page-title">
            {mode === "create" ? "Add a new trade" : "Update trade details"}
          </h1>
          <p className="page-copy">
            Track execution quality, notes, screenshots, and emotion tags in one place.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label>
            <span className="label">Trade Date</span>
            <input
              type="date"
              className="input"
              value={formState.date}
              onChange={(event) =>
                setFormState((current) => ({ ...current, date: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span className="label">Instrument</span>
            <select
              className="input"
              value={formState.instrument}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  instrument: event.target.value as TradeFormState["instrument"],
                }))
              }
            >
              {INSTRUMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-950">
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="label">Trade Type</span>
            <select
              className="input"
              value={formState.tradeType}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  tradeType: event.target.value as TradeFormState["tradeType"],
                }))
              }
            >
              {TRADE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-950">
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="label">Strategy Name</span>
            <input
              type="text"
              className="input"
              value={formState.strategy}
              onChange={(event) =>
                setFormState((current) => ({ ...current, strategy: event.target.value }))
              }
              placeholder="Opening range breakout"
              required
            />
          </label>

          <label>
            <span className="label">Entry Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formState.entryPrice}
              onChange={(event) =>
                setFormState((current) => ({ ...current, entryPrice: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span className="label">Exit Price</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formState.exitPrice}
              onChange={(event) =>
                setFormState((current) => ({ ...current, exitPrice: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span className="label">Stop Loss</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formState.stopLoss}
              onChange={(event) =>
                setFormState((current) => ({ ...current, stopLoss: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span className="label">Risk %</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className="input"
              value={formState.riskPercent}
              onChange={(event) =>
                setFormState((current) => ({ ...current, riskPercent: event.target.value }))
              }
              required
            />
          </label>

          <label>
            <span className="label">Position Size</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input"
              value={formState.positionSize}
              onChange={(event) =>
                setFormState((current) => ({ ...current, positionSize: event.target.value }))
              }
              required
            />
          </label>

          <div className="md:col-span-2">
            <span className="label">Emotion Tag</span>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {EMOTION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    formState.emotion === option.value
                      ? "border-accent/50 bg-accent/12 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8"
                  }`}
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      emotion: option.value,
                    }))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <label className="md:col-span-2">
            <span className="label">Notes</span>
            <textarea
              className="textarea"
              value={formState.notes}
              onChange={(event) =>
                setFormState((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Execution notes, context, mistakes, confirmations..."
            />
          </label>

          <div className="md:col-span-2">
            <span className="label">Screenshot Upload</span>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center transition hover:border-accent/40 hover:bg-white/[0.06]">
              <ImagePlus className="h-7 w-7 text-accent" />
              <div>
                <p className="text-sm font-medium text-white">
                  Upload a setup or chart screenshot
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG, GIF, or WebP up to 5MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                  setFormState((current) => ({ ...current, removeScreenshot: false }));
                }}
              />
            </label>

            {previewUrl ? (
              <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70">
                <div className="relative aspect-[16/9] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Trade screenshot preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="text-xs text-slate-400">
                    {selectedFile ? selectedFile.name : "Current screenshot"}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm text-slate-300 transition hover:text-white"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                      setFormState((current) => ({
                        ...current,
                        removeScreenshot: Boolean(current.existingScreenshotUrl),
                      }));
                    }}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
          <Link href="/dashboard" className="secondary-button">
            Cancel
          </Link>
          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>

      <aside className="space-y-6">
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Live calculations</h3>
              <p className="mt-1 text-sm text-slate-400">
                Auto-calculated from trade type, entry, exit, stop, and size.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">PnL</div>
              <div
                className={`mt-2 text-2xl font-semibold ${
                  liveMetrics.pnl >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {formatCurrency(liveMetrics.pnl)}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400">Risk / Reward</div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {formatDecimal(liveMetrics.rrRatio)}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-slate-400">Total risk</div>
                <div className="mt-2 text-xl font-semibold text-white">
                  {formatCurrency(liveMetrics.totalRisk)}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Outcome</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {OUTCOME_LABELS[liveMetrics.outcome]}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-slate-400">Risk % input</div>
              <div className="mt-2 text-xl font-semibold text-white">
                {formState.riskPercent ? `${formState.riskPercent}%` : "0%"}
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-lg font-semibold text-white">Execution note</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {TRADE_TYPE_LABELS[formState.tradeType]} uses{" "}
            {formState.tradeType === "SELL"
              ? "PnL = (Entry - Exit) x Position Size."
              : "PnL = (Exit - Entry) x Position Size."}{" "}
            R is based on realized PnL divided by the risk between entry and stop loss.
          </p>
        </div>
      </aside>
    </div>
  );
}
