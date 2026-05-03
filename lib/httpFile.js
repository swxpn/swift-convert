import path from "node:path";

const MIME_TYPES = {
  // Images
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  
  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  
  // Archives
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".7z": "application/x-7z-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  
  // Audio/Video
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mkv": "video/x-matroska",
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
