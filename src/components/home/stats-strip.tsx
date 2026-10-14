
type StatsStripProps = {
  total: number;
  active: number;
  verified: number;
};

const numberFormatter = new Intl.NumberFormat("en-US");

export function StatsStrip({
  total,
  active,
  verified,
}: StatsStripProps) {
  const stats = [
    {
      label: "Listed opportunities",
      value: total,
      description: "Non-demo listings",
    },
    {
      label: "Currently active",
      value: active,
      description: "Marked active in the directory",
    },
    {
      label: "With source evidence",
      value: verified,
      description: "Verification date and source available",
    },
  ];

  return (
    <section
      aria-label="Directory statistics"
      className="relative -mt-1 grid grid-cols-1 gap-3 border-b border-white/[0.07] py-7 sm:grid-cols-3 sm:gap-4 sm:py-8"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 ${
            index === 1 ? "sm:border-x-0 sm:bg-transparent" : ""
          }`}
        >
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {numberFormatter.format(stat.value)}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {stat.description}
          </p>
        </div>
      ))}
    </section>
  );
}
