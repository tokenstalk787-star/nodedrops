import React from "react";
import Script from "next/script";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Strict Guard: Do not enable with absent, empty, or fabricated placeholder IDs
  if (
    !gaId ||
    typeof gaId !== "string" ||
    !gaId.startsWith("G-") ||
    gaId === "G-XXXXXXXXXX" ||
    gaId.includes("PLACEHOLDER") ||
    gaId.includes("REPLACE")
  ) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default privacy-preserving consent posture
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'granted'
            });

            // Configure GA4 with IP anonymization and zero PII
            gtag('config', '${gaId}', {
              anonymize_ip: true,
              send_page_view: true,
              cookie_flags: 'SameSite=Lax;Secure'
            });
          `,
        }}
      />
    </>
  );
}
