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

export async function POST(request) {
  let sessionDir = null;
  
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 30); // More strict for PDF editing
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    const form = await request.formData();
    const operation = String(form.get("operation") || "").trim().toLowerCase();

    if (!["merge", "visual_edit"].includes(operation)) {
      return NextResponse.json({ error: "Invalid PDF edit operation." }, { status: 400 });
    }

    sessionDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdfedit_"));

    if (operation === "merge") {
      const files = form.getAll("pdfs").filter((f) => typeof f !== "string");
      if (files.length < 2) {
        return NextResponse.json(
          { error: "Merge requires at least two PDF files." },
          { status: 400 }
        );
      }

      const inputPaths = await Promise.all(
        files.map(async (file, index) => {
          const target = path.join(sessionDir, `merge_${index}.pdf`);
          await writeUploadedFile(file, target);
          return target;
        })
      );

      const result = await runConversionWorker("modify_pdf", {
        operation,
        tmp_dir: sessionDir,
        input_paths: inputPaths,
      });

      const sid = encodeURIComponent(createSession(sessionDir, { file: result.filename }));
      return NextResponse.json({
        session: sid,
        operation,
        file: `/api/download/${sid}/${encodeURIComponent(result.filename)}`,
        filename: result.filename,
        page_count: result.page_count,
        output_count: result.output_count,
        summary: result.summary,
      });
    }

    const pdf = form.get("pdf");
    if (!pdf || typeof pdf === "string" || !pdf.name) {
      return NextResponse.json(
        { error: "This operation requires exactly one PDF file." },
        { status: 400 }
      );
    }

    const slotsRaw = String(form.get("slots_json") || "").trim();
    if (!slotsRaw) {
      return NextResponse.json({ error: "No page edits were provided." }, { status: 400 });
    }

    let slots;
    try {
      slots = JSON.parse(slotsRaw);
    } catch (e) {
      return NextResponse.json({ error: `Invalid edit payload: ${e.message}` }, { status: 400 });
    }

    const inputPath = path.join(sessionDir, "input.pdf");
    await writeUploadedFile(pdf, inputPath);

    const result = await runConversionWorker("modify_pdf", {
      operation,
      tmp_dir: sessionDir,
      input_path: inputPath,
      slots,
    });

    const sid = encodeURIComponent(createSession(sessionDir, { file: result.filename }));
    return NextResponse.json({
      session: sid,
      operation,
      file: `/api/download/${sid}/${encodeURIComponent(result.filename)}`,
      filename: result.filename,
      page_count: result.page_count,
      output_count: result.output_count,
      summary: result.summary,
    });
  } catch (error) {
    // Cleanup on error
    if (sessionDir) {
      await fs.rm(sessionDir, { recursive: true, force: true }).catch(() => {});
    }
    
    console.error(`[API/EditPDF] Error: ${error.message}`, error);
    const status = error.message.includes("Invalid") || error.message.includes("out of bounds") || error.message.includes("requires") ? 400 : 500;
    return NextResponse.json({ error: sanitizeError(error) }, { status });
  }
}