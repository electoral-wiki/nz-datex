-- CreateTable
CREATE TABLE `Parliament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `number` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,

    UNIQUE INDEX `Parliament_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `parliamentId` INTEGER NOT NULL,

    UNIQUE INDEX `Bill_uuid_key`(`uuid`),
    UNIQUE INDEX `Bill_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hansard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `billId` INTEGER NOT NULL,

    UNIQUE INDEX `Hansard_documentId_key`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HansardQuote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hansardId` INTEGER NOT NULL,
    `ord` INTEGER NOT NULL,
    `speaker` VARCHAR(255) NOT NULL,
    `speakerNote` VARCHAR(255) NULL,
    `quote` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillVote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hansardId` INTEGER NOT NULL,
    `voterGroup` VARCHAR(255) NOT NULL,
    `voteCount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bill` ADD CONSTRAINT `Bill_parliamentId_fkey` FOREIGN KEY (`parliamentId`) REFERENCES `Parliament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hansard` ADD CONSTRAINT `Hansard_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `Bill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HansardQuote` ADD CONSTRAINT `HansardQuote_hansardId_fkey` FOREIGN KEY (`hansardId`) REFERENCES `Hansard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BillVote` ADD CONSTRAINT `BillVote_hansardId_fkey` FOREIGN KEY (`hansardId`) REFERENCES `Hansard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
