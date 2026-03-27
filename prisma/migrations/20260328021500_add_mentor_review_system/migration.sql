-- CreateTable
CREATE TABLE "mentor_students" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "mentor_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_comments" (
    "id" TEXT NOT NULL,
    "trade_id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trade_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentor_students_mentor_id_student_id_key" ON "mentor_students"("mentor_id", "student_id");

-- CreateIndex
CREATE INDEX "mentor_students_mentor_id_idx" ON "mentor_students"("mentor_id");

-- CreateIndex
CREATE INDEX "mentor_students_student_id_idx" ON "mentor_students"("student_id");

-- CreateIndex
CREATE INDEX "trade_comments_trade_id_created_at_idx" ON "trade_comments"("trade_id", "created_at");

-- CreateIndex
CREATE INDEX "trade_comments_mentor_id_idx" ON "trade_comments"("mentor_id");

-- AddForeignKey
ALTER TABLE "mentor_students" ADD CONSTRAINT "mentor_students_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_students" ADD CONSTRAINT "mentor_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_comments" ADD CONSTRAINT "trade_comments_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_comments" ADD CONSTRAINT "trade_comments_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
