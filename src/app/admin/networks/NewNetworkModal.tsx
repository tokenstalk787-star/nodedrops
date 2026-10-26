"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createNetworkAction } from "@/lib/actions/admin.actions";

export function NewNetworkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createNetworkAction(formData);
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create network.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsOpen(true)}>
        Add Network
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-xl p-6 rounded-2xl border border-slate-800 bg-[#070b16] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Blockchain Network</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Network Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Polygon PoS"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    placeholder="e.g. polygon-pos"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Symbol *</label>
                  <input
                    type="text"
                    name="symbol"
                    required
                    placeholder="e.g. POL"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Chain ID</label>
                  <input
                    type="text"
                    name="chainId"
                    placeholder="137"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Type *</label>
                  <select name="networkType" className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white">
                    <option value="MAINNET">MAINNET</option>
                    <option value="TESTNET">TESTNET</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Category *</label>
                  <input
                    type="text"
                    name="category"
                    required
                    defaultValue="Layer 1"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Layer *</label>
                  <input
                    type="text"
                    name="layer"
                    required
                    defaultValue="Layer 1"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Consensus *</label>
                  <input
                    type="text"
                    name="consensus"
                    required
                    defaultValue="Proof-of-Stake"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Website URL</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Docs URL</label>
                  <input
                    type="url"
                    name="docsUrl"
                    placeholder="https://docs..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Official Project Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  placeholder="/logos/ethereum.svg or https://example.com/logo.svg"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Provide a local asset path (e.g. <code className="text-cyan-400">/logos/ethereum.svg</code>) or a secure HTTPS URL for the project logo.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Save Network
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
