-- CreateTable
CREATE TABLE "public_reports" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "public_reports_user_id_month_idx" ON "public_reports"("user_id", "month");

-- CreateIndex
CREATE INDEX "public_reports_is_public_idx" ON "public_reports"("is_public");

-- AddForeignKey
ALTER TABLE "public_reports" ADD CONSTRAINT "public_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
