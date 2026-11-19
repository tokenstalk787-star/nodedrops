import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { GitBranch, ExternalLink, FileText, ShieldCheck, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GitHub Auto-Publisher — NodeDrops CMS",
  robots: { index: false, follow: false },
};

export default async function GitHubPublisherAdminPage() {
  const session = await requireAdmin();
  const secretConfigured = Boolean(process.env.NODEDROPS_GITHUB_PUBLISH_SECRET && process.env.NODEDROPS_GITHUB_PUBLISH_SECRET.length >= 32);
  const repositoryConfigured = process.env.NODEDROPS_GITHUB_REPOSITORY === "tokenstalk787-star/nodedrops";

  return (
    <AdminShell user={session}>
      <div className="space-y-6 max-w-4xl">
        <header className="pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">GitHub Auto-Publisher</h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Add or edit guide Markdown files in GitHub. Push to main and NodeDrops syncs them into the CMS automatically.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-[#070b16] p-5 space-y-3">
          <h2 className="font-semibold text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" />Deployment configuration</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant={secretConfigured ? "success" : "warning"}>{secretConfigured ? "Webhook secret configured" : "Webhook secret missing"}</Badge>
            <Badge variant={repositoryConfigured ? "success" : "warning"}>{repositoryConfigured ? "Repository allowlist configured" : "Repository allowlist missing"}</Badge>
          </div>
          <p className="text-xs text-slate-400">Set the missing variables in Vercel → Project → Settings → Environment Variables, then redeploy.</p>
          <code className="block rounded-xl bg-slate-900 p-3 text-xs text-cyan-200 whitespace-pre-wrap">NODEDROPS_GITHUB_PUBLISH_SECRET=32+ random characters
NODEDROPS_GITHUB_REPOSITORY=tokenstalk787-star/nodedrops</code>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#070b16] p-5 space-y-4">
          <h2 className="font-semibold text-white">One-time GitHub setup</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Generate a random secret of 32+ characters.</li>
            <li>Add it to Vercel as <code className="text-cyan-300">NODEDROPS_GITHUB_PUBLISH_SECRET</code>.</li>
            <li>Set <code className="text-cyan-300">NODEDROPS_GITHUB_REPOSITORY</code> to <code>tokenstalk787-star/nodedrops</code>.</li>
            <li>In GitHub repository Settings → Secrets and variables → Actions, add <code className="text-cyan-300">NODEDROPS_PUBLISH_SECRET</code> (same secret) and <code className="text-cyan-300">NODEDROPS_PUBLISH_URL</code>.</li>
            <li>Set the URL to the production endpoint below, then redeploy Vercel.</li>
          </ol>
          <code className="block rounded-xl bg-slate-900 p-3 text-xs text-cyan-200 break-all">https://nodedrops.xyz/api/webhooks/github-publish</code>
          <p className="text-xs text-amber-300">Do not expose or commit the shared secret. Requests are authenticated with an HMAC-SHA256 signature.</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#070b16] p-5 space-y-3">
          <h2 className="font-semibold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-400" />Content workflow</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Copy <code>content/guides/_template.md</code> and rename it to a lowercase slug ending in .md.</li>
            <li>Complete the YAML frontmatter and Markdown guide. The slug must match the filename.</li>
            <li>Set <code>published: true</code> for auto-publishing; false imports a CMS draft.</li>
            <li>Commit and push to the <code>main</code> branch. View workflow logs in GitHub Actions.</li>
          </ol>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1" href="https://github.com/tokenstalk787-star/nodedrops/tree/main/content/guides" target="_blank">
              Open guides folder <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1" href="https://github.com/tokenstalk787-star/nodedrops/blob/main/content/guides/_template.md" target="_blank">
              Open template <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1" href="https://github.com/tokenstalk787-star/nodedrops/blob/main/content/guides/README.md" target="_blank">
              Full setup documentation <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#070b16] p-5 space-y-2">
          <h2 className="font-semibold text-white flex items-center gap-2"><Settings className="w-4 h-4 text-amber-400" />Safety / sync behavior</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
            <li>Existing networks are linked but their CMS records are not overwritten.</li>
            <li>Guide updates are synchronized by source file, preventing duplicates.</li>
            <li>Deleting a synced file archives its guide (no permanent deletion).</li>
            <li>Guide slugs that collide with manually-created CMS guides are rejected.</li>
            <li>At least one HTTPS source is required; verification status is kept separate from publication.</li>
            <li>Published guides marked UNDER_REVIEW remain visibly unverified; publication does not claim testing.</li>
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}
