import path from "node:path";
import { createReadStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { getSession } from "../../../../../lib/sessionStore";
import { contentTypeFor, safeFilename, encodeFilename } from "../../../../../lib/httpFile";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { sessionId, filename } = await params;
  const name = safeFilename(filename);
  if (!name) {
    return new NextResponse("File not found.", { status: 404 });
  }

  const meta = getSession(sessionId);
  if (!meta) {
    return new NextResponse("Session not found or expired.", { status: 404 });
  }

  try {
    const stats = await fs.stat(filePath);
    const stream = Readable.toWeb(createReadStream(filePath));
    const type = contentTypeFor(name);
    const asAttachment = name.endsWith(".zip") || name.endsWith(".pdf");

    const encodedName = encodeFilename(name);
    const contentDisposition = encodedName.includes("'")
      ? `attachment; filename*=${encodedName}; filename="${name.substring(0, 20)}"`
      : `attachment; filename="${name}"`;

    const headers = {
      "Content-Type": type,
      "Content-Length": String(stats.size),
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Accept-Ranges": "bytes",
    };
    if (asAttachment) {
      headers["Content-Disposition"] = contentDisposition;
    }

    return new NextResponse(stream, { status: 200, headers });
  } catch {
    return new NextResponse("File not found.", { status: 404 });
  }
}
