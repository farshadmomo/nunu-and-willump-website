---
beat: 1
component: LoadingScreen.jsx
status: done
type: section
updated: 2026-06-04
---

# Loading

Fixed overlay. CSS snowball rolls + grows in a loop while the [[preloader]] runs. Real progress % in Martian Mono. At 100% the snowball does a final grow then a prism/iris wipe reveals the page. Guarantees no in-page lag because hero frames, skins, and ability video metadata are all decoded first.

Reduced-motion: skip the roll animation, show a static crystal + % then fade.
