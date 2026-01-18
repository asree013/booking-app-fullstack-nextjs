/*
  Warnings:

  - You are about to drop the column `booking_id` on the `Rooms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Rooms` DROP FOREIGN KEY `Rooms_booking_id_fkey`;

-- DropIndex
DROP INDEX `Rooms_booking_id_fkey` ON `Rooms`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `rating` INTEGER NULL;

-- AlterTable
ALTER TABLE `Rooms` DROP COLUMN `booking_id`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `image` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Rooms` ADD CONSTRAINT `Rooms_id_fkey` FOREIGN KEY (`id`) REFERENCES `Bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
