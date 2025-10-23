/*
  Warnings:

  - You are about to drop the column `date` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the `MedicationRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitDate` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `MedicationRecord` DROP FOREIGN KEY `MedicationRecord_medicalRecordId_fkey`;

-- AlterTable
ALTER TABLE `MedicalRecord` DROP COLUMN `date`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `nextVisit` DATETIME(3) NULL,
    ADD COLUMN `visitDate` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `MedicationRecord`;
