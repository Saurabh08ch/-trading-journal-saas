import { Emotion, Instrument, Prisma, TradeOutcome, TradeType } from "@prisma/client";

import { calculateTradeMetrics } from "@/lib/trade-math";
import { deleteUploadByUrl, saveScreenshot } from "@/lib/uploads";
import { tradeFormSchema, toTradeDate } from "@/lib/validations/trade";

type BuildTradeWriteInputResult =
  | {
      success: true;
      data: Omit<Prisma.TradeUncheckedCreateInput, "userId">;
    }
  | {
      success: false;
      error: string;
    };

export async function buildTradeWriteInput(
  formData: FormData,
  userId: string,
  currentScreenshotUrl?: string | null,
): Promise<BuildTradeWriteInputResult> {
  const parsed = tradeFormSchema.safeParse({
    date: formData.get("date"),
    instrument: formData.get("instrument"),
    tradeType: formData.get("tradeType"),
    strategy: formData.get("strategy"),
    entryPrice: formData.get("entryPrice"),
    exitPrice: formData.get("exitPrice"),
    stopLoss: formData.get("stopLoss"),
    riskPercent: formData.get("riskPercent"),
    positionSize: formData.get("positionSize"),
    emotion: formData.get("emotion"),
    notes: formData.get("notes"),
    existingScreenshotUrl: formData.get("existingScreenshotUrl"),
    removeScreenshot: formData.get("removeScreenshot"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid trade data.",
    };
  }

  const screenshotField = formData.get("screenshot");
  const screenshotFile =
    screenshotField instanceof File && screenshotField.size > 0 ? screenshotField : null;

  let screenshotUrl = currentScreenshotUrl ?? null;

  if (parsed.data.removeScreenshot === "true") {
    await deleteUploadByUrl(screenshotUrl);
    screenshotUrl = null;
  }

  if (screenshotFile) {
    if (screenshotUrl) {
      await deleteUploadByUrl(screenshotUrl);
    }

    screenshotUrl = await saveScreenshot(screenshotFile, userId);
  }

  const metrics = calculateTradeMetrics({
    tradeType: parsed.data.tradeType,
    entryPrice: parsed.data.entryPrice,
    exitPrice: parsed.data.exitPrice,
    stopLoss: parsed.data.stopLoss,
    positionSize: parsed.data.positionSize,
  });

  return {
    success: true,
    data: {
      date: toTradeDate(parsed.data.date),
      instrument: parsed.data.instrument as Instrument,
      tradeType: parsed.data.tradeType as TradeType,
      strategy: parsed.data.strategy,
      entryPrice: parsed.data.entryPrice,
      exitPrice: parsed.data.exitPrice,
      stopLoss: parsed.data.stopLoss,
      riskPercent: parsed.data.riskPercent,
      positionSize: parsed.data.positionSize,
      pnl: metrics.pnl,
      rrRatio: metrics.rrRatio,
      outcome: metrics.outcome as TradeOutcome,
      emotion: parsed.data.emotion as Emotion,
      notes: parsed.data.notes || null,
      screenshotUrl,
    },
  };
}
