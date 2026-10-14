
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("NodeDrops global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#09090b",
          color: "#fafafa",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <p style={{ color: "#a1a1aa", fontSize: "12px", letterSpacing: "2px" }}>
            NODEDROPS
          </p>

          <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)" }}>
            Something went wrong
          </h1>

          <p
            style={{
              maxWidth: "520px",
              color: "#a1a1aa",
              lineHeight: 1.7,
            }}
          >
            An unexpected application error occurred. Try loading the
            page again. If the problem continues, try again later.
          </p>

          <button
            onClick={() => reset()}
            style={{
              marginTop: "16px",
              padding: "12px 20px",
              border: 0,
              borderRadius: "10px",
              background: "#ffffff",
              color: "#09090b",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
