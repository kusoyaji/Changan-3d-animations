import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

export function concatArgs(listFile, outPath) {
  return ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outPath];
}
export function extractArgs(inPath, outPattern, fps) {
  return ["-y", "-i", inPath, "-vf", `fps=${fps}`, outPattern];
}
export function run(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}
