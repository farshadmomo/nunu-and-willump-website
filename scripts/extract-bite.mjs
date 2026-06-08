// Extract the Remotion "frozen-maw" bite animation into a JPG frame sequence so
// the BiteTransition section can scroll-scrub it on a canvas (same pipeline as
// the hero). Run once: `npm run bite`. Requires ffmpeg on PATH.
//
// Source is the rendered clip from the sibling Remotion project
//   ../../motion design minimal/frozen-maw/out/frozen-maw.mp4
// (1280x720, 30fps, 92 frames). The whole clip is kept: maw opens -> violent
// SNAP -> camera dives through the fangs -> the maw fades to dark ink (before
// the dive overshoots and the teeth swing back into view). The host
// BiteTransition crossfades that dark tail into the EndingScreen behind it, so
// it looks like the footer was waiting behind the mouth the whole time.
//
// Output: public/bite_frames/frame_0001.jpg ... frame_0092.jpg
// After running, set BITE_FRAME_COUNT in src/lib/champion.js to the printed count.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input =
  process.env.BITE_SRC ||
  resolve(root, "../../motion design minimal/frozen-maw/out/frozen-maw.mp4");
const outDir = resolve(root, "public/bite_frames");

const FRAMES = 92; // whole clip: bite -> snap -> dive -> fade to dark ink
const WIDTH = 1280;
const QUALITY = 4; // ffmpeg -q:v, lower = better; fast motion wants a touch more

if (!existsSync(input)) {
  console.error(`Bite source not found at:\n  ${input}`);
  process.exit(1);
}

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

console.log(`Extracting ${FRAMES} bite frames with ffmpeg...`);
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-i", input,
    "-vf", `scale=${WIDTH}:-1`,
    "-frames:v", String(FRAMES),
    "-q:v", String(QUALITY),
    resolve(outDir, "frame_%04d.jpg"),
  ],
  { stdio: "inherit" }
);

const count = readdirSync(outDir).filter((f) => f.endsWith(".jpg")).length;
console.log(`\nDone. ${count} frames written to public/bite_frames/`);
console.log(`>> Set BITE_FRAME_COUNT = ${count} in src/lib/champion.js`);
