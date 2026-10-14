
import Link from "next/link";

const categories = [
  {
    name: "Testnets",
    value: "Testnet",
    symbol: "01",
    title: "Explore test networks",
    description:
      "Discover blockchain test environments and learn what participation involves.",
    accent: "text-cyan-300",
    accentBg: "bg-cyan-400/10",
    accentBorder: "group-hover:border-cyan-400/30",
  },
  {
    name: "Node programs",
    value: "Node",
    symbol: "02",
    title: "Run and operate nodes",
    description:
      "Find node-operation programs, infrastructure requirements and participation details.",
    accent: "text-emerald-300",
    accentBg: "bg-emerald-400/10",
    accentBorder: "group-hover:border-emerald-400/30",
  },
  {
    name: "Developer programs",
    value: "Developer",
    symbol: "03",
    title: "Build in Web3",
    description:
      "Explore developer sandboxes, ecosystem campaigns and technical contribution paths.",
    accent: "text-violet-300",
    accentBg: "bg-violet-400/10",
    accentBorder: "group-hover:border-violet-400/30",
  },
];

export function CategoryGrid() {
  return (
    <section
      className="py-16 sm:py-20"
      aria-labelledby="categories-heading"
    >
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
          Find your path
        </p>
        <h2
          id="categories-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Explore by category
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          Choose the type of Web3 opportunity that matches your goals,
          skills and available resources.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/opportunities?category=${encodeURIComponent(category.value)}`}
            className={`group rounded-2xl border border-white/10 bg-[#10131a] p-6 transition duration-200 hover:-translate-y-1 hover:bg-[#131923] ${category.accentBorder}`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex size-11 items-center justify-center rounded-xl text-sm font-semibold ${category.accentBg} ${category.accent}`}
              >
                {category.symbol}
              </span>
              <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </div>

            <p
              className={`mt-6 text-xs font-semibold uppercase tracking-[0.15em] ${category.accent}`}
            >
              {category.name}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-white">
              {category.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {category.description}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition group-hover:text-white">
              Browse category <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
