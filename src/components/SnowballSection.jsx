"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { abilities } from "@/lib/champion";
import AbilityCard from "./AbilityCard";

gsap.registerPlugin(ScrollTrigger);

const Snowball3D = dynamic(() => import("./Snowball3D"), { ssr: false });

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SnowballSection() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const whiteRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const progressRef = useRef(0);
  const activeRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Mount the WebGL snowball ONCE (on first approach) and never tear it down —
  // rebuilding the GL context mid-scroll stalls a frame (the lag you'd hit when
  // replay flings you back up past this section). Visibility only gates the
  // render loop (see activeRef), not the mount, so idle cost stays zero.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        activeRef.current = e.isIntersecting;
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "30% 0px 30% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const n = abilities.length;

    if (reduced()) {
      cardRefs.current.forEach(
        (c) => c && gsap.set(c, { opacity: 1, position: "static" })
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${n * 100 + 90}%`,
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            const active = Math.min(n - 1, Math.floor(self.progress * n));
            videoRefs.current.forEach((v, i) => {
              if (!v) return;
              if (i === active) {
                if (v.paused) v.play().catch(() => {});
              } else if (!v.paused) {
                v.pause();
              }
            });
          },
        },
      });

      // Ability frames reveal in sequence, alternating sides.
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const side = abilities[i].side;
        const fromX = side === "right" ? 60 : side === "left" ? -60 : 0;
        const at = i;
        tl.fromTo(
          card,
          { opacity: 0, x: fromX, y: side === "center" ? 40 : 0 },
          { opacity: 1, x: 0, y: 0, ease: "power2.out", duration: 0.45 },
          at
        );
        if (i < n - 1) {
          tl.to(
            card,
            { opacity: 0, x: -fromX * 0.5, ease: "power1.in", duration: 0.4 },
            at + 0.6
          );
        }
      });

      // Whiteout as the snowball engulfs the screen, handoff to skins.
      tl.fromTo(
        whiteRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "power2.in", duration: 0.7 },
        n - 0.55
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="abilities" className="relative bg-ink">
      <div
        ref={pinRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 30%, oklch(0.2 0.035 250) 0%, oklch(0.13 0.03 258) 70%)",
        }}
      >
        <p className="ability-key absolute left-1/2 top-24 z-[5] -translate-x-1/2 text-xs tracking-[0.4em] text-ice-cyan">
          ABILITIES
        </p>

        {/* 3D rolling snowball — only mounted while near view */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {mounted && (
            <Snowball3D progressRef={progressRef} activeRef={activeRef} />
          )}
        </div>

        {abilities.map((ability, i) => (
          <AbilityCard
            key={ability.key}
            ability={ability}
            ref={(el) => (cardRefs.current[i] = el)}
            videoRef={(el) => (videoRefs.current[i] = el)}
          />
        ))}

        {/* whiteout handoff to skins */}
        <div
          ref={whiteRef}
          className="pointer-events-none absolute inset-0 z-40 opacity-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.99 0.01 220) 0%, oklch(0.95 0.02 215) 60%, oklch(0.9 0.03 220) 100%)",
          }}
        />
      </div>
    </section>
  );
}
