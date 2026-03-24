import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

const globalKey = "__swift_convert_sessions__";
const state = globalThis[globalKey] || {
  sessions: new Map(),
  cleanupStarted: false,
};

globalThis[globalKey] = state;

async function cleanupExpired() {
  const now = Date.now();
  for (const [sessionId, meta] of state.sessions.entries()) {
    if (now - meta.createdAt > SESSION_TTL_MS) {
      state.sessions.delete(sessionId);
      if (meta.dir) {
        try {
          await fs.rm(meta.dir, { recursive: true, force: true });
        } catch (err) {
          console.error(`[sessionStore] Failed to cleanup ${meta.dir}:`, err.message);
        }
      }
    }
  }
}

if (!state.cleanupStarted) {
  state.cleanupStarted = true;
  setInterval(() => cleanupExpired().catch(console.error), 60 * 1000).unref();
}

export function createSession(dir, extra = {}) {
  const sessionId = randomUUID().replace(/-/g, "");
  state.sessions.set(sessionId, {
    dir,
    createdAt: Date.now(),
    ...extra,
  });
  return sessionId;
}

export function getSession(sessionId) {
  const meta = state.sessions.get(sessionId);
  if (!meta) {
    return null;
  }
  if (Date.now() - meta.createdAt > SESSION_TTL_MS) {
    state.sessions.delete(sessionId);
    if (meta.dir) {
      void fs.rm(meta.dir, { recursive: true, force: true });
    }
    return null;
  }
  return meta;
}
