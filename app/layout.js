import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReloadHandler } from "./components/ReloadHandler";

const assetVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

export const metadata = {
  title: "Swift Convert - Free PDF & Image Converter Online",
  description: "Convert PDF to images, compress images, convert images to PDF, edit PDFs and more. Fast, free, and privacy-focused online converter.",
  keywords: "PDF converter, image converter, PDF to image, image to PDF, compress PDF, compress image, PDF editor",
  authors: [{ name: "Swift Convert" }],
  openGraph: {
    title: "Swift Convert - Free PDF & Image Converter",
    description: "Convert and compress PDFs and images online. Fast, secure, and completely free.",
    url: "https://swift-convert.vercel.app",
    siteName: "Swift Convert",
    images: [
      {
        url: "https://swift-convert.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swift Convert - Free PDF & Image Converter",
    description: "Convert and compress PDFs and images online",
    images: ["https://swift-convert.vercel.app/og-image.png"],
  },
  icons: {
    icon: `/favicon.svg?v=${assetVersion}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://swift-convert.vercel.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                  document.documentElement.classList.add('dark-mode');
                }
              })();
              window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (e.matches) {
                  document.documentElement.classList.add('dark-mode');
                } else {
                  document.documentElement.classList.remove('dark-mode');
                }
              });
            `
          }}
        />
        <link rel="canonical" href="https://swift-convert.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Swift Convert",
              description:
                "A free online tool for converting and compressing PDFs and images",
              url: "https://swift-convert.vercel.app",
              applicationCategory: "UtilityApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "512",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is my data secure?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. All files are processed on our servers and deleted immediately after conversion. We never store your files.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What file formats are supported?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We support PDF, JPG, PNG, WEBP and more. Check our documentation for the complete list.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is there a file size limit?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Files up to 100MB are supported. For larger files, contact our support.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <ReloadHandler />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
