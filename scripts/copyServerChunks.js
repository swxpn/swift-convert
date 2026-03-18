const fs = require("fs");
const path = require("path");

// This script copies all generated server-side webpack chunk files from
// `.next/server/chunks/` into `.next/server/`.
//
// Next.js' runtime (webpack-runtime.js) expects to require chunks as `./<chunkId>.js`
// relative to the server output directory. In some Next.js versions, the chunks are
// emitted into `.next/server/chunks/`, causing runtime failures like:
// "Cannot find module './331.js'".

async function main() {
  const root = process.cwd();
  const serverDir = path.join(root, ".next", "server");
  const chunksDir = path.join(serverDir, "chunks");

  try {
    const stat = await fs.promises.stat(chunksDir);
    if (!stat.isDirectory()) return;
  } catch (error) {
    // Nothing to do if the directory does not exist.
    return;
  }

  const entries = await fs.promises.readdir(chunksDir);
  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(chunksDir, entry);
      const destPath = path.join(serverDir, entry);

      try {
        const entryStat = await fs.promises.stat(sourcePath);
        if (!entryStat.isFile()) return;
        await fs.promises.copyFile(sourcePath, destPath);
      } catch {
        // Ignore individual copy failures.
      }
    })
  );
}

main().catch((error) => {
  console.error("Failed to copy server chunk files:", error);
  process.exit(1);
});
