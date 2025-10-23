/*
  Warnings:

  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MedicalRecord` DROP FOREIGN KEY `MedicalRecord_catId_fkey`;

-- DropTable
DROP TABLE `MedicalRecord`;

-- CreateTable
CREATE TABLE `MedicationRecord` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `volunteer` VARCHAR(191) NOT NULL,
    `morningDose` BOOLEAN NOT NULL DEFAULT false,
    `eveningDose` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,
    `catId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicationRecord` ADD CONSTRAINT `MedicationRecord_catId_fkey` FOREIGN KEY (`catId`) REFERENCES `Cat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
