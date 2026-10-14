
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how NodeDrops handles website usage and information submitted by visitors.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">LEGAL</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Privacy policy
      </h1>

      <p className="muted mt-5 leading-7">
        This page describes the intended privacy practices for NodeDrops.
        It must be updated to reflect the services and data collection
        actually enabled on the production website.
      </p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">
            1. Information handled by the website
          </h2>
          <p className="muted mt-3 leading-7">
            When you visit a website, its hosting provider may process
            technical information such as IP address, browser details,
            request timestamps, and security logs. The precise information
            retained depends on the hosting and security configuration.
          </p>
          <p className="muted mt-3 leading-7">
            NodeDrops uses a database to store directory information about
            Web3 opportunities. Do not submit private keys, seed phrases,
            passwords, or other confidential wallet credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            2. Purpose of processing
          </h2>
          <p className="muted mt-3 leading-7">
            Technical information may be used to deliver the website,
            diagnose errors, prevent abuse, and protect service reliability.
            Opportunity information is used to display and maintain the
            directory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            3. Cookies and analytics
          </h2>
          <p className="muted mt-3 leading-7">
            The use of cookies, analytics, advertising, and similar
            technologies depends on which services are enabled. This policy
            should be updated before launch if such services collect
            information or set cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            4. Third-party websites
          </h2>
          <p className="muted mt-3 leading-7">
            Directory entries may link to external project websites,
            documentation, repositories, or community platforms. Those
            services have their own privacy practices, which NodeDrops
            does not control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            5. Data security and retention
          </h2>
          <p className="muted mt-3 leading-7">
            Security measures and retention periods depend on the production
            infrastructure and operational policies. No internet service can
            guarantee absolute security. Configure access controls, secrets,
            database backups, and log retention before launch.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            6. Your privacy rights
          </h2>
          <p className="muted mt-3 leading-7">
            Privacy rights vary by location and applicable law. A real
            contact method for privacy questions and applicable data
            requests must be published before the service is launched.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            7. Policy updates
          </h2>
          <p className="muted mt-3 leading-7">
            This policy may be updated when website features, data practices,
            or legal requirements change. The published policy should
            identify its effective date and explain material changes.
          </p>
        </section>
      </div>

      <p className="muted mt-10 text-sm leading-6">
        This template is not legal advice. Review it against the actual
        production setup and applicable privacy laws before publishing.
      </p>
    </main>
  );
}
