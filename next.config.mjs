/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./scripts/render-pdf.mjs",
      "./node_modules/@napi-rs/**/*",
      "./node_modules/pdfjs-dist/**/*"
    ],
  },
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas", "sharp"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async headers() {
    return [
      {
        source: "/favicon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
