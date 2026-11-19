ALTER TABLE `Guide`
  ADD COLUMN `githubRepository` VARCHAR(191) NULL,
  ADD COLUMN `githubPath` VARCHAR(191) NULL,
  ADD COLUMN `githubCommit` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `Guide_githubRepository_githubPath_key`
  ON `Guide`(`githubRepository`, `githubPath`);
