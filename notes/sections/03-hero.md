---
beat: 2
component: CinemaBackdrop.jsx + HeroOverlay.jsx
status: done
type: section
updated: 2026-06-04
---

# Hero (scroll-scrubbed video)

Reworked into a **shared fixed backdrop** for seamless continuity. `CinemaBackdrop` is one `fixed z-0` canvas that scrubs the hero frames by scroll, then holds the last frame with gentle ambient drift. It lives behind both the hero and the [[04-champion-info]] overlays so the video flows into the champ-info background with no swap/snap/black-nav gap. Frames drawn with a 1.32x zoom to crop the source letterbox bars.

`HeroOverlay` is a transparent 300vh section (`id=top`) holding the chromatic title, which parallaxes away. An intro veil (0.62 dark) covers the first frame and fades on the first scroll.

Gotchas fixed: backdrop must be `z-0` with content `z-10` (a `-z-10` fixed canvas hides behind the opaque body background); run the scroll-map once on load so the veil/frame paint before the first scroll.
