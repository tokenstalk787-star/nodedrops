"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSourceAction } from "@/lib/actions/admin.actions";

export function NewSourceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createSourceAction(formData);
      setIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save upstream source.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsOpen(true)}>
        Add Documentation Source
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 rounded-2xl border border-slate-800 bg-[#070b16] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Upstream Documentation Reference</h3>
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
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Source Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Ethereum Execution API Specifications"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Documentation URL *</label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://github.com/ethereum/execution-apis"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Source Type</label>
                  <select
                    name="sourceType"
                    defaultValue="OFFICIAL_DOCS"
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white"
                  >
                    <option value="OFFICIAL_DOCS">OFFICIAL_DOCS</option>
                    <option value="UPSTREAM_REPO">UPSTREAM_REPO</option>
                    <option value="SPECIFICATION">SPECIFICATION</option>
                    <option value="AUDIT_REPORT">AUDIT_REPORT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-200">Reliability Score (0-100%)</label>
                  <input
                    type="number"
                    name="reliabilityScore"
                    defaultValue={100}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 rounded-xl bg-[#0b101d] border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  Save Source
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
