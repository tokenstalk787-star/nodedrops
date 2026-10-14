
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the terms and limitations that apply to using the NodeDrops Web3 opportunity directory.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">LEGAL</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Terms of use
      </h1>

      <p className="muted mt-5 leading-7">
        These terms describe the intended rules for using NodeDrops.
        Review them for your business and jurisdiction before making the
        website publicly available.
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">
            1. Informational purpose
          </h2>
          <p className="muted mt-3 leading-7">
            NodeDrops provides information about Web3 testnets, node
            programs, developer activities, and related opportunities.
            Listings are provided for research and educational purposes
            and may be incomplete, outdated, or changed by the relevant
            project.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            2. No guaranteed rewards
          </h2>
          <p className="muted mt-3 leading-7">
            NodeDrops does not promise or guarantee an airdrop, token,
            NFT, cryptocurrency payment, allocation, whitelist position,
            or other benefit. Participation does not ensure eligibility
            or a reward.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            3. Costs and financial risk
          </h2>
          <p className="muted mt-3 leading-7">
            Users are responsible for evaluating network fees, hosting
            charges, hardware costs, taxes, and other expenses before
            participating. Estimated costs are not guarantees. Do not
            spend money that you cannot afford to lose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            4. Independent projects
          </h2>
          <p className="muted mt-3 leading-7">
            NodeDrops is not automatically affiliated with, endorsed by,
            or responsible for the projects listed. External project names,
            logos, and trademarks belong to their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            5. Safe participation
          </h2>
          <p className="muted mt-3 leading-7">
            Verify project domains and announcements independently. Never
            disclose a wallet seed phrase or private key. Review wallet
            signatures, token approvals, smart contract permissions, and
            transaction details before authorizing them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            6. Acceptable use
          </h2>
          <p className="muted mt-3 leading-7">
            Do not use the website to abuse its services, attempt
            unauthorized access, interfere with its operation, or submit
            deceptive or malicious information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            7. Availability and changes
          </h2>
          <p className="muted mt-3 leading-7">
            Website features and listings may change or become unavailable.
            We aim to improve accuracy but do not represent that every
            listing is complete, current, or suitable for every user.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            8. Applicable law and contact
          </h2>
          <p className="muted mt-3 leading-7">
            The governing law, dispute process, operator details, and
            official contact information should be specified after the
            website's operating arrangements and applicable legal
            requirements have been reviewed.
          </p>
        </section>
      </div>

      <p className="muted mt-10 text-sm leading-6">
        This is a starting template, not legal advice or a substitute
        for a reviewed and finalized terms-of-use agreement.
      </p>
    </main>
  );
}
