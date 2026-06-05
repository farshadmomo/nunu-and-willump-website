// Extract the hero video into a JPG frame sequence for canvas scroll-scrubbing.
// Run once: `npm run frames`. Requires ffmpeg on PATH.
//
// Output: public/hero_frames/frame_0001.jpg ...
// After running, update HERO_FRAME_COUNT in src/lib/champion.js to the printed count.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "public/hero video/videoplayback.webm");
const outDir = resolve(root, "public/hero_frames");

// Source is a 2-minute 1440p VP9 clip; the hero only uses the 0:55 -> 1:04
// segment. Extract at the source's native 24 fps (no resampling, no judder)
// over those 9s ~= 216 frames. 24 fps is cinema-smooth, so reducing from the
// old 255 frames is imperceptible while loading a touch lighter. 1280px wide
// is plenty for a background canvas and keeps the preload payload reasonable.
const START = "00:00:55"; // in-point
const DURATION = "9";      // seconds to capture (through 1:04)
const FPS = 24;
const WIDTH = 1280;
const QUALITY = 5; // ffmpeg -q:v, lower = better quality / bigger files

if (!existsSync(input)) {
  console.error(`Hero video not found at:\n  ${input}`);
  process.exit(1);
}

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

console.log(`Extracting frames with ffmpeg (${START} +${DURATION}s)...`);
execFileSync(
  "ffmpeg",
  [
    "-ss", START, // seek before -i: fast, decodes only the segment
    "-i", input,
    "-t", DURATION,
    "-vf", `scale=${WIDTH}:-1,fps=${FPS}`,
    "-q:v", String(QUALITY),
    resolve(outDir, "frame_%04d.jpg"),
  ],
  { stdio: "inherit" }
);

const count = readdirSync(outDir).filter((f) => f.endsWith(".jpg")).length;
console.log(`\nDone. ${count} frames written to public/hero_frames/`);
console.log(`>> Set HERO_FRAME_COUNT = ${count} in src/lib/champion.js`);
