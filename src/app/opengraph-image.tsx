
import { ImageResponse } from "next/og";

export const alt =
  "NodeDrops.xyz — Discover blockchain testnets, node programs, and Web3 developer opportunities";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #09090b 0%, #111827 55%, #064e3b 100%)",
          color: "#fafafa",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 26,
            color: "#a7f3d0",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#10b981",
              color: "#022c22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 28,
            }}
          >
            N
          </div>
          NodeDrops.xyz
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: 66,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -2,
            }}
          >
            Find your next Web3 opportunity.
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#d4d4d8",
            }}
          >
            Testnets · Node Programs · Developer Ecosystems
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          <span>Research before you participate.</span>
          <span>nodedrops.xyz</span>
        </div>
      </div>
    ),
    size,
  );
}
