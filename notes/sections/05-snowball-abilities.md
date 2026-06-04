---
beat: 4
component: SnowballSection.jsx + Snowball3D.jsx + AbilityCard.jsx
status: done
type: section
updated: 2026-06-04
---

# Snowball + Abilities

Pinned section, starts after the champ-info card. The snowball is now a **real 3D model** (`Snowball3D`, react-three-fiber) from `cotton_test_4`, rolling (rotation) + growing on scroll with a snow-particle spray. Ability loops reveal in sequence in `.holo-glass` frames, alternating sides: P Call of the Freljord (L), Q Consume (R), W Biggest Snowball Ever! (L), E Snowball Barrage (R), R Absolute Zero (center). A 2D whiteout finishes the screen cover and hands off to [[06-skins]].

**Performance gotchas (critical):** the raw glTF was 18MB / 5001 meshes (5001 draw calls = dead FPS). Fixed by optimizing offline with `@gltf-transform/cli optimize --compress quantize` → `public/models/snowball.glb` (706KB, GPU-instanced, ~2 draw calls, no decoder). Also: scale is capped (~2.0x) so the fuzzy strands never flood the screen (overdraw), the WebGL canvas is unmounted when the section is out of view, dpr=1, antialias off. Never `fetch()` the raw `.bin` (download managers like IDM grab it repeatedly).
