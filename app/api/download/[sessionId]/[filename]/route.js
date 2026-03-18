import path from "node:path";
import { createReadStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { getSession } from "../../../../../lib/sessionStore";
import { contentTypeFor, safeFilename } from "../../../../../lib/httpFile";

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

  const filePath = path.join(meta.dir, name);

  try {
    const stats = await fs.stat(filePath);
    const stream = Readable.toWeb(createReadStream(filePath));

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": contentTypeFor(name),
        "Content-Length": String(stats.size),
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${name}"`,
      },
    });
  } catch {
    return new NextResponse("File not found.", { status: 404 });
  }
}
