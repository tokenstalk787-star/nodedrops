
import Link from "next/link";

const footerLinks = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/about", label: "About" },
  { href: "/methodology", label: "Verification policy" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              NodeDrops<span className="text-emerald-400">.</span>
            </Link>

            <p className="muted mt-3 max-w-md text-sm leading-6">
              Discover Web3 testnets, node programs, and developer
              opportunities. Research first, verify official sources,
              and participate responsibly.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-semibold">Explore</h2>

            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="muted text-sm transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="muted text-xs leading-5">
            NodeDrops is an independent information directory. Listings
            do not guarantee token distributions, airdrops, or financial
            returns. Always verify details through official project sources.
          </p>

          <p className="muted mt-4 text-xs">
            © {new Date().getFullYear()} NodeDrops. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
