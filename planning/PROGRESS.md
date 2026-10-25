# NodeDrops.xyz — Project Progress Tracker

Last Updated: 2026-10-25

---

## 1. Milestone & Phase Checklist

| Phase | Milestone Description | Status | Verification Date |
| :--- | :--- | :---: | :---: |
| **Phase 00–01** | Environment, Foundation & Clean Scaffold | **Completed** | 2026-10-25 |
| **Phase 02** | Design Tokens, Theming & Reusable Components | **Completed** | 2026-10-25 |
| **Phase 03** | NodeDrops Homepage & Destination Routing | **Completed** | 2026-10-25 |
| **Phase 04** | Database Architecture (Prisma, MySQL, Schema & Seed) | **Completed** | 2026-10-25 |
| **Phase 05** | Public Directories (/testnets, /mainnets, /networks, /guides) | Pending | Queued next |
| **Phase 06** | Detail Pages (/networks/[slug], /guides/[slug], /categories/[slug]) | Pending | |
| **Phase 07** | Interactive Tools (/tools - RPC Tester, Hardware Calc) | Pending | |
| **Phase 08** | Global Search & Discovery Engine | Pending | |
| **Phase 09** | Admin Authentication & CMS | Pending | |
| **Phase 10** | Content Policy, Verification, SEO & Analytics | Pending | |
| **Phase 11** | Production Deployment (Vercel & Managed MySQL) | Pending | |

---

## 2. Implemented Features (Phase 04)

- [x] Local MySQL 8.0 instance inspected and connected on port 3306 (`nodedrops` database).
- [x] Prisma 6.19.3 configured with MySQL provider and schema engine.
- [x] Normalized relational database schema in `prisma/schema.prisma` with 12 application models and enums:
  - `User` & `Role` (Admin/Editor/Viewer)
  - `Category` (Full Nodes, Validator Nodes, Archive Nodes, RPC Nodes, Sequencers)
  - `Network` (EVM, Non-EVM, Layer 1, Layer 2, status, hardware specs)
  - `ClientSoftware` (Execution/Consensus/Combined/Sequencer software)
  - `HardwareRequirement` (Empirical CPU, RAM, NVMe storage, and network profiles)
  - `Guide` (Runbooks with difficulty, verification status, and publication status)
  - `Source` (Official upstream documentation and client repo references)
  - Junction tables: `NetworkGuide`, `GuideSource`, `NetworkSource`
  - Utility tables: `ContactSubmission`, `AuditLog`
- [x] Unique constraints, foreign keys, cascade/restrict deletion rules, and query indexes.
- [x] Environment variable parsing and validation with Zod (`src/lib/env.ts`).
- [x] Prisma client singleton pattern (`src/lib/prisma.ts`).
- [x] Database health check function (`src/lib/db-check.ts`).
- [x] Idempotent seed script (`prisma/seed.ts`) populating verified networks, clients, hardware, sources, and guides without false "Setup Tested" marks.
- [x] Database repository modules in `src/lib/repositories/` (`network`, `guide`, `category`, `submission`, `audit`).
- [x] Comprehensive database integration test suite (`scripts/test-db.ts`) verifying connectivity, relational queries, invalid data rejection, and submission write operations.

---

## 3. Verified Checks & Results

- `pnpm prisma validate`: **Passed (Schema valid)**
- `pnpm prisma migrate dev` / `db push`: **Passed (12 tables created in MySQL `nodedrops`)**
- `pnpm prisma db seed`: **Passed (Idempotency verified across multiple executions)**
- `npx tsx scripts/test-db.ts`: **Passed (5/5 tests passed)**:
  - 1. Connection Health: ✅ PASS (`{"networks":5,"guides":2,"categories":5,"sources":6,"users":1}`)
  - 2. Read Networks & Relations: ✅ PASS (Ethereum clients & hardware profiles queried)
  - 3. Read Guides & Relations: ✅ PASS (Guides with sources linked)
  - 4. Invalid Data Rejection: ✅ PASS (Duplicate slug rejected by MySQL unique index)
  - 5. Contact Submission Write & Cleanup: ✅ PASS
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 11/11 static/dynamic pages compiled)**
