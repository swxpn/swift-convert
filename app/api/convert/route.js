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
    const pdf = form.get("pdf");
    const format = String(form.get("format") || "PNG").toUpperCase();
    const dpi = Number(form.get("dpi") || 150);
    const pages = String(form.get("pages") || "all");

    if (!pdf || typeof pdf === "string" || !pdf.name) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    const sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf2img_"));
    const inputPath = path.join(sessionDir, "input.pdf");
    await writeUploadedFile(pdf, inputPath);

    const result = await runConversionWorker("convert", {
      input_path: inputPath,
      tmp_dir: sessionDir,
      format,
      dpi,
      pages,
    });

    const sessionId = createSession(sessionDir, {
      images: result.image_names,
      zip: result.zip_name,
    });

    const sid = encodeURIComponent(sessionId);
    return NextResponse.json({
      session: sessionId,
      count: result.count,
      images: result.image_names.map((name) => `/api/file/${sid}/${encodeURIComponent(name)}`),
      zip: `/api/download/${sid}/${encodeURIComponent(result.zip_name)}`,
    });
  } catch (error) {
    console.error(`[API/Convert] Error: ${error.message}`, error);
    const status = error.message.includes("Invalid") || error.message.includes("out of bounds") ? 400 : 500;
    return NextResponse.json(
      { error: `Conversion failed: ${error.message}` },
      { status }
    );
  }
}
