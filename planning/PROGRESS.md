# NodeDrops.xyz — Project Progress Tracker

Last Updated: 2026-10-25

---

## 1. Milestone & Phase Checklist

| Phase | Milestone Description | Status | Verification Date |
| :--- | :--- | :---: | :---: |
| **Phase 00–01** | Environment, Foundation & Clean Scaffold | **Completed** | 2026-10-25 |
| **Phase 02** | Design Tokens, Theming & Reusable Components | **Completed** | 2026-10-25 |
| **Phase 03** | NodeDrops Homepage & Destination Routing | **Completed** | 2026-10-25 |
| **Phase 04** | Database Architecture (Prisma, MySQL, Schema & Seed) | Pending | |
| **Phase 05** | Public Directories (/testnets, /mainnets, /networks, /guides) | Pending | |
| **Phase 06** | Detail Pages (/networks/[slug], /guides/[slug], /categories/[slug]) | Pending | |
| **Phase 07** | Interactive Tools (/tools - RPC Tester, Hardware Calc) | Pending | |
| **Phase 08** | Global Search & Discovery Engine | Pending | |
| **Phase 09** | Admin Authentication & CMS | Pending | |
| **Phase 10** | Content Policy, Verification, SEO & Analytics | Pending | |
| **Phase 11** | Production Deployment (Vercel & Managed MySQL) | Pending | |

---

## 2. Implemented Features (Phase 03)

- [x] Complete server-rendered Homepage at `src/app/page.tsx` featuring all 12 required sections:
  1. Header & primary navigation (`SiteHeader`).
  2. Hero title: *"Your Guide to Running Blockchain Nodes"*.
  3. Supporting explanation of node research and educational runbooks.
  4. Prominent global search input (`HomeSearch`) with `⌘K` / `Ctrl+K` shortcut.
  5. Working primary actions: *Explore Testnets*, *Explore Mainnets*, and *Browse Runbooks*.
  6. Ecosystem browsing matrix (Ethereum, Arbitrum, Optimism, Base, Solana, Polygon).
  7. Featured networks with real hardware profiles (CPU, RAM, NVMe).
  8. Latest deployment guides with difficulty, estimated time, and verification date.
  9. Node-type classification taxonomy cards (Full, Validator, Archive, RPC, Sequencer).
  10. Content verification methodology section (4 research pillars).
  11. Final call-to-action banner with dual CTA buttons.
  12. SiteFooter with multi-column ecosystem links and security notice.
- [x] Strongly-typed temporary dataset module at `src/data/mock-homepage.ts`.
- [x] Interactive hero search component at `src/components/home/HomeSearch.tsx`.
- [x] Destination routes created to prevent dead links:
  - `/networks` (with query filtering)
  - `/testnets`
  - `/mainnets`
  - `/guides`
  - `/tools`

---

## 3. Temporary Data Sources Documented (To be Replaced in Phase 04–06)

1. `ECOSYSTEMS_DATA` (`src/data/mock-homepage.ts`): Will be replaced by `prisma.ecosystem.findMany()` in Phase 04–05.
2. `FEATURED_NETWORKS` (`src/data/mock-homepage.ts`): Will be replaced by `prisma.network.findMany({ include: { hardwareRequirements: true, clients: true } })` in Phase 04–05.
3. `LATEST_GUIDES` (`src/data/mock-homepage.ts`): Will be replaced by `prisma.guide.findMany({ orderBy: { verifiedAt: 'desc' } })` in Phase 04–05.
4. `NODE_TYPES_DATA` (`src/data/mock-homepage.ts`): Will be replaced by `prisma.nodeType.findMany()` in Phase 04–05.

---

## 4. Verified Checks & Results

- `pnpm type-check` (`tsc --noEmit`): **Passed (0 errors)**
- `pnpm lint` (`next lint`): **Passed (0 errors, 0 warnings)**
- `pnpm build` (`next build`): **Passed (Exit code 0, 11/11 static/dynamic pages compiled)**
- Route Probes (`Invoke-WebRequest`):
  - `/`: **HTTP 200 OK (186,161 bytes)**
  - `/networks`: **HTTP 200 OK (66,356 bytes)**
  - `/testnets`: **HTTP 200 OK (45,917 bytes)**
  - `/mainnets`: **HTTP 200 OK (56,459 bytes)**
  - `/guides`: **HTTP 200 OK (60,218 bytes)**
  - `/tools`: **HTTP 200 OK (49,060 bytes)**
  - `/design-system`: **HTTP 200 OK (77,759 bytes)**
  - `/networks?q=Ethereum`: **HTTP 200 OK (42,880 bytes)**
