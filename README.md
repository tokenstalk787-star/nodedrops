# NodeDrops.xyz

NodeDrops is an independent discovery directory for blockchain testnets, node-operator programs, and developer opportunities. Listings link to project sources and distinguish confirmed incentives from potential incentives and cases where no incentive has been announced.

> **Important:** NodeDrops does not guarantee airdrops, tokens, NFTs, ETH, USDT, eligibility, or profit. Always verify the project's official requirements before connecting a wallet, running software, or paying for infrastructure.

## Current stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Prisma ORM 6 with a MySQL-compatible database (TiDB Cloud supported)
- Vercel deployment
- pnpm package manager

## Local setup

Requirements: a supported Node.js LTS release, pnpm, and access to a MySQL-compatible database.

1. Clone the repository and enter the project directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a local `.env` file. Never commit this file or share its contents. Configure:
   ```env
   DATABASE_URL="your-mysql-compatible-connection-string"
   ADMIN_API_KEY="replace-with-a-random-secret-at-least-32-characters-long"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
   Use the connection-string format required by your database provider. Keep credentials private.
4. Generate Prisma Client:
   ```bash
   pnpm exec prisma generate
   ```
5. Apply the existing Prisma migrations to the intended database:
   ```bash
   pnpm exec prisma migrate deploy
   ```
6. Seed the configured database with the current curated records:
   ```bash
   pnpm exec tsx prisma/seed.ts
   ```
   The seed script is run directly with `tsx` (it does not depend on Prisma's optional seed-command configuration). It upserts records by slug, so rerunning it updates those records rather than creating duplicates. It also inserts clearly marked demo records for development; demo records are excluded from public directory/API results.
7. Start the development server:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000.

**Before running database commands**, verify that `DATABASE_URL` points to the database you intend to modify. Never paste database URLs, passwords, API keys, or `.env` contents into issues or chat.

## Useful commands

```bash
pnpm db:generate
pnpm db:validate
pnpm db:migrate:deploy
pnpm db:seed
pnpm typecheck
pnpm lint
pnpm build
pnpm smoke
```

The smoke test expects the app to be running locally at `http://localhost:3000`. To smoke-test the deployed site from PowerShell instead:

```powershell
$env:SITE_URL = "https://nodedrops.xyz"
pnpm smoke
Remove-Item Env:SITE_URL
```

The smoke test is read-only. It checks health/database connectivity, directory and detail routes, API response shapes, invalid/missing slugs, sitemap output, and production demo-data protection.

If the project has not yet been migrated in the target environment, run `pnpm exec prisma migrate deploy` before seeding. Do not run destructive reset commands against a production database.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string used by Prisma |
| `ADMIN_API_KEY` | Secret bearer token for authorized opportunity writes |
| `NEXT_PUBLIC_SITE_URL` | Canonical website origin used by metadata and sitemap |

Set production values in the Vercel project's Environment Variables settings. Do not add secrets to source code or any `NEXT_PUBLIC_*` variable.

## Opportunity data and verification

Each public listing should include a meaningful summary, current status, incentive classification, and official project link where available. Source URLs and verification notes should describe what the evidence actually supports. A verification date is not a guarantee that a program remains open.

- **Confirmed incentive:** evidence supports an incentive announcement; it does not guarantee an individual reward.
- **Potential incentive:** the available evidence is insufficient to promise a reward.
- **Not announced:** no confirmed incentive announcement is recorded.
- **Demo data:** test-only records are not public listings.

Never label an incentive confirmed based only on speculation, social rumors, or an unsupported token-price estimate.

Before publishing or changing an opportunity, follow the [Opportunity Listing Review Checklist](docs/OPPORTUNITY_REVIEW_CHECKLIST.md) so source evidence, incentive labels, costs, and uncertainty are recorded consistently.

## API overview

- `GET /api/health` — service/database health check.
- `GET /api/opportunities` — public opportunity directory with filtering and pagination.
- `GET /api/opportunities/:slug` — one public listing.
- `POST /api/opportunities` — protected listing creation endpoint; requires an `Authorization: Bearer <ADMIN_API_KEY>` header.

Public reads must not expose demo records. Write access should remain disabled when `ADMIN_API_KEY` is missing or shorter than the minimum required length. Keep the key server-side and never send it to browser code.

## Deployment

1. Connect this repository to Vercel.
2. Configure `DATABASE_URL`, `ADMIN_API_KEY`, and `NEXT_PUBLIC_SITE_URL=https://nodedrops.xyz` for the intended environments.
3. Confirm the production database schema is up to date and seed only after checking the target database.
4. Deploy the intended commit and wait for the Vercel deployment state to become **Ready**.
5. Smoke-test the homepage, directory, one opportunity detail page, `/api/health`, `/api/opportunities`, and `/sitemap.xml`.
6. Verify that an unknown slug returns a 404 and that demo slugs are not exposed publicly.

## Security and responsible use

- Never request or store seed phrases or private keys.
- Treat all project links as external destinations and independently check domains.
- Do not promise rewards or profitability.
- Protect administrative writes with a strong server-side secret.
- Keep environment files and credentials out of Git.
- Recheck time-sensitive listings before acting on them.

## License

No license is declared yet. Unless a license is added to this repository, do not assume the code is available for unrestricted reuse.
