
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research and Verification Methodology",
  description:
    "Understand how NodeDrops classifies incentives, records sources, and communicates uncertainty.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">TRANSPARENCY</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Research and verification methodology
      </h1>

      <p className="muted mt-5 text-lg leading-8">
        Our goal is to help users distinguish documented project information
        from speculation. Always check the linked official source before
        spending money or connecting a wallet.
      </p>

      <section className="mt-10 space-y-6">
        <article className="panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            1. Official sources first
          </h2>
          <p className="muted mt-3 leading-7">
            Useful sources include official project websites, documentation,
            project-controlled announcements, and official repositories.
            Community posts can help identify an opportunity, but should not
            automatically be treated as proof of rewards.
          </p>
        </article>

        <article className="panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            2. Incentive classifications
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Confirmed</h3>
              <p className="muted mt-1 leading-6">
                An incentive is explicitly supported by credible project
                evidence. This classification does not guarantee that a
                particular user will qualify or receive a reward.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Potential</h3>
              <p className="muted mt-1 leading-6">
                There may be a reason to investigate a possible incentive,
                but a reward has not been sufficiently confirmed. Users
                should not assume an airdrop or token allocation will happen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Not announced</h3>
              <p className="muted mt-1 leading-6">
                No confirmed incentive announcement is recorded. Participation
                may still be useful for learning or contributing, but a
                financial reward should not be expected.
              </p>
            </div>
          </div>
        </article>

        <article className="panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            3. Verification evidence
          </h2>
          <p className="muted mt-3 leading-7">
            Where available, a listing should include a source URL, a
            verification date, and notes describing what was checked.
            These fields should explain the evidence rather than simply
            assigning an unsupported confidence score.
          </p>
          <p className="muted mt-3 leading-7">
            A verification date indicates when the information was reviewed;
            it does not prove that the opportunity remains open today.
          </p>
        </article>

        <article className="panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            4. Costs and technical requirements
          </h2>
          <p className="muted mt-3 leading-7">
            Estimated costs can change with cloud hosting prices, network
            fees, hardware requirements, and project configuration. Treat
            estimates as guidance, not a quote or a guarantee of profitability.
          </p>
        </article>

        <article className="panel rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            5. Corrections and updates
          </h2>
          <p className="muted mt-3 leading-7">
            Project requirements, deadlines, incentives, and official URLs
            can change. Verify current instructions on the project's own
            channels before acting. Outdated or incorrect listings should
            be corrected when reliable evidence becomes available.
          </p>
        </article>
      </section>

      <p className="muted mt-8 text-sm leading-6">
        NodeDrops provides informational content only. Research and
        verification labels are not financial, investment, tax, or legal advice.
      </p>
    </main>
  );
}
