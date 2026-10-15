"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
type Opportunity = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  category: string;
  network: string | null;
  status: "UPCOMING" | "ACTIVE" | "PAUSED" | "ENDED";
  incentiveStatus: "CONFIRMED" | "POTENTIAL" | "NOT_ANNOUNCED";
  difficulty: string | null;
  estimatedCostUsd: string | number | null;
  officialUrl: string | null;
  logoUrl: string | null;
  sourceUrl: string | null;
  verificationNotes: string | null;
  lastVerifiedAt: string | null;
  isDemo?: boolean;
  updatedAt: string;
};

const initialForm = {
  name: "",
  slug: "",
  summary: "",
  category: "Testnet",
  network: "",
  status: "UPCOMING",
  incentiveStatus: "NOT_ANNOUNCED",
  difficulty: "Beginner",
  estimatedCostUsd: "",
  officialUrl: "",
  logoUrl: "",
  sourceUrl: "",
  verificationNotes: "",
  lastVerifiedAt: "",
};

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[#0b110d] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[#a5f3a8] focus:ring-2 focus:ring-[#a5f3a8]/15";
const labelClass = "block text-sm font-medium text-[var(--foreground)]";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);
}

function displayStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export function AdminPanel() {
  const [apiKey, setApiKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/opportunities?limit=50", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not load opportunities.");
      setItems(payload.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load opportunities.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (unlocked) void loadItems();
  }, [unlocked, loadItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => [item.name, item.slug, item.category, item.network ?? ""].some((value) => value.toLowerCase().includes(query)));
  }, [items, search]);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.status === "ACTIVE").length,
    confirmed: items.filter((item) => item.incentiveStatus === "CONFIRMED").length,
    needsReview: items.filter((item) => !item.lastVerifiedAt).length,
  }), [items]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (apiKey.trim().length < 32) {
      setError("ADMIN_API_KEY kam az kam 32 characters ka hona chahiye.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        estimatedCostUsd: form.estimatedCostUsd === "" ? null : Number(form.estimatedCostUsd),
        network: form.network || null,
        difficulty: form.difficulty || null,
        officialUrl: form.officialUrl || null,
        logoUrl: form.logoUrl || null,
        sourceUrl: form.sourceUrl || null,
        verificationNotes: form.verificationNotes || null,
        lastVerifiedAt: form.lastVerifiedAt ? new Date(form.lastVerifiedAt).toISOString() : null,
      };
      const response = await fetch(editingSlug ? `/api/admin/opportunities/${encodeURIComponent(editingSlug)}` : "/api/opportunities", {
        method: editingSlug ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Opportunity create nahi hui.");
      setNotice(`“${payload.data?.name ?? form.name}” ${editingSlug ? "update" : "add"} ho gayi.`);
      setForm(initialForm);
      setEditingSlug(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opportunity create nahi hui.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: Opportunity) {
    setEditingSlug(item.slug);
    setForm({
      name: item.name,
      slug: item.slug,
      summary: item.summary,
      category: item.category,
      network: item.network ?? "",
      status: item.status,
      incentiveStatus: item.incentiveStatus,
      difficulty: item.difficulty ?? "",
      estimatedCostUsd: item.estimatedCostUsd == null ? "" : String(item.estimatedCostUsd),
      officialUrl: item.officialUrl ?? "",
      logoUrl: item.logoUrl ?? "",
      sourceUrl: item.sourceUrl ?? "",
      verificationNotes: item.verificationNotes ?? "",
      lastVerifiedAt: item.lastVerifiedAt ? new Date(item.lastVerifiedAt).toISOString().slice(0, 10) : "",
    });
    setError("");
    setNotice(`Editing ${item.name}. Save changes when finished.`);
  }

  async function handleDelete(item: Opportunity) {
    if (!window.confirm(`Delete “${item.name}”? This cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/opportunities/${encodeURIComponent(item.slug)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Opportunity delete nahi hui.");
      }
      if (editingSlug === item.slug) {
        setEditingSlug(null);
        setForm(initialForm);
      }
      setNotice(`“${item.name}” delete ho gayi.`);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opportunity delete nahi hui.");
    }
  }

  function signOut() {
    setApiKey("");
    setEditingSlug(null);
    setForm(initialForm);
    setUnlocked(false);
    setItems([]);
    setNotice("");
    setError("");
  }

  return (
    <main className="container py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border)] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow">Private workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Admin console</h1><p className="muted mt-2 max-w-2xl text-sm leading-6">Manage NodeDrops opportunity records and keep verification evidence transparent.</p></div>
        {unlocked && <button onClick={signOut} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface-hover)]">Lock admin</button>}
      </div>

      {!unlocked ? (
        <section className="panel mx-auto max-w-xl p-6 sm:p-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[#17211b] text-[#a5f3a8]"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v3"/></svg></div>
          <h2 className="text-xl font-semibold">Unlock admin tools</h2>
          <p className="muted mt-2 text-sm leading-6">Enter your server-side <code>ADMIN_API_KEY</code>. It stays in this page’s memory only and is cleared when you lock the console or leave the page.</p>
          <form className="mt-6" onSubmit={(event) => { event.preventDefault(); setError(""); if (apiKey.trim().length < 32) { setError("Key must contain at least 32 characters."); return; } void (async () => { try { const response = await fetch("/api/admin/verify", { method: "POST", headers: { Authorization: `Bearer ${apiKey.trim()}` }, cache: "no-store" }); const payload = await response.json(); if (!response.ok) throw new Error(payload.error ?? "Invalid admin key."); setUnlocked(true); } catch (err) { setError(err instanceof Error ? err.message : "Admin verification failed."); } })(); }}>
            <label className={labelClass} htmlFor="admin-key">Admin API key</label>
            <input id="admin-key" className={inputClass} type="password" autoComplete="current-password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Paste your server environment key" required minLength={32} />
            <p className="muted mt-2 text-xs">Do not share this key or commit it to GitHub. If it has leaked, rotate it in Vercel environment variables.</p>
            {error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}
            <button className="mt-5 w-full rounded-xl bg-[#a5f3a8] px-4 py-3 font-semibold text-[#0a130b] transition hover:bg-[#c1fac3]" type="submit">Unlock console <span aria-hidden="true">→</span></button>
          </form>
        </section>
      ) : (
        <>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[{ label: "Loaded records", value: stats.total, detail: "Up to 50 public records" }, { label: "Active", value: stats.active, detail: "Currently marked active" }, { label: "Confirmed incentives", value: stats.confirmed, detail: "Evidence should be present" }, { label: "Needs verification", value: stats.needsReview, detail: "No verification date recorded" }].map((stat) => <div className="panel p-5" key={stat.label}><p className="muted text-sm">{stat.label}</p><p className="mt-3 text-3xl font-semibold tabular-nums">{stat.value}</p><p className="muted mt-2 text-xs">{stat.detail}</p></div>)}
          </div>
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}
          {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">{notice}</div>}
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <section className="panel min-w-0 p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-semibold">Opportunity directory</h2><p className="muted mt-1 text-sm">Search and review public records.</p></div><button onClick={() => void loadItems()} disabled={loading} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50">{loading ? "Refreshing…" : "Refresh"}</button></div>
              <label className="sr-only" htmlFor="admin-search">Search opportunities</label><input id="admin-search" className={inputClass + " mb-4 mt-0"} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, slug, category, network…" />
              <div className="space-y-3">
                {filteredItems.map((item) => <article key={item.id} className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{item.logoUrl ? <img src={item.logoUrl} alt={`${item.name} logo`} className="h-10 w-10 rounded-lg bg-white p-1 object-contain" /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#17211b] text-sm font-semibold">{item.name.slice(0, 1).toUpperCase()}</div>}<div className="min-w-0"><h3 className="font-semibold">{item.name}</h3><p className="muted mt-1 break-all text-xs">/{item.slug} · {item.category}{item.network ? ` · ${item.network}` : ""}</p></div></div><span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs">{displayStatus(item.status)}</span></div><p className="muted mt-3 line-clamp-2 text-sm">{item.summary}</p><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-[#17211b] px-2.5 py-1">{displayStatus(item.incentiveStatus)} incentive</span><span className="rounded-full bg-[#17211b] px-2.5 py-1">{item.lastVerifiedAt ? `Verified ${new Date(item.lastVerifiedAt).toLocaleDateString()}` : "Not verified"}</span>{item.officialUrl && <a className="px-1 text-[#a5f3a8] underline underline-offset-4" href={item.officialUrl} target="_blank" rel="noreferrer">Official site ↗</a>}</div><div className="mt-4 flex gap-2"><button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs hover:bg-[var(--surface-hover)]">Edit</button><button type="button" onClick={() => void handleDelete(item)} className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-950/30">Delete</button></div></article>)}
                {!loading && filteredItems.length === 0 && <div className="muted rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm">No matching opportunities found.</div>}
              </div>
              <p className="muted mt-4 text-xs">Directory loads up to 50 non-demo public records. Use Edit to update details/logo, or Delete to remove a record.</p>
            </section>
            <section className="panel p-5 sm:p-6">
              <h2 className="text-xl font-semibold">{editingSlug ? "Edit opportunity" : "Add opportunity"}</h2><p className="muted mt-1 text-sm leading-6">Only publish incentive claims when you have a source URL and verification notes.</p>
              <form className="mt-5 space-y-4" onSubmit={handleSave}>
                <div><label className={labelClass} htmlFor="name">Project name *</label><input id="name" className={inputClass} value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value, slug: prev.slug || toSlug(event.target.value) }))} maxLength={160} required minLength={2} /></div>
                <div><label className={labelClass} htmlFor="slug">URL slug *</label><input id="slug" className={inputClass} value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: toSlug(event.target.value) }))} disabled={Boolean(editingSlug)} maxLength={180} required minLength={2} pattern="[a-z0-9]+(-[a-z0-9]+)*" /></div>
                <div><label className={labelClass} htmlFor="summary">Summary *</label><textarea id="summary" className={inputClass} value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} rows={3} maxLength={500} minLength={10} required /></div>
                <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="category">Category *</label><input id="category" className={inputClass} value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} maxLength={80} required /></div><div><label className={labelClass} htmlFor="network">Network</label><input id="network" className={inputClass} value={form.network} onChange={(event) => setForm((prev) => ({ ...prev, network: event.target.value }))} maxLength={120} placeholder="e.g. Ethereum" /></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="status">Project status</label><select id="status" className={inputClass} value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}>{["UPCOMING", "ACTIVE", "PAUSED", "ENDED"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label className={labelClass} htmlFor="incentive">Incentive status</label><select id="incentive" className={inputClass} value={form.incentiveStatus} onChange={(event) => setForm((prev) => ({ ...prev, incentiveStatus: event.target.value }))}>{["NOT_ANNOUNCED", "POTENTIAL", "CONFIRMED"].map((value) => <option key={value}>{value}</option>)}</select></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="difficulty">Difficulty</label><select id="difficulty" className={inputClass} value={form.difficulty} onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value }))}>{["Beginner", "Intermediate", "Advanced"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label className={labelClass} htmlFor="cost">Estimated cost (USD)</label><input id="cost" className={inputClass} type="number" min="0" max="99999999.99" step="0.01" value={form.estimatedCostUsd} onChange={(event) => setForm((prev) => ({ ...prev, estimatedCostUsd: event.target.value }))} placeholder="0.00" /></div></div>
                <div><label className={labelClass} htmlFor="officialUrl">Official URL</label><input id="officialUrl" className={inputClass} type="url" value={form.officialUrl} onChange={(event) => setForm((prev) => ({ ...prev, officialUrl: event.target.value }))} maxLength={2048} placeholder="https://…" /></div>
                <div><label className={labelClass} htmlFor="logoUrl">Protocol logo URL</label><input id="logoUrl" className={inputClass} type="url" value={form.logoUrl} onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))} maxLength={2048} placeholder="https://…/protocol-logo.png" /><p className="muted mt-1 text-xs">Public HTTPS image URL use karein; supported formats depend on the image host.</p>{form.logoUrl && <div className="mt-2 flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"><img src={form.logoUrl} alt="Protocol logo preview" className="h-12 w-12 rounded-lg object-contain" /><span className="muted break-all text-xs">Logo preview</span></div>}</div>
                <div><label className={labelClass} htmlFor="sourceUrl">Verification source URL</label><input id="sourceUrl" className={inputClass} type="url" value={form.sourceUrl} onChange={(event) => setForm((prev) => ({ ...prev, sourceUrl: event.target.value }))} maxLength={2048} placeholder="https://official-announcement…" /></div>
                <div><label className={labelClass} htmlFor="verificationNotes">Verification notes</label><textarea id="verificationNotes" className={inputClass} value={form.verificationNotes} onChange={(event) => setForm((prev) => ({ ...prev, verificationNotes: event.target.value }))} rows={3} maxLength={10000} placeholder="What did the source confirm? Add context and caveats." /></div>
                <div><label className={labelClass} htmlFor="verifiedAt">Last verified date</label><input id="verifiedAt" className={inputClass} type="date" value={form.lastVerifiedAt} onChange={(event) => setForm((prev) => ({ ...prev, lastVerifiedAt: event.target.value }))} /></div>
                <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#a5f3a8] px-4 py-3 font-semibold text-[#0a130b] transition hover:bg-[#c1fac3] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving opportunity…" : editingSlug ? "Save changes" : "Create opportunity"}</button>{editingSlug && <button type="button" onClick={() => { setEditingSlug(null); setForm(initialForm); setError(""); setNotice(""); }} className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm">Cancel editing</button>}
              </form>
            </section>
          </div>
        </>
      )}
      <p className="muted mt-8 text-center text-xs">Admin access is restricted by the server API key. Never expose it in public code, URLs, or screenshots.</p>
    </main>
  );
}
