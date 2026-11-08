# NodeDrops Research Agent Draft API

## Endpoint
- Method: POST
- Path: /api/admin/agent/guides
- Authentication: Authorization: Bearer <NODEDROPS_AGENT_API_KEY>
- Content type: application/json
- Maximum request size: 1 MB

## Vercel setup
1. Generate a key locally: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
2. Open the NodeDrops project in Vercel → Settings → Environment Variables.
3. Add NODEDROPS_AGENT_API_KEY for Production. Add Preview only if preview deployments should accept test submissions.
4. Redeploy after saving.
5. Store the same key in the automation platform's encrypted secret store. Never put it in prompts, browser code, source control, or chat.

## Request body
{
  "title": "Run a Sample Network Full Node",
  "slug": "sample-network-full-node",
  "summary": "A practical guide to running a full node for the Sample Network.",
  "content": "# Sample Network Full Node\n\n## Prerequisites\n...",
  "difficulty": "INTERMEDIATE",
  "estimatedMinutes": 45,
  "categorySlug": "full-nodes",
  "network": {
    "name": "Sample Network",
    "slug": "sample-network",
    "symbol": "SAMPLE",
    "networkType": "TESTNET",
    "category": "Layer 1",
    "layer": "Layer 1",
    "consensus": "Proof-of-Stake",
    "websiteUrl": "https://sample.example",
    "docsUrl": "https://docs.sample.example"
  },
  "sources": [
    {
      "name": "Sample Network Node Documentation",
      "url": "https://docs.sample.example/nodes",
      "sourceType": "OFFICIAL_DOCS",
      "notes": "Official node operator instructions"
    }
  ]
}

Valid values:
- difficulty: BEGINNER, INTERMEDIATE, ADVANCED
- network.networkType: MAINNET, TESTNET
- sources[].sourceType: OFFICIAL_DOCS, UPSTREAM_REPO, SPECIFICATION, AUDIT_REPORT
- categorySlug must already exist in Admin → Categories
- All supplied URLs must use HTTPS

## Safety guarantees
- Missing or invalid API key returns 401. The key must be at least 32 characters.
- Bearer token comparison uses constant-time digest comparison.
- Payloads are Zod-validated and limited to 1 MB.
- Publication status is always forced to DRAFT.
- Verification status is always forced to UNDER_REVIEW and verifiedAt is null.
- The agent cannot set publication or verification status in its request.
- Existing network records are linked but never overwritten.
- Duplicate guide slugs are rejected with 409.
- Guide, network/source relationships, and audit log are written in one database transaction.
- There is no publish or delete operation on this endpoint.

## Responses
- 201: draft created, with guide ID and Admin URL
- 401: missing or invalid Bearer token
- 409: duplicate guide slug or network identifier conflict
- 413: body too large
- 422: invalid payload or unknown category
- 500: unexpected server-side failure

## Test after deployment
Set the key in a local environment variable rather than typing it directly into a shared command history, then call:

curl -X POST "https://nodedrops.xyz/api/admin/agent/guides" \
  -H "Authorization: Bearer $NODEDROPS_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @guide-draft.json

After a 201 response, open https://nodedrops.xyz/admin/guides and confirm the guide is DRAFT and UNDER_REVIEW. Review all commands, official sources, hardware requirements, and reward claims before manually publishing.
