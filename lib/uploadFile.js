import path from "node:path";
import { createWriteStream, promises as fs } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

export async function writeUploadedFile(file, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true });

  if (typeof file.stream === "function") {
    const source = Readable.fromWeb(file.stream());
    const target = createWriteStream(destination, { flags: "w" });
    await pipeline(source, target);
    return;
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destination, bytes);
}