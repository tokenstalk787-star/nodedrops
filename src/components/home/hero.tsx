
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-240px] h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-emerald-400/[0.09] blur-[110px]" />
        <div className="absolute right-[-180px] top-40 size-80 rounded-full bg-cyan-500/[0.05] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2 text-xs font-medium text-emerald-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Your Web3 opportunity discovery hub
          </div>

          <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Find your next
            <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              Web3 opportunity.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Discover blockchain testnets, node programs and developer
            campaigns in one place. Explore requirements, track program
            status and start with official project sources.
          </p>

          <form
            action="/opportunities"
            method="GET"
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-[#11151c]/90 p-2 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row"
          >
            <label htmlFor="home-search" className="sr-only">
              Search opportunities
            </label>

            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-5 shrink-0 text-slate-500"
              >
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="m16 16 4.2 4.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <input
                id="home-search"
                name="q"
                type="search"
                maxLength={100}
                placeholder="Search testnets, nodes, projects..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Search opportunities
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="mr-1">Explore:</span>
            <Link
              href="/opportunities?category=Testnet"
              className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-emerald-400/30 hover:text-emerald-300"
            >
              Testnets
            </Link>
            <Link
              href="/opportunities?category=Node"
              className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-emerald-400/30 hover:text-emerald-300"
            >
              Nodes
            </Link>
            <Link
              href="/opportunities?category=Developer"
              className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-emerald-400/30 hover:text-emerald-300"
            >
              Developer programs
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Official source links
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Clear incentive labels
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              No guaranteed reward claims
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
