# NodeDrops GitHub Auto-Publisher

NodeDrops guide content is managed as Markdown in this folder. Push a guide file to `main` and the repository's GitHub Actions workflow sends the changed file paths to NodeDrops. The API validates the signed delivery, imports/updates the guide in MySQL, and revalidates public pages.

## Add a guide

1. Copy `_template.md` and name the new file `<slug>.md` (lowercase letters, numbers, and hyphens only).
2. Fill in the YAML frontmatter. The frontmatter `slug` must match the filename.
3. Replace the example network and source URLs. At least one HTTPS source is required.
4. Add the full guide as Markdown after the closing `---`.
5. Set `published: true` to publish on push, or `false` to import as a draft.
6. Commit and push to the `main` branch. Check the Actions tab for the **NodeDrops GitHub Auto-Publisher** run.

### Verification and publishing

- `published: true` publishes the guide automatically, even if `verificationStatus: UNDER_REVIEW`. The verification status is shown honestly; publication is not a claim that the commands were executed.
- Use `SETUP_TESTED` only after actually testing the documented setup and include a `verifiedAt` ISO timestamp.
- Use `OFFICIAL_DOCS_VERIFIED` only after reviewing official docs. Don't invent verification dates.
- `published: false` imports/updates the guide as a draft.
- Editing a synced file updates the existing guide (no duplicate is created).
- Deleting a synced Markdown file archives the guide. It is not permanently deleted.
- A slug conflict with a manually-created CMS guide is rejected rather than overwriting it.

## Supported frontmatter

Required: `title`, `slug`, `summary`, `categorySlug`, `network`, and one or more `sources`.

Enums:
- `difficulty`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`
- `network.networkType`: `MAINNET`, `TESTNET`
- `verificationStatus`: `UNDER_REVIEW`, `OFFICIAL_DOCS_VERIFIED`, `SETUP_TESTED`, `COMMUNITY_REPORTED`
- `sources[].sourceType`: `OFFICIAL_DOCS`, `UPSTREAM_REPO`, `SPECIFICATION`, `AUDIT_REPORT`

Category slugs may be created automatically. Existing networks are linked but their CMS details are not overwritten. New networks are created from frontmatter.

## One-time setup

### Vercel environment variables

Set these for Production (and Preview if desired), then redeploy:

- `NODEDROPS_GITHUB_PUBLISH_SECRET`: a random secret with at least 32 characters.
- `NODEDROPS_GITHUB_REPOSITORY`: `tokenstalk787-star/nodedrops`.

### GitHub repository Actions secrets

In Settings → Secrets and variables → Actions, add:

- `NODEDROPS_PUBLISH_URL`: `https://nodedrops.xyz/api/webhooks/github-publish` (use the actual production domain).
- `NODEDROPS_PUBLISH_SECRET`: the exact same secret value as Vercel.

The workflow uses a SHA-256 HMAC signature. Never commit these secrets. The API rejects unsigned requests and any repository other than the allowlisted repository.

## Troubleshooting

- **HTTP 401:** the secret is missing or differs between GitHub and Vercel.
- **HTTP 503:** the Vercel secret is not configured or is too short.
- **HTTP 422:** check the Action logs for validation details; confirm the filename/slug match and that HTTPS sources exist.
- **Workflow didn't run:** confirm the guide was pushed to `main` and is under `content/guides/`.
