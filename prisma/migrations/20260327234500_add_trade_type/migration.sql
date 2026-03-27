-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('BUY', 'SELL');

-- AlterTable
ALTER TABLE "trades"
ADD COLUMN "trade_type" "TradeType" NOT NULL DEFAULT 'BUY';
