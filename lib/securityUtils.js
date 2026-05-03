import path from "node:path";

/**
 * Sanitize error messages to prevent exposing system details
 */
export function sanitizeError(error) {
  const message = String(error?.message || error || "");
  
  // Don't expose file paths or system details
  if (message.includes("/tmp/") || message.includes("\\tmp\\")) {
    return "File processing failed";
  }
  if (message.includes("ENOENT")) {
    return "File not found";
  }
  if (message.includes("EACCES")) {
    return "Access denied";
  }
  if (message.includes("EISDIR")) {
    return "Invalid path";
  }
  if (message.includes("spawn ENOENT")) {
    return "Processing service unavailable";
  }
  
  // Allow specific validation errors
  if (message.includes("Invalid") || message.includes("out of bounds") || message.includes("between")) {
    return message;
  }
  
  // Generic fallback
  return "Operation failed. Please try again.";
}

/**
 * Validate DPI value
 */
export function validateDpi(dpi) {
  const parsed = Number(dpi);
  if (![72, 150, 300].includes(parsed)) {
    throw new Error("DPI must be 72, 150, or 300.");
  }
  return parsed;
}

/**
 * Validate quality value (0-100)
 */
export function validateQuality(quality) {
  const parsed = Number(quality);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
    throw new Error("Quality must be between 1 and 100.");
  }
  return parsed;
}

/**
 * Validate page range string
 */
export function validatePageRange(pageRangeStr) {
  const s = (pageRangeStr || "").trim().toLowerCase();
  if (s === "" || s === "all") {
    return "all";
  }
  // Basic validation - full validation happens in conversionWorker
  if (!/^[\d,\-\s]+$/.test(s)) {
    throw new Error("Invalid page range format. Use: 1,3,5-10");
  }
  return s;
}

/**
 * Verify file path is within base directory (prevent path traversal)
 */
export function verifyPathInBounds(filePath, baseDir) {
  const resolved = path.resolve(filePath);
  const resolvedBase = path.resolve(baseDir);
  
  if (!resolved.startsWith(resolvedBase)) {
    throw new Error("Invalid file path");
  }
  
  return resolved;
}

/**
 * Simple in-memory rate limiter (store in global for persistence across requests)
 */
const rateLimitStore = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

// Start cleanup interval
if (!globalThis.__rateLimitCleanupStarted) {
  globalThis.__rateLimitCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, { timestamp }] of rateLimitStore.entries()) {
      if (now - timestamp > 60 * 1000) {
        rateLimitStore.delete(key);
      }
    }
  }, CLEANUP_INTERVAL).unref();
}

/**
 * Check rate limit for IP address
 * Returns { allowed: boolean, remaining: number, resetAt: timestamp }
 */
export function checkRateLimit(ip, maxRequests = 100) {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute window
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + 60 * 1000 };
  }
  
  const record = rateLimitStore.get(ip);
  
  // Reset if window expired
  if (record.timestamp < windowStart) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + 60 * 1000 };
  }
  
  // Increment counter
  record.count += 1;
  
  const remaining = Math.max(0, maxRequests - record.count);
  return {
    allowed: record.count <= maxRequests,
    remaining,
    resetAt: record.timestamp + 60 * 1000,
  };
}

/**
 * Extract client IP from request
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
