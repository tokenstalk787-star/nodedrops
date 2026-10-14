
export default function OpportunitiesLoading() {
  return (
    <main
      className="min-h-screen animate-pulse bg-[#090b10] text-white"
      aria-label="Loading opportunities"
    >
      <div className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="mt-5 h-10 max-w-md rounded-lg bg-white/10 sm:h-14" />
          <div className="mt-4 h-4 max-w-2xl rounded bg-white/[0.06]" />
          <div className="mt-2 h-4 max-w-xl rounded bg-white/[0.06]" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#10131a] p-5">
          <div className="h-11 rounded-xl bg-white/[0.06]" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-11 rounded-xl bg-white/[0.06]"
              />
            ))}
          </div>
        </div>

        <div className="my-6 h-4 w-40 rounded bg-white/[0.06]" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="min-h-64 rounded-2xl border border-white/10 bg-[#10131a] p-6"
            >
              <div className="h-6 w-24 rounded bg-white/[0.07]" />
              <div className="mt-6 h-6 w-3/4 rounded bg-white/[0.07]" />
              <div className="mt-4 h-4 rounded bg-white/[0.05]" />
              <div className="mt-2 h-4 w-5/6 rounded bg-white/[0.05]" />
              <div className="mt-10 h-4 w-1/2 rounded bg-white/[0.07]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
