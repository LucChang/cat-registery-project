/*
  Warnings:

  - You are about to drop the column `height` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `HealthRecord` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `HealthRecord` table. All the data in the column will be lost.
  - Added the required column `cough` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dryFood` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stool` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symptoms` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeSlot` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urine` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vomiting` to the `HealthRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HealthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "dryFood" TEXT NOT NULL,
    "stool" TEXT NOT NULL,
    "urine" TEXT NOT NULL,
    "vomiting" TEXT NOT NULL,
    "cough" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "behavior" TEXT,
    "notes" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catId" TEXT NOT NULL,
    CONSTRAINT "HealthRecord_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HealthRecord" ("catId", "id", "notes", "recordedAt") SELECT "catId", "id", "notes", "recordedAt" FROM "HealthRecord";
DROP TABLE "HealthRecord";
ALTER TABLE "new_HealthRecord" RENAME TO "HealthRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
