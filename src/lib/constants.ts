export const INSTRUMENT_OPTIONS = [
  { value: "NIFTY", label: "Nifty" },
  { value: "BANKNIFTY", label: "Bank Nifty" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "STOCKS", label: "Stocks" },
] as const;

export const TRADE_TYPE_OPTIONS = [
  { value: "BUY", label: "BUY (Long)" },
  { value: "SELL", label: "SELL (Short)" },
] as const;

export const EMOTION_OPTIONS = [
  { value: "FEAR", label: "Fear" },
  { value: "FOMO", label: "FOMO" },
  { value: "REVENGE_TRADING", label: "Revenge trading" },
  { value: "CONFIDENCE", label: "Confidence" },
  { value: "DISCIPLINE", label: "Discipline" },
] as const;

export const OUTCOME_LABELS = {
  WIN: "Win",
  LOSS: "Loss",
  BREAKEVEN: "Breakeven",
} as const;

export const TRADE_TYPE_LABELS = {
  BUY: "BUY (Long)",
  SELL: "SELL (Short)",
} as const;

export const INSTRUMENT_VALUES = INSTRUMENT_OPTIONS.map((option) => option.value) as [
  (typeof INSTRUMENT_OPTIONS)[number]["value"],
  ...(typeof INSTRUMENT_OPTIONS)[number]["value"][],
];

export const TRADE_TYPE_VALUES = TRADE_TYPE_OPTIONS.map((option) => option.value) as [
  (typeof TRADE_TYPE_OPTIONS)[number]["value"],
  ...(typeof TRADE_TYPE_OPTIONS)[number]["value"][],
];

export const EMOTION_VALUES = EMOTION_OPTIONS.map((option) => option.value) as [
  (typeof EMOTION_OPTIONS)[number]["value"],
  ...(typeof EMOTION_OPTIONS)[number]["value"][],
];

export type TradeTypeValue = (typeof TRADE_TYPE_OPTIONS)[number]["value"];

export const APP_NAME = "TradePilot";
