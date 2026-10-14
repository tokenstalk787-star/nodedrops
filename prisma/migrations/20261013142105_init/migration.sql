-- CreateTable
CREATE TABLE `Opportunity` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `summary` VARCHAR(500) NOT NULL,
    `category` VARCHAR(80) NOT NULL,
    `network` VARCHAR(120) NULL,
    `status` ENUM('UPCOMING', 'ACTIVE', 'PAUSED', 'ENDED') NOT NULL DEFAULT 'UPCOMING',
    `incentiveStatus` ENUM('CONFIRMED', 'POTENTIAL', 'NOT_ANNOUNCED') NOT NULL DEFAULT 'NOT_ANNOUNCED',
    `difficulty` VARCHAR(40) NULL,
    `estimatedCostUsd` DECIMAL(10, 2) NULL,
    `officialUrl` VARCHAR(2048) NULL,
    `lastVerifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Opportunity_slug_key`(`slug`),
    INDEX `Opportunity_status_category_idx`(`status`, `category`),
    INDEX `Opportunity_incentiveStatus_idx`(`incentiveStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
