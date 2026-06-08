"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BITE_FRAME_COUNT, biteFrameSrc } from "@/lib/champion";
import EndingScreen from "./EndingScreen";

gsap.registerPlugin(ScrollTrigger);

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Willump's bite, then the reveal. The frozen-maw clip (a Remotion + Three.js
// render) is scroll-scrubbed on a canvas: the icy maw gapes, the fangs SNAP, the
// camera dives through them and the view fades to dark ink. The EndingScreen sits
// BEHIND the canvas the whole time, so crossfading the dark tail away makes it
// look like the footer was waiting behind the mouth all along.
export default function BiteTransition() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const darkRef = useRef(null);
  const framesRef = useRef(null);
  const progRef = useRef(0);
  const drawRef = useRef(() => {});
  const [ready, setReady] = useState(false);

  // Decode every bite frame up front so the scrub never hitches on a cold image.
  useEffect(() => {
    let alive = true;
    const srcs = Array.from({ length: BITE_FRAME_COUNT }, (_, i) =>
      biteFrameSrc(i + 1)
    );
    const imgs = new Array(srcs.length);
    let done = 0;
    srcs.forEach((src, i) => {
      const img = new Image();
      const fin = () => {
        if (!alive) return;
        imgs[i] = img;
        if (++done === srcs.length) {
          framesRef.current = imgs;
          setReady(true);
        }
      };
      img.onload = () => (img.decode ? img.decode().then(fin, fin) : fin());
      img.onerror = fin;
      img.src = src;
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    const draw = () => {
      const f = framesRef.current;
      if (!f || !f.length) return;
      const idx = Math.min(
        f.length - 1,
        Math.max(0, Math.round(progRef.current * (f.length - 1)))
      );
      const img = f[idx];
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
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };
    drawRef.current = draw;

    sizeCanvas();
    draw();

    if (reduced()) {
      // No scrub: skip straight to the revealed ending.
      gsap.set(canvas, { opacity: 0 });
      gsap.set(darkRef.current, { opacity: 0 });
      return;
    }

    // start dark (matches the section) with the maw hidden, then fade it in
    gsap.set(canvas, { opacity: 0 });
    gsap.set(darkRef.current, { opacity: 1 });

    const ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=240%",
        scrub: 1, // smoother glide so the teeth ease in as you scroll
        pin: pinRef.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          progRef.current = p;
          draw();
          // maw fades up out of the dark as you scroll in (no instant pop)...
          const inP = gsap.utils.clamp(0, 1, p / 0.1);
          // ...then the dark tail + backdrop fade away to reveal the ending.
          const outP = gsap.utils.clamp(0, 1, (p - 0.86) / 0.14);
          gsap.set(canvas, { opacity: inP * (1 - outP) });
          gsap.set(darkRef.current, { opacity: 1 - outP });
        },
        onRefresh: () => {
          sizeCanvas();
          draw();
        },
      });
    }, root);

    return () => ctxGsap.revert();
  }, []);

  // Frames may finish decoding while we're already parked here — repaint once.
  useEffect(() => {
    if (ready) drawRef.current();
  }, [ready]);

  return (
    <section ref={root} id="end" className="relative bg-ink">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-ink">
        {/* the footer/ending, waiting behind the mouth */}
        <div className="absolute inset-0">
          <EndingScreen />
        </div>

        {/* dark backdrop: hides the ending while the maw fades in/out over it */}
        <div
          ref={darkRef}
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--ink)" }}
          aria-hidden
        />

        {/* the maw — fades up from the dark, then crossfades out to reveal the ending */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        />
      </div>
    </section>
  );
}
