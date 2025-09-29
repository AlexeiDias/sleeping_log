-- DropForeignKey
ALTER TABLE `Baby` DROP FOREIGN KEY `Baby_facilityId_fkey`;

-- DropIndex
DROP INDEX `Baby_facilityId_fkey` ON `Baby`;

-- AlterTable
ALTER TABLE `Baby` MODIFY `facilityId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Baby` ADD CONSTRAINT `Baby_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `Facility`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
