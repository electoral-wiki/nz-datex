/*
  Warnings:

  - You are about to drop the column `billId` on the `Hansard` table. All the data in the column will be lost.
  - Added the required column `billNumber` to the `Hansard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Hansard` DROP FOREIGN KEY `Hansard_billId_fkey`;

-- DropIndex
DROP INDEX `Hansard_billId_fkey` ON `Hansard`;

-- AlterTable
ALTER TABLE `Hansard` DROP COLUMN `billId`,
    ADD COLUMN `billNumber` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Hansard` ADD CONSTRAINT `Hansard_billNumber_fkey` FOREIGN KEY (`billNumber`) REFERENCES `Bill`(`number`) ON DELETE RESTRICT ON UPDATE CASCADE;
