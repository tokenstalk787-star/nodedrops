import Link from "next/link";

const navigation = [
  { label: "Explore", href: "/opportunities" },
  { label: "Verification", href: "/methodology" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(9, 13, 11, 0.94)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        className="container"
        style={{
          minHeight: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          paddingBlock: 12,
        }}
      >
        <Link
          href="/"
          aria-label="NodeDrops home"
          style={{
            fontSize: 21,
            fontWeight: 800,
            letterSpacing: "-0.06em",
          }}
        >
          Node<span style={{ color: "var(--accent)" }}>Drops</span>
          <span className="muted" style={{ fontSize: 12 }}>.xyz</span>
        </Link>

        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            fontSize: 13,
          }}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: "var(--muted)" }}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/opportunities"
            style={{
              padding: "10px 14px",
              borderRadius: 9,
              background: "var(--accent)",
              color: "#0a130b",
              fontWeight: 700,
            }}
          >
            Find opportunities
          </Link>
        </nav>
      </div>
    </header>
  );
}
