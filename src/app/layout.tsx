import type { Metadata } from "next";
import "./globals.css";
// import CursorTrail from "@/components/CursorTrail";

export const metadata: Metadata = {
  title: "Induction '26 — IIIT Delhi",
  description:
    "Induction 2026 — IIIT Delhi. Welcome to the Class of 2028. Schedule, speakers, mentorship and everything you need to know.",
  openGraph: {
    title: "Induction '26 — IIIT Delhi",
    description: "Official induction portal for the IIIT Delhi Class of 2028.",
    images: ["https://induction.iiitd.edu.in/iiitd.png"],
    url: "https://induction.iiitd.edu.in",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Induction '26 — IIIT Delhi",
    description: "Official induction portal for the IIIT Delhi Class of 2028.",
    images: ["https://induction.iiitd.edu.in/iiitd.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" sizes="512x512" href="/iiitd.png" />
        <link rel="apple-touch-icon" href="/iiitd.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "IIIT Delhi Induction 2026",
              url: "https://induction.iiitd.edu.in",
              logo: "https://induction.iiitd.edu.in/iiitd.png",
            }),
          }}
        />
      </head>
      <body>
        {/* <CursorTrail color="#fff" strokeWidth={2} points={24} delay={12.5} />{" "} */}
        {children}
      </body>
    </html>
  );
}
