"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One fixed canvas that lives behind the hero AND the story sections, so the
// hero video scrubs and then flows into the champion-info background with no
// swap, snap, or black gap. Zoomed to crop any baked-in letterbox bars.
export default function CinemaBackdrop({ frames }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const veilRef = useRef(null);
  const framesRef = useRef(null);
  const drawRef = useRef(() => {});

  useEffect(() => {
    framesRef.current = frames && frames.length ? frames : null;
    drawRef.current();
  }, [frames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const ZOOM = 1.32; // crop letterbox + remove top/bottom black bars

    const sizeCanvas = () => {
      // capped: the full-frame blit runs every frame during the ambient hold,
      // so keep the pixel count modest for weak integrated GPUs.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    const drawFrame = (idx) => {
      const f = framesRef.current;
      if (!f) return;
      const img = f[Math.min(f.length - 1, Math.max(0, Math.round(idx)))];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw, dh;
      if (cr > ir) {
        dw = cw;
        dh = cw / ir;
      } else {
        dh = ch;
        dw = ch * ir;
      }
      dw *= ZOOM;
      dh *= ZOOM;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    // state shared between scroll handler and idle ticker
    const S = { mode: "scrub", last: 0, holdFrame: 0 };
    const redraw = () => drawFrame(S.last);
    drawRef.current = redraw;

    sizeCanvas();
    redraw();

    const onResize = () => {
      sizeCanvas();
      redraw();
    };
    window.addEventListener("resize", onResize);

    let st;
    const ctxGsap = gsap.context(() => {
      const heroEl = document.getElementById("top");
      const abEl = document.getElementById("abilities");

      if (reduced()) {
        const f = framesRef.current;
        S.last = f ? f.length - 1 : 0;
        redraw();
        gsap.set(veilRef.current, { opacity: 0 });
        return;
      }

      const update = (scroll) => {
        const f = framesRef.current;
        if (!f) return;
        const heroLen = heroEl.offsetHeight; // total hero scroll distance
        const abTop = abEl ? abEl.offsetTop : heroLen * 1.4;
        const lastFrame = f.length - 1;
        // The video finishes well before the card-info section. After this
        // point the last frame is held (paused) as the static background.
        const scrubEnd = heroLen * 0.7;

        const frame =
          scroll <= scrubEnd ? (scroll / scrubEnd) * lastFrame : lastFrame;
        if (Math.round(frame) !== Math.round(S.last)) {
          S.last = frame;
          drawFrame(frame);
        } else {
          S.last = frame;
        }

        // intro veil: starts almost black over the first frame, fades on scroll
        const veilP = gsap.utils.clamp(0, 1, scroll / (heroLen * 0.12));
        gsap.set(veilRef.current, { opacity: 0.92 * (1 - veilP) });

        // fade the whole backdrop out as the snowball section arrives
        const fadeStart = abTop - window.innerHeight * 0.6;
        const fadeP = gsap.utils.clamp(
          0,
          1,
          (scroll - fadeStart) / (abTop - fadeStart)
        );
        gsap.set(wrapRef.current, { opacity: 1 - fadeP });
      };

      st = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: () => "+=" + (abEl ? abEl.offsetTop : window.innerHeight * 4),
        invalidateOnRefresh: true,
        onUpdate: (self) => update(self.scroll()),
        onRefresh: (self) => update(self.scroll()),
      });
      update(window.scrollY || 0); // paint correct initial state
    }, wrapRef);

    return () => {
      window.removeEventListener("resize", onResize);
      ctxGsap.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 60%, transparent 42%, oklch(0.1 0.03 258 / 0.72) 100%)",
        }}
      />
      {/* intro veil: dark over the first frame, fades as you scroll */}
      <div
        ref={veilRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "oklch(0.05 0.02 260)", opacity: 0.92 }}
      />
    </div>
  );
}
