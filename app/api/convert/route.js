import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

import { runConversionWorker } from "../../../lib/pythonRunner";
import { createSession } from "../../../lib/sessionStore";
import { writeUploadedFile } from "../../../lib/uploadFile";
import { sanitizeError, validateDpi, validateQuality, validatePageRange, getClientIp, checkRateLimit } from "../../../lib/securityUtils";

export const runtime = "nodejs";
export const maxDuration = 60;

// File size limits optimized for Vercel free tier (30MB max for PDF conversion)
const MAX_FILE_SIZE = 30 * 1024 * 1024;

export async function POST(request) {
  let sessionDir = null;
  
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 50); // Allow 50 conversions per minute per IP
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const form = await request.formData();
    const pdf = form.get("pdf");
    const format = String(form.get("format") || "PNG").toUpperCase();
    const dpi = Number(form.get("dpi") || 150);
    const webpQuality = Number(form.get("webp_quality") || 80);
    const pages = String(form.get("pages") || "all");

    if (!pdf || typeof pdf === "string" || !pdf.name) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    // Validate file size for Vercel constraints
    if (pdf.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 30MB. Your file is ${(pdf.size / (1024 * 1024)).toFixed(2)}MB.` },
        { status: 413 }
      );
    }

    // Validate input parameters
    try {
      validateDpi(dpi);
      validateQuality(webpQuality);
      validatePageRange(pages);
    } catch (validationErr) {
      return NextResponse.json({ error: validationErr.message }, { status: 400 });
    }

    sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf2img_"));
    const inputPath = path.join(sessionDir, "input.pdf");
    await writeUploadedFile(pdf, inputPath);

    const result = await runConversionWorker("convert", {
      input_path: inputPath,
      tmp_dir: sessionDir,
      format,
      dpi,
      pages,
      webp_quality: webpQuality,
    });

    const sid = encodeURIComponent(createSession(sessionDir, {
      images: result.image_names,
      zip: result.zip_name,
    }));

    return NextResponse.json({
      session: sid,
      count: result.count,
      images: result.image_names.map((name) => `/api/file/${sid}/${encodeURIComponent(name)}`),
      zip: `/api/download/${sid}/${encodeURIComponent(result.zip_name)}`,
    });
  } catch (error) {
    // Cleanup on error
    if (sessionDir) {
      await fs.rm(sessionDir, { recursive: true, force: true }).catch(() => {});
    }
    
    console.error(`[API/Convert] Error: ${error.message}`, error);
    const status = error.message.includes("Invalid") || error.message.includes("out of bounds") ? 400 : 500;
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status }
    );
  }
}
