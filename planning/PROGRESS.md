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
| **Phase 07** | Search & Node Tools (/search, /tools - 5 Deterministic Calculators) | **Completed** | 2026-10-25 |
| **Phase 08** | Global Search & Discovery Polish | Pending | Integrated with Phase 07, queued next |
| **Phase 09** | Admin Authentication & CMS | Pending | |
| **Phase 10** | Content Policy, Verification, SEO & Analytics | Pending | |
| **Phase 11** | Production Deployment (Vercel & Managed MySQL) | Pending | |

---

## 2. Implemented Features (Phase 07)

- [x] Connected `/search` global discovery page querying real MySQL records across active networks, published guides, and node categories.
- [x] Created `src/lib/repositories/search.repository.ts` with sanitized parameterization, group counts, and pagination.
- [x] Built search components:
  - `SearchInput`: Debounced input with clear button and interactive popular search chips.
  - `SearchFilters`: Filter tabs (All Results, Networks, Guides, Categories) with item counts.
  - `SearchResultGroup`: Grouped layout rendering `NetworkCard`, `GuideCard`, and category explorer cards.
  - `UrlPagination`: Client-side URL-driven pagination component eliminating function passing across RSC boundary.
- [x] Built 5 deterministic node tools at `/tools`:
  1. `HardwareChecklistTool`: Evaluates target machine specs against documented network requirements (Ethereum, Arbitrum, Base, Solana, Holesky).
  2. `StorageCalculatorTool`: Models linear blockchain state growth, OS buffers, pruning cycles, and 20% SSD provisioning headroom.
  3. `BandwidthCalculatorTool`: Computes sustained and peak burst throughput (Mbps) and monthly data transfer (GB/TB) with ISP cap warnings.
  4. `OperatingCostCalculatorTool`: Compares self-hosted Home Lab CapEx vs Cloud VPS OpEx, electricity tariffs, and 3-year TCO break-even timeline.
  5. `DeploymentChecklistTool`: Pre-flight operational readiness checklist with progress meter, filter by category, and "Copy as Markdown" feature.
  6. `FormulaCard`: Visual breakdown of mathematical formulas, variable definitions, and assumptions for every calculator.
  7. `DisclaimerNotice`: Capacity planning disclaimer for all estimation tools.
- [x] Connected homepage search to direct queries to `/search?q=...`.

---

## 3. Verified Checks & Results

- `pnpm tsx scripts/test-phase07.ts`: **Passed (26/26 tests passed)**
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 12/12 routes generated)**
- HTTP Live Probes:
  - `/search`: **HTTP 200 OK**
  - `/search?q=Ethereum`: **HTTP 200 OK**
  - `/search?q=Solana&type=networks`: **HTTP 200 OK**
  - `/search?q=xyz-nonexistent`: **HTTP 200 OK**
  - `/tools`: **HTTP 200 OK**
  - `/tools?tab=storage`: **HTTP 200 OK**
  - `/tools?tab=bandwidth`: **HTTP 200 OK**
  - `/tools?tab=cost`: **HTTP 200 OK**
  - `/tools?tab=deployment`: **HTTP 200 OK**
  - `/guides`: **HTTP 200 OK**
