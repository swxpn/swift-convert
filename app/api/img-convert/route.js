import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

import { runConversionWorker } from "../../../lib/pythonRunner";
import { createSession } from "../../../lib/sessionStore";
import { writeUploadedFile } from "../../../lib/uploadFile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const form = await request.formData();
    const image = form.get("image");
    const targetFormat = String(form.get("target_format") || "JPEG").toUpperCase();
    const dpi = Number(form.get("dpi") || 150);
    const webpQuality = Number(form.get("webp_quality") || 80);

    if (!image || typeof image === "string" || !image.name) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const normalizedTarget = targetFormat === "JPG" ? "JPEG" : targetFormat;
    if (!["PNG", "JPEG", "WEBP", "TIFF"].includes(normalizedTarget)) {
      return NextResponse.json(
        { error: "Target format must be PNG, JPEG, WEBP, or TIFF." },
        { status: 400 }
      );
    }

    const ext = path.extname(image.name || "").toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp", ".tiff", ".tif"].includes(ext)) {
      return NextResponse.json(
        { error: "Input file must be PNG, JPEG, WEBP, or TIFF format." },
        { status: 400 }
      );
    }

    const sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "imgconvert_"));
    const inputPath = path.join(sessionDir, `input${ext || ".img"}`);
    await writeUploadedFile(image, inputPath);

    const result = await runConversionWorker("convert_image_format", {
      input_path: inputPath,
      tmp_dir: sessionDir,
      target_format: normalizedTarget,
      original_filename: image.name,
      dpi: dpi,
      webp_quality: webpQuality,
    });

    const sessionId = createSession(sessionDir, {
      image: result.image_name,
    });

    const sid = encodeURIComponent(sessionId);
    return NextResponse.json({
      session: sessionId,
      image: `/api/download/${sid}/${encodeURIComponent(result.image_name)}`,
      source_format: result.source_format,
      target_format: result.target_format,
      original_bytes: result.original_bytes,
      converted_bytes: result.converted_bytes,
    });
  } catch (error) {
    console.error(`[API/ImgConvert] Error: ${error.message}`, error);
    const status = error.message.includes("Supported") || error.message.includes("different") ? 400 : 500;
    return NextResponse.json(
      { error: `Image conversion failed: ${error.message}` },
      { status }
    );
  }
}
