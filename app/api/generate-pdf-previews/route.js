import { NextResponse } from 'next/server';
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { renderPdfToPngs } from '../../../lib/pdfRenderer';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB for PDF previews

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Validate file size
    if (pdfFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: 30MB` },
        { status: 413 }
      );
    }

    // Create temporary directory for processing
    const tmpDir = path.join(os.tmpdir(), `pdf-preview-${Date.now()}`);
    await fs.mkdir(tmpDir, { recursive: true });

    try {
      // Write uploaded PDF to temp location
      const inputPath = path.join(tmpDir, 'input.pdf');
      const buffer = await pdfFile.arrayBuffer();
      await fs.writeFile(inputPath, Buffer.from(buffer));

      // Get PDF page count and render all pages
      const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const pdfData = Buffer.from(buffer);

      const pdfjsPath = path.dirname(new URL(import.meta.url).pathname);
      const distPath = path.join(pdfjsPath, '../../../node_modules/pdfjs-dist');

      const loadingTask = getDocument({
        data: new Uint8Array(pdfData),
        standardFontDataUrl: path.join(distPath, 'standard_fonts') + path.sep,
        cMapUrl: path.join(distPath, 'cmaps') + path.sep,
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      // Generate thumbnails for all pages (max DPI 72 for speed)
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      const renderResult = await renderPdfToPngs({
        inputPath,
        tmpDir,
        pages: pageIndices,
        dpi: 72, // Lower DPI for faster preview generation
      });

      // Convert rendered PNGs to base64
      const previews = [];
      for (let i = 0; i < renderResult.names.length; i++) {
        const imagePath = path.join(tmpDir, renderResult.names[i]);
        const imageBuffer = await fs.readFile(imagePath);
        const base64 = imageBuffer.toString('base64');
        previews.push({
          index: i,
          image: `data:image/png;base64,${base64}`,
          rotation: 0,
        });
      }

      return NextResponse.json({
        success: true,
        pageCount,
        previews,
      });
    } finally {
      // Clean up temporary directory
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
  } catch (err) {
    console.error('Preview generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate previews' },
      { status: 500 }
    );
  }
}
