import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const assetVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

export const metadata = {
  title: "Swift Convert",
  description: "PDF and Image converter on Next.js",
  icons: {
    icon: `/favicon.svg?v=${assetVersion}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
