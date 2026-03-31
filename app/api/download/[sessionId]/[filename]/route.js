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
    return new NextResponse("Invalid filename.", { status: 400 });
  }

  const meta = getSession(sessionId);
  if (!meta) {
    return new NextResponse("Session not found or expired.", { status: 404 });
  }

  const filePath = path.join(meta.dir, name);

  try {
    const stats = await fs.stat(filePath);
    
    if (!stats.isFile()) {
      return new NextResponse("Path is not a file.", { status: 400 });
    }
    
    if (stats.size === 0) {
      return new NextResponse("File is empty.", { status: 400 });
    }
    
    const stream = Readable.toWeb(createReadStream(filePath));

    // RFC 5987 encoded filename for proper character support
    const encodedName = encodeFilename(name);
    const contentDisposition = encodedName.includes("'")
      ? `attachment; filename*=${encodedName}; filename="${name.substring(0, 20)}"`
      : `attachment; filename="${name}"`;

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFor(name),
        "Content-Length": String(stats.size),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Disposition": contentDisposition,
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return new NextResponse("File not found in session.", { status: 404 });
    }
    console.error(`[Download] Error accessing ${filePath}:`, err.message);
    return new NextResponse("Failed to retrieve file.", { status: 500 });
  }
}
