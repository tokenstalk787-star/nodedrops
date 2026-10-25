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
| **Phase 05** | Network Directory & Detail Pages (/networks, /testnets, /mainnets, /networks/[slug]) | **Completed** | 2026-10-25 |
| **Phase 06** | Guide Directory & Detail Pages (/guides, /guides/[slug], /categories/[slug]) | **Completed** | 2026-10-25 |
| **Phase 07** | Interactive Tools (/tools - RPC Tester, Hardware Calc, Compose Generator) | Pending | Queued next |
| **Phase 08** | Global Search & Discovery Engine | Pending | |
| **Phase 09** | Admin Authentication & CMS | Pending | |
| **Phase 10** | Content Policy, Verification, SEO & Analytics | Pending | |
| **Phase 11** | Production Deployment (Vercel & Managed MySQL) | Pending | |

---

## 2. Implemented Features (Phase 06)

- [x] Connected `/guides` directory to live MySQL database with server-side pagination, search, category, and difficulty filtering.
- [x] Implemented dynamic runbook route `/guides/[slug]` with dynamic metadata, empirical hardware requirements, safe structured markdown parsing, numbered step-by-step layout, dual terminal command blocks (PowerShell vs Bash), elevated sudo and destructive operation warnings, verification outputs, troubleshooting remedies, verified upstream sources, and table of contents.
- [x] Implemented category archive route `/categories/[slug]` displaying published node role guides and other category navigators.
- [x] Built reusable guide components:
  - `GuideCard`: Directory card displaying difficulty badge, verification status, network name, summary snippet, and estimated reading time.
  - `GuideFilters`: Difficulty, network, and category filter bar with active state indicators.
  - `GuideTableOfContents`: Responsive sticky table of contents with anchor links.
  - `GuideStep`: Numbered step section container.
  - `CommandBlock`: Multi-shell syntax block distinguishing Windows PowerShell from Bash with elevated sudo and destructive operation warnings.
  - `CopyCommandButton`: Clipboard copy button with tactile visual confirmation.
  - `PrerequisitesPanel`: Structured deployment prerequisites checklist.
  - `HardwareRequirements`: Empirical CPU, RAM, NVMe baselines with tested/documented indicators.
  - `WarningNotice`: Operational alerts distinguishing testnet from production mainnet risks.
  - `ExpectedOutput`: Terminal output verification block.
  - `TroubleshootingSection`: Common failure modes, symptoms, and documented remedies.
  - `SourceList`: Verified upstream documentation references with reliability scores.
  - `RelatedGuides`: Linked runbooks for the same network or category.
  - `ReviewMetadata`: Verification status, reviewed date, author, time, and last updated timestamp.
  - `GuideContentRenderer`: Safe structured markdown parser without dangerous HTML strings.
- [x] Enforced content verification and draft protections: draft guides (e.g. `ethereum-mainnet-staking-draft`) strictly return null, triggering HTTP 404 for public visitors.

---

## 3. Verified Checks & Results

- `pnpm tsx scripts/test-phase06.ts`: **Passed (18/18 tests passed)**
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 11/11 routes generated)**
- HTTP Live Probes:
  - `/guides`: **HTTP 200 OK**
  - `/guides/ethereum-validator-holesky`: **HTTP 200 OK**
  - `/guides/arbitrum-nitro-docker`: **HTTP 200 OK**
  - `/categories/validator-nodes`: **HTTP 200 OK**
  - `/guides/ethereum-mainnet-staking-draft`: **HTTP 404 Not Found (Draft Protection Verified)**
  - `/categories/non-existent-category`: **HTTP 404 Not Found (404 Handling Verified)**
