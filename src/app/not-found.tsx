import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
        <p className="text-slate-400">The requested resource could not be found.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
