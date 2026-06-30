import { describe, it, expect } from "vitest";
import { concatArgs, extractArgs } from "../lib/ffmpeg.mjs";

describe("ffmpeg arg builders", () => {
  it("concat uses the concat demuxer and copies", () => {
    expect(concatArgs("/w/list.txt", "/w/master.mp4")).toEqual(
      ["-y", "-f", "concat", "-safe", "0", "-i", "/w/list.txt", "-c", "copy", "/w/master.mp4"]
    );
  });
  it("extract sets fps and output pattern", () => {
    expect(extractArgs("/w/master.mp4", "/w/frames/%04d.png", 30)).toEqual(
      ["-y", "-i", "/w/master.mp4", "-vf", "fps=30", "/w/frames/%04d.png"]
    );
  });
});
