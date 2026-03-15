import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const cpuCount = os.cpus().length;
const defaultConcurrency = Math.min(4, Math.max(1, cpuCount - 1));
const workerConcurrency = Math.max(
  1,
  Number.parseInt(process.env.PY_WORKER_CONCURRENCY || String(defaultConcurrency), 10) ||
    defaultConcurrency
);
const workerTimeoutMs = Math.max(
  10_000,
  Number.parseInt(process.env.PY_WORKER_TIMEOUT_MS || "300000", 10) || 300000
);

let activeWorkers = 0;
const pendingResolvers = [];

function resolvePythonExecutable() {
  const venvPython = path.join(process.cwd(), ".venv", "bin", "python");
  return venvPython;
}

async function acquireWorkerSlot() {
  if (activeWorkers < workerConcurrency) {
    activeWorkers += 1;
    return;
  }

  await new Promise((resolve) => {
    pendingResolvers.push(resolve);
  });
  activeWorkers += 1;
}

function releaseWorkerSlot() {
  activeWorkers = Math.max(0, activeWorkers - 1);
  const next = pendingResolvers.shift();
  if (next) {
    next();
  }
}

export async function runConversionWorker(command, payload) {
  await acquireWorkerSlot();

  const pythonExec = resolvePythonExecutable();
  const workerPath = path.join(process.cwd(), "scripts", "conversion_worker.py");

  try {
    return await new Promise((resolve, reject) => {
      const proc = spawn(pythonExec, [workerPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let settled = false;

      const timeout = setTimeout(() => {
        proc.kill("SIGKILL");
        if (!settled) {
          settled = true;
          reject(
            new Error(
              `Conversion worker timed out after ${workerTimeoutMs}ms for command '${command}'.`
            )
          );
        }
      }, workerTimeoutMs);

      proc.stdout.setEncoding("utf8");
      proc.stderr.setEncoding("utf8");

      proc.stdout.on("data", (chunk) => {
        stdout += chunk;
      });

      proc.stderr.on("data", (chunk) => {
        stderr += chunk;
      });

      proc.on("error", (error) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Failed to run conversion worker: ${error.message}`));
      });

      proc.on("close", (code) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeout);

        const out = stdout.trim();
        const err = stderr.trim();

        if (!out) {
          reject(new Error(err || `Conversion worker exited with code ${code ?? "unknown"}.`));
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(out);
        } catch (_e) {
          reject(new Error(`Invalid worker output: ${out}`));
          return;
        }

        if (!parsed.ok) {
          reject(new Error(parsed.error || err || "Worker failed."));
          return;
        }

        resolve(parsed.result);
      });

      proc.stdin.write(JSON.stringify({ command, payload }));
      proc.stdin.end();
    });
  } finally {
    releaseWorkerSlot();
  }
}
