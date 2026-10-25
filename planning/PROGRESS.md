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
| **Phase 09** | Public Pages & Contact (/about, /methodology, /contact, /privacy, /terms) | **Completed** | 2026-10-25 |
| **Phase 10** | SEO, Performance, Accessibility & Analytics (/robots.txt, /sitemap.xml, JSON-LD, GA4) | **Completed** | 2026-10-25 |
| **Phase 11** | End-to-End QA & Comprehensive Testing (All 16 User Journeys Verified) | **Completed** | 2026-10-25 |
| **Phase 12** | Production Deployment & Hosting Readiness | Pending | |

---

## 2. Implemented Features (Phase 11 QA)

- [x] **Full 16 User Journeys Verification**:
  - `scripts/test-phase11-e2e.ts`: Automated E2E verification of all 16 user journeys against live production server and database.
  - Verified: Homepage loading, Testnet discovery, Search filtering, Filter composition, Network specs, Guide runbook rendering, Dual-shell copyable commands, Calculator mathematical algorithms, Invalid contact rejection, Valid contact persistence, Unauthenticated admin 307 redirection, Authorized admin sign-in, Draft guide creation, Public publication toggle, Guide retirement/archival, Nonexistent slug 404 handling.
- [x] **Comprehensive Security & Secret Leakage Audit**:
  - Verified zero credentials or API keys tracked in git.
  - Verified `crypto.scrypt` password hashing + constant-time verification.
  - Verified sliding rate limiter and honeypot bot trap.
  - Verified server action authorization guards (`requireAdminAction`).
- [x] **Accessibility & Reduced Motion Certification**:
  - Keyboard skip-to-content bypass anchor (`#main-content`).
  - `@media (prefers-reduced-motion: reduce)` media query.
  - Semantic HTML landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`).
- [x] **Production Readiness & Artifact Report**:
  - Created exhaustive QA Audit Report: `planning/QA_REPORT_PHASE11.md`.
  - 180 / 180 total automated tests passed across all suites.
  - 0 TypeScript errors, 0 ESLint warnings, production build passed (19/19 routes).

---

## 2. Implemented Features (Phase 10)

- [x] **SEO Metadata & Canonical URLs**:
  - Global `metadataBase: new URL("https://nodedrops.xyz")` in `src/app/layout.tsx`.
  - Canonical URLs (`alternates: { canonical: ... }`) configured across all public pages (`/`, `/networks`, `/testnets`, `/mainnets`, `/networks/[slug]`, `/guides`, `/guides/[slug]`, `/categories/[slug]`, `/tools`, `/about`, `/methodology`, `/contact`, `/privacy`, `/terms`).
  - Search results page configured with `robots: { index: false, follow: true }` to prevent crawl budget waste.
- [x] **Dynamic Robots.txt (`src/app/robots.ts`)**:
  - Allows public pages (`/`).
  - Disallows admin and API paths (`/admin`, `/admin/*`, `/api`, `/api/*`).
  - Links directly to `https://nodedrops.xyz/sitemap.xml`.
- [x] **Dynamic XML Sitemap (`src/app/sitemap.ts`)**:
  - Automatic indexing of core static pages, active networks (`ACTIVE`, `MAINTENANCE`), and categories.
  - Strict publication filter: Only `publicationStatus: PUBLISHED` guides are included. Draft and archived guides are strictly excluded.
  - Dynamically calculates `lastModified`, `changeFrequency`, and `priority`.
- [x] **Structured Data (Schema.org JSON-LD)**:
  - `src/components/seo/JsonLd.tsx`: Reusable script renderer for JSON-LD.
  - `buildWebSiteSchema()`: Injected into root layout with SearchAction for `/search?q={search_term_string}`.
  - `buildBreadcrumbSchema()`: Injected on detail and informational pages.
  - `buildGuideSchema()`: TechArticle metadata with duration, difficulty, and publish dates on runbook pages.
- [x] **Accessibility & Performance Enhancements**:
  - Skip-to-content accessibility bypass anchor (`#main-content`) with keyboard focus ring.
  - `@media (prefers-reduced-motion: reduce)` rule added to `src/app/globals.css` to respect user motion preferences.
  - Strict landmark roles (`<main id="main-content">`, `<header>`, `<footer>`, `<nav aria-label="...">`).
- [x] **Google Analytics 4 & Consent Architecture**:
  - `src/components/analytics/GoogleAnalytics.tsx`: Safe GA4 loader.
  - Anti-fabrication guard: Never loads with empty, invalid, or placeholder IDs (`G-XXXXXXXXXX`).
  - Privacy-preserving defaults: `ad_storage: 'denied'`, `ad_user_data: 'denied'`, `anonymize_ip: true`.
  - Zero PII: Contact form submissions, emails, and sensitive query tokens are never sent to analytics.

---

## 3. Verified Checks & Results

- `pnpm tsx scripts/test-phase10.ts`: **Passed (43/43 tests passed)**
- `pnpm tsx scripts/test-phase09.ts`: **Passed (30/30 tests passed)**
- `pnpm tsx scripts/test-phase08.ts`: **Passed (36/36 tests passed)**
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 19/19 routes generated)**
- Live HTTP Probes:
  - `GET /robots.txt` &rarr; **HTTP 200 OK** (Disallow: `/admin`, `/api`)
  - `GET /sitemap.xml` &rarr; **HTTP 200 OK** (Drafts excluded, published guides included)

---

## 2. Implemented Features (Phase 09)

- [x] **Public Informational & Policy Pages**:
  - `/about`: Complete narrative detailing platform vision, intended audience (solo stakers, devops engineers, researchers), educational non-commercial principles, and tech stack transparency.
  - `/methodology`: Exhaustive explanation of source tiering hierarchy (Tier 1 Canonical, Tier 2 Foundation, Tier 3 Releases), verification status taxonomy (`OFFICIAL_DOCS_VERIFIED`, `SETUP_TESTED`, `COMMUNITY_REPORTED`, `UNDER_REVIEW`), 90-day review cycles, errata workflow, and guide retirement protocol.
  - `/contact`: Dedicated contact portal featuring accessible React 19 `useActionState` form, category dropdown, server-side Zod validation, sliding-window rate limiting, and hidden honeypot bot trap.
  - `/privacy`: Honest, factual documentation matching codebase behavior: zero third-party advertising trackers, essential-only admin session cookies (`nodedrops_admin_session`), safe MySQL contact storage, anonymous aggregated view counters, and deletion request procedures.
  - `/terms`: Clear operational terms disclaiming warranties, detailing hardware wear risks (SSD TBW), non-custodial key safety warnings, validator slashing notices, and calculator capacity planning assumptions.
- [x] **Contact Server Action & Database Persistence**:
  - `src/lib/actions/contact.actions.ts`: Robust server action with Zod schema, IP abuse detection, rate limiting, and safe persistence to `prisma.contactSubmission` with `status: PENDING`.
  - Transparent processing: Success is reported only when the record is physically committed to MySQL; honeypot bot submissions are dropped without database writes.
- [x] **Navigation & Footer Link Integrity**:
  - Cleaned and updated `FOOTER_LINKS` in `src/lib/constants.ts` to link to all live routes (`/about`, `/methodology`, `/contact`, `/privacy`, `/terms`) and tools (`/tools?tab=...`).
  - Added mobile secondary quick navigation buttons in `MobileNavigation.tsx`.

---

## 3. Verified Checks & Results

- `pnpm tsx scripts/test-phase09.ts`: **Passed (30/30 tests passed)**
- `pnpm tsx scripts/test-phase08.ts`: **Passed (36/36 tests passed)**
- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 17/17 routes generated)**
- Live HTTP Probes on Production Server:
  - `GET /about` &rarr; **HTTP 200 OK**
  - `GET /methodology` &rarr; **HTTP 200 OK**
  - `GET /contact` &rarr; **HTTP 200 OK**
  - `GET /privacy` &rarr; **HTTP 200 OK**
  - `GET /terms` &rarr; **HTTP 200 OK**

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
