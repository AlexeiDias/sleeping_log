/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Baby` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SleepLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `SleepLog` DROP FOREIGN KEY `SleepLog_babyId_fkey`;

-- DropIndex
DROP INDEX `SleepLog_babyId_fkey` ON `SleepLog`;

-- AlterTable
ALTER TABLE `Baby` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `SleepLog` DROP COLUMN `createdAt`,
    MODIFY `note` TEXT NULL;

-- CreateTable
CREATE TABLE `DiaperLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` ENUM('WET', 'SOLID', 'BOTH') NOT NULL,
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeedingLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mealType` ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK') NOT NULL,
    `menu` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BottleFeed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `volumeMl` INTEGER NOT NULL,
    `note` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SleepLog` ADD CONSTRAINT `SleepLog_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `Baby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaperLog` ADD CONSTRAINT `DiaperLog_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `Baby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedingLog` ADD CONSTRAINT `FeedingLog_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `Baby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BottleFeed` ADD CONSTRAINT `BottleFeed_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `Baby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
