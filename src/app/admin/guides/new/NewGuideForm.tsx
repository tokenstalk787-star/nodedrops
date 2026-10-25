"use client";

import React, { useState } from "react";
import { createGuideAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Eye, Code2 } from "lucide-react";
import { GuideContentRenderer } from "@/components/guide/GuideContentRenderer";

interface NewGuideFormProps {
  networks: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  sources: { id: string; name: string }[];
}

const DEFAULT_MARKDOWN_TEMPLATE = `# Guide Heading

## Architecture Overview
Provide an architectural diagram or summary of execution and consensus clients.

## Prerequisites
- Hardware: 4 Cores, 16 GB RAM, 1 TB NVMe SSD.
- Operating System: Ubuntu 24.04 LTS.
- Elevated Sudo access.

## Step 1: Install Dependencies
\`\`\`bash
sudo apt update && sudo apt install -y curl ufw
\`\`\`

## Step 2: Configure System Daemon
\`\`\`bash
sudo systemctl daemon-reload
\`\`\`

## Expected Output
\`\`\`text
INFO [Node] Started P2P networking peers=25
\`\`\`

## Troubleshooting
### Sync Latency
If synchronization takes longer than expected, verify open firewall ports.
`;

export function NewGuideForm({ networks, categories, sources }: NewGuideFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(DEFAULT_MARKDOWN_TEMPLATE);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate clean slug
    const generated = val
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createGuideAction(formData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Next.js redirect throws an internal error which shouldn't be caught as an error
        if (err.message.includes("NEXT_REDIRECT")) {
          return;
        }
        setError(err.message);
      } else {
        setError("Failed to create runbook.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Basic metadata */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
          1. General Runbook Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Runbook Title *</label>
            <input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Deploying a Polygon PoS Validator Node"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Slug Identifier *</label>
            <input
              type="text"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="polygon-validator-setup"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-200">Technical Summary *</label>
          <textarea
            name="summary"
            required
            rows={2}
            placeholder="Concise 1-2 sentence description explaining the node role, client pairing, and deployment objective."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Target Network *</label>
            <select
              name="networkId"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm"
            >
              {networks.map((net) => (
                <option key={net.id} value={net.id}>
                  {net.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Node Role Category *</label>
            <select
              name="categoryId"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Upstream Sourced Reference</label>
            <select
              name="sourceId"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs sm:text-sm"
            >
              <option value="">None (Attach Later)</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Difficulty</label>
            <select
              name="difficulty"
              defaultValue="INTERMEDIATE"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs"
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Est. Minutes</label>
            <input
              type="number"
              name="estimatedMinutes"
              defaultValue={35}
              min={5}
              max={300}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Verification Status</label>
            <select
              name="verificationStatus"
              defaultValue="OFFICIAL_DOCS_VERIFIED"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs"
            >
              <option value="OFFICIAL_DOCS_VERIFIED">OFFICIAL_DOCS_VERIFIED</option>
              <option value="SETUP_TESTED">SETUP_TESTED</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Publication Status</label>
            <select
              name="publicationStatus"
              defaultValue="DRAFT"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white text-xs"
            >
              <option value="DRAFT">DRAFT (Hidden)</option>
              <option value="PUBLISHED">PUBLISHED (Live)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Markdown Content with Preview Tab */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            2. Runbook Content (Safe Structured Markdown)
          </h3>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0b101d] border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "edit" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeTab === "preview" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {activeTab === "edit" ? (
          <div className="space-y-2">
            <textarea
              name="content"
              required
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#040711] border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm focus:border-cyan-500 focus:outline-none leading-relaxed"
            />
            <span className="text-[11px] text-slate-500 font-mono">
              Use standard headers (`## Prerequisites`, `## Step 1: ...`, `## Expected Output`, `## Troubleshooting`).
            </span>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#040711] border border-slate-800 min-h-[400px]">
            <GuideContentRenderer content={content} />
          </div>
        )}
      </div>

      {/* Submit Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? "Persisting to MySQL..." : "Save and Deploy Runbook"}
        </Button>
      </div>
    </form>
  );
}
