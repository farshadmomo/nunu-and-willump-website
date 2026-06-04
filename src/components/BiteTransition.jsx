"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Willump takes a bite: shake, claw slash, white flash, cut to black.
// Placeholder SVG art, swap real bite frames later.
export default function BiteTransition() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const shakeRef = useRef(null);
  const flashRef = useRef(null);
  const blackRef = useRef(null);
  const clawRef = useRef(null);

  useEffect(() => {
    const paths = clawRef.current
      ? Array.from(clawRef.current.querySelectorAll("path"))
      : [];

    if (reduced()) {
      gsap.set(blackRef.current, { opacity: 1 });
      gsap.set(paths, { strokeDashoffset: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=140%",
          scrub: 0.4,
          pin: pinRef.current,
          anticipatePin: 1,
        },
      });

      // tension shake
      tl.to(shakeRef.current, {
        keyframes: {
          x: [0, -8, 7, -5, 4, 0],
          y: [0, 5, -6, 4, -3, 0],
        },
        duration: 0.35,
        ease: "none",
      });
      // claw slash draws
      tl.to(
        paths,
        { strokeDashoffset: 0, opacity: 1, stagger: 0.06, duration: 0.25, ease: "power2.in" },
        0.3
      );
      // white flash
      tl.to(flashRef.current, { opacity: 1, duration: 0.08 }, 0.5)
        .to(flashRef.current, { opacity: 0, duration: 0.22 }, 0.58);
      // cut to black, hold
      tl.to(blackRef.current, { opacity: 1, duration: 0.3, ease: "power2.in" }, 0.6);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-ink">
      <div
        ref={pinRef}
        className="relative grid h-screen w-full place-items-center overflow-hidden"
      >
        <div ref={shakeRef} className="text-center will-change-transform">
          <p className="ability-key text-xs tracking-[0.45em] text-ice-cyan">
            WILLUMP IS HUNGRY
          </p>
          <p className="mt-4 font-display text-2xl font-bold text-frost-dim sm:text-3xl">
            nom.
          </p>
        </div>

        {/* claw slashes */}
        <svg
          ref={clawRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {[18, 42, 66].map((x, i) => (
            <path
              key={i}
              d={`M${x} -5 L${x - 12} 105`}
              pathLength="1"
              fill="none"
              stroke="oklch(0.97 0.02 215)"
              strokeWidth="0.6"
              opacity="0"
              style={{ filter: "drop-shadow(0 0 4px oklch(0.85 0.13 200))" }}
            />
          ))}
        </svg>

        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: "oklch(0.99 0.005 220)" }}
        />
        <div
          ref={blackRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ background: "oklch(0.08 0.02 260)" }}
        />
      </div>
    </section>
  );
}
