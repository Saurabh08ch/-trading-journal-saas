import { z } from "zod";

import { EMOTION_VALUES, INSTRUMENT_VALUES, TRADE_TYPE_VALUES } from "@/lib/constants";

export const tradeFormSchema = z
  .object({
    date: z.string().min(1, "Trade date is required."),
    instrument: z.enum(INSTRUMENT_VALUES),
    tradeType: z.enum(TRADE_TYPE_VALUES).optional().default("BUY"),
    strategy: z.string().trim().min(2, "Strategy name is required.").max(80),
    entryPrice: z.coerce.number().positive("Entry price must be greater than 0."),
    exitPrice: z.coerce.number().positive("Exit price must be greater than 0."),
    stopLoss: z.coerce.number().positive("Stop loss must be greater than 0."),
    riskPercent: z.coerce.number().min(0, "Risk % cannot be negative.").max(100),
    positionSize: z.coerce.number().positive("Position size must be greater than 0."),
    emotion: z.enum(EMOTION_VALUES),
    notes: z.string().trim().max(2000).optional().default(""),
    existingScreenshotUrl: z.string().optional().default(""),
    removeScreenshot: z.enum(["true", "false"]).optional().default("false"),
  })
  .refine((value) => value.entryPrice !== value.stopLoss, {
    path: ["stopLoss"],
    message: "Stop loss cannot match the entry price.",
  });

export function toTradeDate(date: string) {
  return new Date(`${date}T12:00:00.000Z`);
}
