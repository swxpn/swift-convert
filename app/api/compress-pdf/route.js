import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

import { runConversionWorker } from "../../../lib/pythonRunner";
import { createSession } from "../../../lib/sessionStore";
import { writeUploadedFile } from "../../../lib/uploadFile";
import { sanitizeError, getClientIp, checkRateLimit } from "../../../lib/securityUtils";

export const runtime = "nodejs";
export const maxDuration = 60;

// File size limits optimized for Vercel free tier (15MB max for compression)
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function isTruthy(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
}

export async function POST(request) {
  let sessionDir = null;
  
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 50); // Allow 50 compressions per minute per IP
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const form = await request.formData();
    const pdf = form.get("pdf");
    const targetPercent = Number(form.get("target_percent") || 30);
    const forceCompression = isTruthy(form.get("force_compression"));

    if (!pdf || typeof pdf === "string" || !pdf.name) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    // Validate file size for Vercel constraints
    if (pdf.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 15MB. Your file is ${(pdf.size / (1024 * 1024)).toFixed(2)}MB.` },
        { status: 413 }
      );
    }

    sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfcompress_"));
    const inputPath = path.join(sessionDir, "input.pdf");
    await writeUploadedFile(pdf, inputPath);

    const result = await runConversionWorker("compress_pdf", {
      input_path: inputPath,
      tmp_dir: sessionDir,
      target_percent: targetPercent,
      force_compression: forceCompression,
      original_filename: pdf.name,
    });

    const sid = encodeURIComponent(createSession(sessionDir, {
      pdf: result.pdf_name,
    }));

    return NextResponse.json({
      session: sid,
      pdf: `/api/download/${sid}/${encodeURIComponent(result.pdf_name)}`,
      original_bytes: result.original_bytes,
      compressed_bytes: result.compressed_bytes,
      reduction_percent: result.reduction_percent,
      target_percent: result.target_percent,
      achieved_target: result.achieved_target,
      profile: result.profile,
      force_requested: result.force_requested,
      forced_used: result.forced_used,
    });
  } catch (error) {
    // Cleanup on error
    if (sessionDir) {
      await fs.rm(sessionDir, { recursive: true, force: true }).catch(() => {});
    }
    
    console.error(`[API/CompressPDF] Error: ${error.message}`, error);
    const status = error.message.includes("Invalid") || error.message.includes("between") ? 400 : 500;
    return NextResponse.json(
      { error: sanitizeError(error) },
      { status }
    );
  }
}
