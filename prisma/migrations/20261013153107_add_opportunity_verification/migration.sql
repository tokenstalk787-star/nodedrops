-- AlterTable
-- Match the exact table casing used by the initial migration.
ALTER TABLE `Opportunity` ADD COLUMN `isDemo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sourceUrl` VARCHAR(2048) NULL,
    ADD COLUMN `verificationNotes` TEXT NULL;
