
export default function OpportunityDetailLoading() {
  return (
    <main
      className="container mx-auto max-w-5xl px-4 py-10"
      aria-busy="true"
      aria-label="Loading opportunity details"
    >
      <div className="animate-pulse">
        <div className="h-4 w-48 rounded bg-white/10" />

        <div className="mt-8 flex flex-wrap gap-2">
          <div className="h-7 w-24 rounded-full bg-white/10" />
          <div className="h-7 w-28 rounded-full bg-white/10" />
        </div>

        <div className="mt-5 h-10 max-w-2xl rounded-lg bg-white/10" />
        <div className="mt-4 h-4 max-w-3xl rounded bg-white/10" />
        <div className="mt-2 h-4 max-w-xl rounded bg-white/10" />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 p-5"
            >
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="mt-4 h-7 w-32 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 p-6">
          <div className="h-6 w-48 rounded bg-white/10" />
          <div className="mt-5 h-4 w-full rounded bg-white/10" />
          <div className="mt-3 h-4 w-5/6 rounded bg-white/10" />
          <div className="mt-3 h-4 w-2/3 rounded bg-white/10" />
        </div>
      </div>

      <span className="sr-only">Loading opportunity details.</span>
    </main>
  );
}
