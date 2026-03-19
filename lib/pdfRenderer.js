import { execFile } from "node:child_process";
import path from "node:path";

export async function renderPdfToPngs({ inputPath, tmpDir, pages, dpi }) {
  const script = path.join(process.cwd(), "scripts", "render-pdf.mjs");
  const config = {
    inputPath,
    outDir: tmpDir,
    pages,
    dpi,
  };

  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [script, JSON.stringify(config)],
      { maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          const message = stderr || err.message || "Unknown error";
          console.error(`[pdfRenderer] Process failed: ${message}`);
          return reject(new Error(`PDF rendering failed: ${message}`));
        }
        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed.names ?? []);
        } catch (parseErr) {
          reject(new Error(`Failed to parse render output: ${parseErr.message}\nOutput: ${stdout}`));
        }
      }
    );
  });
}
