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
const input = resolve(root, "public/hero video/nunu and willump hero video.mp4");
const outDir = resolve(root, "public/hero_frames");

// Tuning: 25 fps over a 10.2s clip ~= 255 frames. 1280px wide is plenty for a
// background canvas and keeps the preload payload reasonable.
const FPS = 25;
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

console.log("Extracting frames with ffmpeg...");
execFileSync(
  "ffmpeg",
  [
    "-i", input,
    "-vf", `scale=${WIDTH}:-1,fps=${FPS}`,
    "-q:v", String(QUALITY),
    resolve(outDir, "frame_%04d.jpg"),
  ],
  { stdio: "inherit" }
);

const count = readdirSync(outDir).filter((f) => f.endsWith(".jpg")).length;
console.log(`\nDone. ${count} frames written to public/hero_frames/`);
console.log(`>> Set HERO_FRAME_COUNT = ${count} in src/lib/champion.js`);
