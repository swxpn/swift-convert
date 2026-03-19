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
    const files = form.getAll("images").filter((f) => typeof f !== "string");
    const pageSize = String(form.get("page_size") || "A4").toUpperCase();
    const orientation = String(form.get("orientation") || "portrait").toLowerCase();

    if (!files.length) {
      return NextResponse.json({ error: "No image files provided." }, { status: 400 });
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
