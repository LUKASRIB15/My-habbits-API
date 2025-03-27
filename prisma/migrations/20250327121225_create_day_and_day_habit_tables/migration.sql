-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_habit" (
    "id" TEXT NOT NULL,
    "habit_id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,

    CONSTRAINT "day_habit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "day_habit" ADD CONSTRAINT "day_habit_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_habit" ADD CONSTRAINT "day_habit_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
