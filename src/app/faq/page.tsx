
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about Web3 testnets, node programs, incentive labels, participation costs, and wallet safety on NodeDrops.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    question: "Does NodeDrops guarantee airdrops or tokens?",
    answer:
      "No. NodeDrops does not guarantee tokens, NFTs, USDT, ETH, or any other reward. Even when a project announces incentives, eligibility and distribution depend on that project's rules.",
  },
  {
    question: "What does Confirmed incentive mean?",
    answer:
      "It means available evidence supports an incentive announcement. It does not mean every participant qualifies, that a reward has a known value, or that payment is guaranteed.",
  },
  {
    question: "Can I participate without spending money?",
    answer:
      "Some activities may be free, while others require network fees, hardware, a VPS, or other expenses. Read the official requirements and calculate your own costs before participating.",
  },
  {
    question: "Are all listed opportunities currently active?",
    answer:
      "Not necessarily. Check the displayed status and the project's official website or documentation. Deadlines and program status can change without notice.",
  },
  {
    question: "Should I share my wallet seed phrase?",
    answer:
      "Never share your seed phrase or private key with NodeDrops or a project claiming to provide support. Verify domains carefully and be cautious of unexpected wallet signatures and token approval requests.",
  },
  {
    question: "Does NodeDrops operate the listed projects?",
    answer:
      "No. NodeDrops is an independent directory. Unless explicitly disclosed and verified, a listing should not be interpreted as an official partnership or endorsement.",
  },
  {
    question: "How should I verify an opportunity?",
    answer:
      "Open the official project website and documentation from the listing, confirm the network and domain, review the current participation requirements, and look for an official announcement about any claimed incentives.",
  },
  {
    question: "What should I do if a listing is incorrect?",
    answer:
      "Check the project's official sources first. Once NodeDrops publishes an official contact channel, use it to submit the listing URL and evidence supporting the correction.",
  },
];

export default function FAQPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">HELP CENTER</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Frequently asked questions
      </h1>

      <p className="muted mt-5 text-lg leading-8">
        Important information about discovering and evaluating Web3
        opportunities through NodeDrops.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="panel group rounded-xl p-5"
          >
            <summary className="cursor-pointer list-none font-semibold">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="text-xl transition group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>

            <p className="muted mt-4 leading-7">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="panel mt-10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold">
          Ready to explore?
        </h2>
        <p className="muted mt-2 leading-7">
          Browse the directory and verify each opportunity using its
          official project sources.
        </p>
        <Link
          href="/opportunities"
          className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          Browse opportunities
        </Link>
      </div>
    </main>
  );
}
