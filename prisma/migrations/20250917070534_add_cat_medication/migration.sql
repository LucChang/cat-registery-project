/*
  Warnings:

  - You are about to drop the column `description` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `nextVisit` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `MedicalRecord` table. All the data in the column will be lost.
  - Added the required column `date` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `diagnosis` on table `MedicalRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `medication` on table `MedicalRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `treatment` on table `MedicalRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `veterinarian` on table `MedicalRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "MedicationRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "volunteer" TEXT NOT NULL,
    "morningDose" BOOLEAN NOT NULL DEFAULT false,
    "eveningDose" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "medicalRecordId" TEXT NOT NULL,
    CONSTRAINT "MedicationRecord_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatMedication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT NOT NULL DEFAULT '每日',
    "morning" BOOLEAN NOT NULL DEFAULT false,
    "afternoon" BOOLEAN NOT NULL DEFAULT false,
    "evening" BOOLEAN NOT NULL DEFAULT false,
    "night" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "catId" TEXT NOT NULL,
    CONSTRAINT "CatMedication_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "veterinarian" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "cost" REAL,
    "medication" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catId" TEXT NOT NULL,
    CONSTRAINT "MedicalRecord_catId_fkey" FOREIGN KEY ("catId") REFERENCES "Cat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MedicalRecord" ("catId", "cost", "createdAt", "diagnosis", "id", "medication", "notes", "title", "treatment", "veterinarian") SELECT "catId", "cost", "createdAt", "diagnosis", "id", "medication", "notes", "title", "treatment", "veterinarian" FROM "MedicalRecord";
DROP TABLE "MedicalRecord";
ALTER TABLE "new_MedicalRecord" RENAME TO "MedicalRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
