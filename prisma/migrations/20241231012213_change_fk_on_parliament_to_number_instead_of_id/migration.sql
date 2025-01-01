/*
  Warnings:

  - You are about to drop the column `parliamentId` on the `Bill` table. All the data in the column will be lost.
  - Added the required column `parliamentNumber` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Bill` DROP FOREIGN KEY `Bill_parliamentId_fkey`;

-- DropIndex
DROP INDEX `Bill_parliamentId_fkey` ON `Bill`;

-- AlterTable
ALTER TABLE `Bill` DROP COLUMN `parliamentId`,
    ADD COLUMN `parliamentNumber` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_parliamentNumber_fkey` FOREIGN KEY (`parliamentNumber`) REFERENCES `Parliament`(`number`) ON DELETE RESTRICT ON UPDATE CASCADE;
