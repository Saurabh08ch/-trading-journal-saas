-- CreateTable
CREATE TABLE "monthly_snapshots" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_trades" INTEGER NOT NULL,
    "win_rate" DOUBLE PRECISION NOT NULL,
    "total_profit" DOUBLE PRECISION NOT NULL,
    "avg_rr" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monthly_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_snapshots_user_id_month_year_key"
ON "monthly_snapshots"("user_id", "month", "year");

-- CreateIndex
CREATE INDEX "monthly_snapshots_user_id_year_month_idx"
ON "monthly_snapshots"("user_id", "year", "month");

-- AddForeignKey
ALTER TABLE "monthly_snapshots"
ADD CONSTRAINT "monthly_snapshots_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
