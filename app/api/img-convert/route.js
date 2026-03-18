import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";

import { runConversionWorker } from "../../../lib/pythonRunner";
import { createSession } from "../../../lib/sessionStore";
import { writeUploadedFile } from "../../../lib/uploadFile";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const form = await request.formData();
    const image = form.get("image");
    const targetFormat = String(form.get("target_format") || "JPEG").toUpperCase();

    if (!image || typeof image === "string" || !image.name) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const normalizedTarget = targetFormat === "JPG" ? "JPEG" : targetFormat;
    if (!["PNG", "JPEG"].includes(normalizedTarget)) {
      return NextResponse.json(
        { error: "Target format must be PNG or JPEG." },
        { status: 400 }
      );
    }

    const ext = path.extname(image.name || "").toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      return NextResponse.json(
        { error: "Only PNG and JPEG files are supported." },
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
    return NextResponse.json(
      { error: `Image conversion failed: ${error.message}` },
      { status: 500 }
    );
  }
}
