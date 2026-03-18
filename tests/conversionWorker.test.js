import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

import { runConversionWorker } from "../lib/conversionWorker";

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "swift-convert-test-"));
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}

describe("conversionWorker", () => {
  it("converts PDF to images and produces a zip", async () => {
    const dir = makeTmpDir();
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.addPage([200, 200]);
      const pdfBytes = await pdfDoc.save();
      const pdfPath = path.join(dir, "sample.pdf");
      fs.writeFileSync(pdfPath, pdfBytes);

      const result = await runConversionWorker("convert", {
        input_path: pdfPath,
        tmp_dir: dir,
        format: "PNG",
        dpi: 72,
        pages: "all",
      });

      expect(result.count).toBe(1);
      expect(Array.isArray(result.image_names)).toBe(true);
      expect(result.zip_name).toBe("converted_images.zip");

      const imagePath = path.join(dir, result.image_names[0]);
      expect(fs.existsSync(imagePath)).toBe(true);
      expect(fs.existsSync(path.join(dir, result.zip_name))).toBe(true);
    } finally {
      cleanupDir(dir);
    }
  });

  it("creates a PDF from images", async () => {
    const dir = makeTmpDir();
    try {
      const imagePath = path.join(dir, "sample.png");
      await sharp({
        create: {
          width: 100,
          height: 100,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 },
        },
      })
        .png()
        .toFile(imagePath);

      const result = await runConversionWorker("img2pdf", {
        image_paths: [imagePath],
        tmp_dir: dir,
        page_size: "A4",
        orientation: "portrait",
      });

      expect(result.pdf_name).toMatch(/converted-.*\.pdf/);
      const outPdf = path.join(dir, result.pdf_name);
      expect(fs.existsSync(outPdf)).toBe(true);
    } finally {
      cleanupDir(dir);
    }
  });
});
