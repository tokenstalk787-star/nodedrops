# NodeDrops.xyz — Known Issues & Mitigations

**Last Audit:** 2026-10-25 (Post-Phase 03)

---

## 1. Active Issues
*None. All components, type definitions, route handlers, and build steps pass with 0 errors and 0 warnings.*

---

## 2. Resolved Issues

### Issue 1: Windows NTFS Casing Inconsistency
- **Symptom:** Webpack build warning regarding multiple modules differing only in casing (`D:\NodeDrops` vs `D:\nodedrops`), causing React to be loaded twice and throwing `Cannot read properties of null (reading 'useContext')` during static prerendering.
- **Resolution:** Re-aligned all configuration files and shell working directories to the canonical path `D:\nodedrops`.

### Issue 2: pnpm v11 Build Script Approvals
- **Symptom:** `pnpm install` halted with `[ERR_PNPM_IGNORED_BUILDS]` for `@prisma/client`, `@prisma/engines`, and `prisma`.
- **Resolution:** Configured `allowBuilds` in `pnpm-workspace.yaml`.

### Issue 3: TypeScript Union Mismatch in Temporary Ecosystem Data
- **Symptom:** Type error `TS2322: Type '"purple"' is not assignable to type '"cyan" | "blue" | "violet" | "info" | "neutral" | "success" | "warning"'` in `src/data/mock-homepage.ts`.
- **Resolution:** Updated `Ecosystem` color property union to include `"purple"`, restoring strict TypeScript compliance.
