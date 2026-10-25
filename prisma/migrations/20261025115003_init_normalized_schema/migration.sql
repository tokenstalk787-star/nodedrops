-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'EDITOR', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    `avatarUrl` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    INDEX `Category_slug_idx`(`slug`),
    INDEX `Category_displayOrder_idx`(`displayOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Network` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `chainId` VARCHAR(191) NULL,
    `networkType` ENUM('MAINNET', 'TESTNET') NOT NULL DEFAULT 'MAINNET',
    `category` VARCHAR(191) NOT NULL DEFAULT 'Layer 1',
    `layer` VARCHAR(191) NOT NULL DEFAULT 'Layer 1',
    `consensus` VARCHAR(191) NOT NULL DEFAULT 'Proof-of-Stake',
    `status` ENUM('ACTIVE', 'MAINTENANCE', 'DEPRECATED') NOT NULL DEFAULT 'ACTIVE',
    `websiteUrl` VARCHAR(191) NULL,
    `docsUrl` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(191) NULL,
    `explorerUrl` VARCHAR(191) NULL,
    `rpcUrl` VARCHAR(191) NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Network_slug_key`(`slug`),
    INDEX `Network_slug_idx`(`slug`),
    INDEX `Network_networkType_idx`(`networkType`),
    INDEX `Network_status_idx`(`status`),
    INDEX `Network_isFeatured_idx`(`isFeatured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientSoftware` (
    `id` VARCHAR(191) NOT NULL,
    `networkId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `clientType` ENUM('EXECUTION', 'CONSENSUS', 'COMBINED', 'SEQUENCER', 'LIGHT_CLIENT') NOT NULL DEFAULT 'EXECUTION',
    `repoUrl` VARCHAR(191) NULL,
    `docsUrl` VARCHAR(191) NULL,
    `recommendedVersion` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClientSoftware_networkId_idx`(`networkId`),
    INDEX `ClientSoftware_clientType_idx`(`clientType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HardwareRequirement` (
    `id` VARCHAR(191) NOT NULL,
    `networkId` VARCHAR(191) NOT NULL,
    `nodeType` VARCHAR(191) NOT NULL DEFAULT 'Full Node',
    `minCpu` VARCHAR(191) NOT NULL,
    `recCpu` VARCHAR(191) NOT NULL,
    `minRamGb` INTEGER NOT NULL,
    `recRamGb` INTEGER NOT NULL,
    `minStorageGb` INTEGER NOT NULL,
    `recStorageGb` INTEGER NOT NULL,
    `storageType` VARCHAR(191) NOT NULL DEFAULT 'NVMe SSD',
    `bandwidthMbps` INTEGER NOT NULL DEFAULT 100,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `HardwareRequirement_networkId_idx`(`networkId`),
    INDEX `HardwareRequirement_nodeType_idx`(`nodeType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guide` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `difficulty` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
    `estimatedMinutes` INTEGER NOT NULL DEFAULT 30,
    `authorId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `verificationStatus` ENUM('SETUP_TESTED', 'OFFICIAL_DOCS_VERIFIED', 'COMMUNITY_REPORTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'OFFICIAL_DOCS_VERIFIED',
    `publicationStatus` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
    `verifiedAt` DATETIME(3) NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Guide_slug_key`(`slug`),
    INDEX `Guide_slug_idx`(`slug`),
    INDEX `Guide_difficulty_idx`(`difficulty`),
    INDEX `Guide_verificationStatus_idx`(`verificationStatus`),
    INDEX `Guide_publicationStatus_idx`(`publicationStatus`),
    INDEX `Guide_authorId_idx`(`authorId`),
    INDEX `Guide_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Source` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `sourceType` ENUM('OFFICIAL_DOCS', 'UPSTREAM_REPO', 'SPECIFICATION', 'AUDIT_REPORT') NOT NULL DEFAULT 'OFFICIAL_DOCS',
    `reliabilityScore` INTEGER NOT NULL DEFAULT 100,
    `lastAccessedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Source_sourceType_idx`(`sourceType`),
    INDEX `Source_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkGuide` (
    `id` VARCHAR(191) NOT NULL,
    `networkId` VARCHAR(191) NOT NULL,
    `guideId` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NetworkGuide_networkId_idx`(`networkId`),
    INDEX `NetworkGuide_guideId_idx`(`guideId`),
    UNIQUE INDEX `NetworkGuide_networkId_guideId_key`(`networkId`, `guideId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuideSource` (
    `id` VARCHAR(191) NOT NULL,
    `guideId` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GuideSource_guideId_idx`(`guideId`),
    INDEX `GuideSource_sourceId_idx`(`sourceId`),
    UNIQUE INDEX `GuideSource_guideId_sourceId_key`(`guideId`, `sourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkSource` (
    `id` VARCHAR(191) NOT NULL,
    `networkId` VARCHAR(191) NOT NULL,
    `sourceId` VARCHAR(191) NOT NULL,
    `relationship` VARCHAR(191) NULL DEFAULT 'Official Documentation',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NetworkSource_networkId_idx`(`networkId`),
    INDEX `NetworkSource_sourceId_idx`(`sourceId`),
    UNIQUE INDEX `NetworkSource_networkId_sourceId_key`(`networkId`, `sourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('PENDING', 'REVIEWED', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactSubmission_status_idx`(`status`),
    INDEX `ContactSubmission_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_userId_idx`(`userId`),
    INDEX `AuditLog_action_idx`(`action`),
    INDEX `AuditLog_entityType_idx`(`entityType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientSoftware` ADD CONSTRAINT `ClientSoftware_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `Network`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HardwareRequirement` ADD CONSTRAINT `HardwareRequirement_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `Network`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guide` ADD CONSTRAINT `Guide_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Guide` ADD CONSTRAINT `Guide_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkGuide` ADD CONSTRAINT `NetworkGuide_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `Network`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkGuide` ADD CONSTRAINT `NetworkGuide_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuideSource` ADD CONSTRAINT `GuideSource_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `Guide`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuideSource` ADD CONSTRAINT `GuideSource_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkSource` ADD CONSTRAINT `NetworkSource_networkId_fkey` FOREIGN KEY (`networkId`) REFERENCES `Network`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NetworkSource` ADD CONSTRAINT `NetworkSource_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `Source`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
