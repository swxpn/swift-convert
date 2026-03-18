import fs from "node:fs/promises";
import path from "node:path";
import pkg from "@napi-rs/canvas";
const { createCanvas, Canvas, Image, ImageData, CanvasRenderingContext2D, DOMMatrix, DOMPoint } = pkg;

import { fileURLToPath } from "node:url";

// Ensure canvas/image classes are available globally BEFORE importing pdfjs
globalThis.Canvas = Canvas;
globalThis.Image = Image;
globalThis.ImageData = ImageData;
globalThis.CanvasRenderingContext2D = CanvasRenderingContext2D;
globalThis.DOMMatrix = DOMMatrix;
globalThis.DOMPoint = DOMPoint;
globalThis.HTMLCanvasElement = Canvas;
globalThis.HTMLImageElement = Image;

// Minimal document shim for pdfjs-dist internally creating elements
globalThis.document = {
  createElement(name) {
    if (name === "canvas") return createCanvas(1, 1);
    if (name === "img") return new Image();
    return null;
  },
};

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

function ensureDir(dir) {
  return fs.mkdir(dir, { recursive: true });
}

function createCanvasFactory() {
  return {
    create(width, height) {
      const canvas = createCanvas(width, height);
      const context = canvas.getContext("2d");
      return { canvas, context };
    },
    reset(canvasAndContext, width, height) {
      canvasAndContext.canvas.width = width;
      canvasAndContext.canvas.height = height;
    },
    destroy(canvasAndContext) {
      // Zeroing out width/height helps release memory in node-canvas
      canvasAndContext.canvas.width = 0;
      canvasAndContext.canvas.height = 0;
      canvasAndContext.canvas = null;
      canvasAndContext.context = null;
    },
  };
}

async function renderPages({ inputPath, outDir, pages, dpi }) {
  const data = await fs.readFile(inputPath);
  
  // Point to the local node_modules assets for fonts and cmaps
  const pdfjsPath = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(pdfjsPath, "..", "node_modules", "pdfjs-dist");
  
  const loadingTask = getDocument({
    data: new Uint8Array(data),
    standardFontDataUrl: path.join(distPath, "standard_fonts") + path.sep,
    cMapUrl: path.join(distPath, "cmaps") + path.sep,
    cMapPacked: true,
  });
  const pdf = await loadingTask.promise;
  const results = [];

  const canvasFactory = createCanvasFactory();

  for (const pageIndex of pages) {
    const pageNumber = pageIndex + 1;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: dpi / 72 });

    // Create canvas via factory
    const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
    const { canvas, context } = canvasAndContext;

    // Render the page to the canvas
    const renderContext = {
      canvasContext: context,
      viewport,
      canvasFactory,
    };
    await page.render(renderContext).promise;

    const outName = `page_${String(pageNumber).padStart(4, "0")}.png`;
    const outPath = path.join(outDir, outName);
    await fs.writeFile(outPath, canvas.toBuffer("image/png"));

    canvasFactory.destroy(canvasAndContext);
    results.push(outName);
  }

  return results;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Expected JSON config argument");
    process.exit(1);
  }

  const config = JSON.parse(arg);
  const { inputPath, outDir, pages, dpi } = config;

  await ensureDir(outDir);

  const names = await renderPages({ inputPath, outDir, pages, dpi });
  process.stdout.write(JSON.stringify({ names }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
