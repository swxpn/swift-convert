const assetVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

export default function HomePage() {
  return (
    <main className="legacy-shell">
      <iframe
        className="legacy-frame"
        src={`/legacy-ui.html?v=${assetVersion}`}
        title="Swift Convert"
      />
    </main>
  );
}
