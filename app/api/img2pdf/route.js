import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

import { runConversionWorker } from "../../../lib/pythonRunner";
import { createSession } from "../../../lib/sessionStore";
import { writeUploadedFile } from "../../../lib/uploadFile";

export const runtime = "nodejs";
export const maxDuration = 60;

// File size limits optimized for Vercel free tier (20MB max for image conversion)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request) {
  try {
    const form = await request.formData();
    
    // Support both 'images' (multiple) and 'image' (single) field names
    let files = form.getAll("images").filter((f) => typeof f !== "string");
    if (!files.length) {
      const singleImage = form.get("image");
      if (singleImage && typeof singleImage !== "string") {
        files = [singleImage];
      }
    }
    
    const pageSize = String(form.get("page_size") || "A4").toUpperCase();
    const orientation = String(form.get("orientation") || "portrait").toLowerCase();

    if (!files.length) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
    }

    // Validate file sizes for Vercel constraints
    let totalSize = 0;
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" is too large. Maximum size per file is 20MB.` },
          { status: 413 }
        );
      }
      totalSize += file.size;
    }

    if (totalSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Total file size exceeds 50MB. Current total: ${(totalSize / (1024 * 1024)).toFixed(2)}MB.` },
        { status: 413 }
      );
    }

    const sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "img2pdf_"));
    const imagePaths = await Promise.all(
      files.map(async (file) => {
        const ext = path.extname(file.name || "").toLowerCase() || ".img";
        const filePath = path.join(sessionDir, `${crypto.randomUUID()}${ext}`);
        await writeUploadedFile(file, filePath);
        return filePath;
      })
    );

    const result = await runConversionWorker("img2pdf", {
      image_paths: imagePaths,
      tmp_dir: sessionDir,
      page_size: pageSize,
      orientation,
    });

    const sessionId = createSession(sessionDir, {
      pdf: result.pdf_name,
    });

    const sid = encodeURIComponent(sessionId);
    return NextResponse.json({
      session: sessionId,
      pdf: `/api/download/${sid}/${encodeURIComponent(result.pdf_name)}`,
      pages: result.pages,
    });
  } catch (error) {
    console.error(`[API/Img2PDF] Error: ${error.message}`, error);
    const status = error.message.includes("Invalid") || error.message.includes("must be") ? 400 : 500;
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status }
    );
  }
}
