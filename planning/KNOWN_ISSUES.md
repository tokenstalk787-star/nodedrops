# NodeDrops.xyz — Known Issues & Mitigations

**Last Audit:** 2026-10-25

---

## 1. Active Issues
*None. All components, type definitions, and build steps are clean and passing.*

---

## 2. Resolved Issues

### Issue 1: Windows NTFS Casing Inconsistency
- **Symptom:** Webpack build warning regarding multiple modules differing only in casing (`D:\NodeDrops` vs `D:\nodedrops`), causing React to be loaded twice and throwing `Cannot read properties of null (reading 'useContext')` during static prerendering.
- **Root Cause:** Drive D folder was originally initialized with lowercase `nodedrops` on the NTFS filesystem, while shell commands were referencing `D:\NodeDrops`.
- **Resolution:** Re-aligned all configuration files and shell working directories to the canonical path `D:\nodedrops`.

### Issue 2: pnpm v11 Build Script Approvals
- **Symptom:** `pnpm install` halted with `[ERR_PNPM_IGNORED_BUILDS]` for `@prisma/client`, `@prisma/engines`, and `prisma`.
- **Resolution:** Configured `allowBuilds` in `pnpm-workspace.yaml`.

### Issue 3: ESLint Unused Variable in Design System Page
- **Symptom:** ESLint flagged warning `'Skeleton' is defined but never used`.
- **Resolution:** Updated `src/app/design-system/page.tsx` to render raw `Skeleton` primitive variants (text, circular, rectangular) alongside composite card and table skeletons, verifying 0 warnings.
