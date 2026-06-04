// Promise-based asset preloader. Decodes every hero frame + skin + ability
// cover before the loading screen lets the page in, so scroll-scrubbing and
// the skins carousel never hitch on a cold image. Reports 0..1 progress.

import { HERO_FRAME_COUNT, heroFrameSrc, skins, abilities, asset } from "./champion";
import { loadSnowballModel } from "./snowballModel";

export function buildAssetList() {
  const frames = Array.from({ length: HERO_FRAME_COUNT }, (_, i) =>
    heroFrameSrc(i + 1)
  );
  const skinImgs = skins.map((s) => asset(s.img));
  const covers = abilities.map((a) => asset(a.cover));
  return { frames, list: [...frames, ...skinImgs, ...covers] };
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve(img);
    img.onload = () => {
      // decode() avoids a paint-time stall the first time we draw it.
      if (img.decode) img.decode().then(done, done);
      else done();
    };
    img.onerror = done; // never block the loader on one bad asset
    img.src = src;
  });
}

// Preloads assets, calling onProgress(fraction) as each resolves.
// Returns the decoded hero frame <img> array (indexed 0..count-1).
//
// Only the hero frames + 3D model gate the loading screen: those are the only
// assets the very first scroll touches. Skins and ability covers warm in the
// background while the user is still on the hero, so the loader clears fast and
// nothing hitches once you scroll down to them.
export async function preloadAll(onProgress) {
  const { frames, list } = buildAssetList();
  const background = list.slice(frames.length); // skins + ability covers
  const cache = new Map();

  // Non-blocking: start warming below-the-fold images immediately.
  background.forEach((src) => loadImage(src));

  let loaded = 0;
  const total = frames.length + 1; // hero frames + 3D snowball model
  const bump = () => onProgress?.(Math.min(1, ++loaded / total));

  await Promise.all([
    ...frames.map((src) =>
      loadImage(src).then((img) => {
        cache.set(src, img);
        bump();
      })
    ),
    // parse the snowball glb now so it shows up instantly later
    loadSnowballModel().then(bump, bump),
  ]);

  return frames.map((src) => cache.get(src));
}
