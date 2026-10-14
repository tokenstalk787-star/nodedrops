
# NodeDrops Production Launch Checklist

## Application and build
- [ ] `pnpm exec prisma validate`
- [ ] `pnpm exec tsc --noEmit`
- [ ] `pnpm build`
- [ ] Run the production build locally and test the important pages.
- [ ] Confirm that the homepage and directory load without errors.

## Database
- [ ] Create a production MySQL database.
- [ ] Configure the production DATABASE_URL privately.
- [ ] Apply committed Prisma migrations to production.
- [ ] Verify that the production database has the expected schema.
- [ ] Confirm `/api/health` returns HTTP 200 when the database is available.

## API and security
- [ ] Confirm public GET requests do not expose demo records.
- [ ] Confirm the single-opportunity API returns 404 for missing slugs.
- [ ] Confirm admin POST rejects missing or incorrect credentials.
- [ ] Confirm duplicate slugs return HTTP 409.
- [ ] Confirm invalid input returns HTTP 400.
- [ ] Never commit `.env` or production credentials.
- [ ] Review dependencies and resolve important security advisories.

## Content quality
- [ ] Remove test listings and unsupported reward claims.
- [ ] Verify official links and evidence for every published opportunity.
- [ ] Check incentive labels, costs, difficulty, and program status.
- [ ] Review privacy and terms pages against the actual site's behavior.
- [ ] Add a real contact method before publishing legal/contact claims.

## SEO and usability
- [ ] Verify canonical URLs, sitemap, robots.txt, and social preview.
- [ ] Test navigation, search, filters, and detail pages.
- [ ] Test mobile layouts and keyboard accessibility.
- [ ] Check 404 and error pages.
- [ ] Confirm the deployed domain uses HTTPS.

## After launch
- [ ] Check hosting logs and database connectivity.
- [ ] Monitor API errors and failed requests.
- [ ] Back up the database and document restoration steps.
- [ ] Re-verify listings regularly.
- [ ] Keep an eye on hosting usage, database limits, and unexpected costs.
