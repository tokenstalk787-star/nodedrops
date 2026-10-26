import React from "react";
import Script from "next/script";

const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "fb0ce1a0-147b-4775-89ce-4f790431e16b";

export function UmamiAnalytics() {
  if (!UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      id="umami-analytics"
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="lazyOnload"
    />
  );
}
