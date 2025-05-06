-- CreateTable
CREATE TABLE `DailyNote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `babyId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `content` TEXT NOT NULL,

    UNIQUE INDEX `DailyNote_babyId_date_key`(`babyId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyNote` ADD CONSTRAINT `DailyNote_babyId_fkey` FOREIGN KEY (`babyId`) REFERENCES `Baby`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
