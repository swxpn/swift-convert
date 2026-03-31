import path from "node:path";

const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
};

export function safeFilename(name) {
  const base = path.basename(String(name || ""));
  if (!base || base === "." || base === "..") {
    return null;
  }
  return base;
}

export function contentTypeFor(filename) {
  const ext = path.extname(filename).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export function encodeFilename(filename) {
  // RFC 5987 encoding for Content-Disposition header
  // Use UTF-8 encoding for special characters
  try {
    const encoded = encodeURIComponent(filename);
    const isSafeAscii = /^[a-zA-Z0-9._-]*$/.test(filename);
    if (isSafeAscii) {
      return filename; // No encoding needed for safe ASCII
    }
    // Use RFC 5987 format: filename*=UTF-8''encoded
    return `UTF-8''${encoded}`;
  } catch (err) {
    console.error(`[httpFile] Error encoding filename: ${err.message}`);
    return 'download';
  }
}
