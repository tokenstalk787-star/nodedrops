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
| **Phase 08** | Secure Admin CMS & Authentication (/admin, /admin/login, /admin/networks, /admin/guides, /admin/categories, /admin/sources, /admin/reviews) | **Completed** | 2026-10-25 |
| **Phase 09** | Content Policy, Verification, SEO & Analytics | Pending | |
| **Phase 10** | Production Deployment (Vercel & Managed MySQL) | Pending | |

---

## 2. Implemented Features (Phase 08)

- [x] **Secure Authentication System**:
  - `src/lib/auth/password.ts`: Node.js native `crypto.scrypt` password hashing with 16-byte random salt and `timingSafeEqual` constant-time verification.
  - `src/lib/auth/rateLimit.ts`: In-memory sliding rate limiter enforcing a 5-attempt limit with 15-minute lockout and IP/email keys.
  - `src/lib/auth/session.ts`: HMAC-SHA256 session token signer/verifier, `createAdminSession()`, `getSession()`, `requireAdmin()` (redirects to `/admin/login`), `requireAdminAction()` (server mutation guard), and `logoutAdmin()`.
  - `scripts/provision-admin.ts`: CLI provisioning script creating/updating administrative credentials with cryptographically hashed passwords.
- [x] **Admin CMS Portal & Shell**:
  - `/admin/login`: Dark Web3 login portal with rate-limit lockouts, form validation, and open-redirect protection.
  - `/admin`: Real-time operational dashboard with database counts (networks, guides, drafts, sources, audits) and quick actions.
  - `/admin/networks`: Network directory CMS with live status toggling (`ACTIVE`, `MAINTENANCE`, `DEPRECATED`) and creation modal.
  - `/admin/guides`: Full runbook inventory with publication status controls (`PUBLISHED`, `DRAFT`, `ARCHIVED`) and draft preview buttons.
  - `/admin/guides/new`: Rich runbook authoring form with dual-shell command blocks, live Markdown preview tab, and category/source linking.
  - `/admin/categories`: Node role category manager.
  - `/admin/sources`: Upstream documentation source manager with reliability scoring.
  - `/admin/reviews`: Quality verification queue with overdue indicators (>90 days) and contact submissions manager.
- [x] **Audit Trail System**:
  - `src/lib/repositories/audit.repository.ts`: Immutable MySQL `AuditLog` logging every status change, creation, and publication mutation.
- [x] **Draft Preview System**:
  - `/guides/[slug]?preview=true`: Authenticated preview mode allowing admins to inspect draft guides before publication, with prominent warning banner. Unauthenticated public requests to drafts strictly return HTTP 404.

---

## 3. Verified Checks & Results

- `pnpm tsx scripts/test-phase08.ts`: **Passed (36/36 tests passed)**
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, all static & dynamic routes compiled)**
- HTTP Live Probes:
  - `/admin/login`: **HTTP 200 OK**
  - `/admin` (unauthenticated): **HTTP 307 Redirect to /admin/login**
  - `/admin/guides` (unauthenticated): **HTTP 307 Redirect to /admin/login**
  - `/guides/ethereum-mainnet-staking-draft` (unauthenticated): **HTTP 404 Not Found**
  - `/guides/arbitrum-nitro-docker`: **HTTP 200 OK**

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
