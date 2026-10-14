
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NodeDrops",
  description:
    "Learn about NodeDrops, a directory for discovering Web3 testnets, node programs, and developer opportunities.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <p className="eyebrow">ABOUT NODEDROPS</p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Discover opportunities in Web3.
      </h1>

      <p className="muted mt-6 text-lg leading-8">
        NodeDrops helps blockchain users and developers discover testnets,
        node-running programs, and opportunities to contribute to emerging
        Web3 ecosystems.
      </p>

      <section className="panel mt-10 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Our mission</h2>
        <p className="muted mt-3 leading-7">
          Finding worthwhile Web3 opportunities can require searching many
          project websites, documentation pages, and community announcements.
          NodeDrops aims to organize this information in one place so users
          can investigate opportunities more efficiently.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">What you can discover</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="panel rounded-xl p-5">
            <h3 className="font-semibold">Testnets</h3>
            <p className="muted mt-2 leading-6">
              Explore test networks and learn how to participate using
              official project instructions.
            </p>
          </article>

          <article className="panel rounded-xl p-5">
            <h3 className="font-semibold">Node programs</h3>
            <p className="muted mt-2 leading-6">
              Find node operator programs and review their requirements,
              estimated costs, and official documentation.
            </p>
          </article>

          <article className="panel rounded-xl p-5">
            <h3 className="font-semibold">Developer programs</h3>
            <p className="muted mt-2 leading-6">
              Discover opportunities to build, test, and contribute
              applications to blockchain ecosystems.
            </p>
          </article>

          <article className="panel rounded-xl p-5">
            <h3 className="font-semibold">Incentive information</h3>
            <p className="muted mt-2 leading-6">
              Check whether incentives are confirmed, potential, or
              not announced according to the available evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Independent information directory
        </h2>
        <p className="muted mt-3 leading-7">
          NodeDrops is an independent information directory, not an official
          representative of the projects listed. Project names and trademarks
          belong to their respective owners. A listing does not imply an
          endorsement or partnership.
        </p>
      </section>

      <div className="mt-10">
        <Link
          href="/opportunities"
          className="inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          Explore opportunities
        </Link>
      </div>
    </main>
  );
}
