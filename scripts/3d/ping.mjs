import { getFal } from "./lib/fal.mjs";

// Confirms FAL_KEY is loaded and the client is configured. Does NOT spend:
// it only initializes the client and prints a masked confirmation.
const fal = getFal();
const key = process.env.FAL_KEY || "";
const masked = key.length > 8 ? key.slice(0, 4) + "…" + key.slice(-2) : "(short)";
console.log("fal client configured. FAL_KEY loaded:", masked, "| length:", key.length);
console.log("client.subscribe is", typeof fal.subscribe === "function" ? "available" : "MISSING");
