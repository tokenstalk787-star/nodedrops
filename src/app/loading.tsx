
export default function Loading() {
  return (
    <main
      className="container mx-auto max-w-7xl px-4 py-12"
      aria-busy="true"
      aria-label="Loading NodeDrops"
    >
      <div className="animate-pulse">
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="mt-5 h-10 max-w-lg rounded-lg bg-white/10" />
        <div className="mt-4 h-4 max-w-2xl rounded bg-white/10" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 p-5"
            >
              <div className="h-5 w-24 rounded bg-white/10" />
              <div className="mt-5 h-6 w-3/4 rounded bg-white/10" />
              <div className="mt-4 h-4 w-full rounded bg-white/10" />
              <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
              <div className="mt-8 h-8 w-28 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading content, please wait.</span>
    </main>
  );
}
