-- AlterTable
ALTER TABLE `opportunity` ADD COLUMN `isDemo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sourceUrl` VARCHAR(2048) NULL,
    ADD COLUMN `verificationNotes` TEXT NULL;
