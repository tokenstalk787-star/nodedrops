"use client";

import React, { useActionState } from "react";
import { submitContactAction, ContactFormState } from "@/lib/actions/contact.actions";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle2, AlertTriangle, Send, Mail, User, Tag, MessageSquare } from "lucide-react";

const INITIAL_STATE: ContactFormState = {
  success: false,
};

const SUBJECT_OPTIONS = [
  "Content Correction / Runbook Errata",
  "Source Verification Request",
  "Suggest New Network or Client",
  "Hardware / Storage Estimation Feedback",
  "General Infrastructure Inquiry",
  "Other Topic",
];

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, INITIAL_STATE);

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {state.success && (
        <Alert variant="success">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Inquiry Received &amp; Queued</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
              {state.message}
            </p>
            <p className="text-[11px] text-emerald-400/80 font-mono pt-1">
              Status: Logged in MySQL Quality Queue &bull; Typical Review SLA: 24–48 Hours
            </p>
          </div>
        </Alert>
      )}

      {/* Error Notification */}
      {!state.success && state.error && (
        <Alert variant="error">
          <div className="flex items-center gap-2 text-rose-300 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{state.error}</span>
          </div>
        </Alert>
      )}

      {/* Main Submission Form */}
      <form action={formAction} className="space-y-5">
        {/* Anti-spam Honeypot Field (Hidden from humans, attracts bots) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website (Leave blank)</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Your Name / Handle *</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isPending}
              placeholder="e.g. Satoshi or Dev Operator"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.name && (
              <p className="text-[11px] text-rose-400">{state.fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              placeholder="operator@domain.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.email && (
              <p className="text-[11px] text-rose-400">{state.fieldErrors.email}</p>
            )}
          </div>
        </div>

        {/* Subject Dropdown / Custom Field */}
        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Subject / Inquiry Category *</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            disabled={isPending}
            defaultValue=""
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50"
          >
            <option value="" disabled>Select inquiry type...</option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0e1424] text-slate-200">
                {opt}
              </option>
            ))}
          </select>
          {state.fieldErrors?.subject && (
            <p className="text-[11px] text-rose-400">{state.fieldErrors.subject}</p>
          )}
        </div>

        {/* Message Textarea */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Message / Technical Details *</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={isPending}
            placeholder="Describe the runbook errata, client version issue, or general question with reproducible steps or official documentation URLs..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b101d] border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors disabled:opacity-50 resize-y"
          />
          {state.fieldErrors?.message && (
            <p className="text-[11px] text-rose-400">{state.fieldErrors.message}</p>
          )}
        </div>

        {/* Submission Button & Honest Disclaimer */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
            🔒 Submissions are stored in our secure administrative database. We do not sell data or share email addresses. Never submit private keys.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            leftIcon={<Send className="w-4 h-4" />}
            className="sm:w-auto w-full"
          >
            {isPending ? "Submitting..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
