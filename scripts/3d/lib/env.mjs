import fs from "node:fs";
import path from "node:path";

// Load .env.local (KEY=VALUE per line) into process.env without overwriting
// existing vars. Safe no-op if the file is missing. No external deps.
export function loadEnvLocal() {
  const file = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}
