"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { champion, asset } from "@/lib/champion";

gsap.registerPlugin(ScrollTrigger);

// Champion info. Transparent: it sits on the shared CinemaBackdrop so the hero
// video continues seamlessly into this section's background.
export default function StoryOverlay() {
  const root = useRef(null);
  const renderRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(renderRef.current, {
        yPercent: 16,
        opacity: 0,
        ease: "power3.out",
        duration: 1.1,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(panelRef.current.querySelectorAll("[data-stagger]"), {
        y: 26,
        opacity: 0,
        ease: "power3.out",
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="story"
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-8 px-6 pb-16 pt-32 md:grid-cols-2 md:pb-24">
        {/* champion render placeholder, swap for transparent PNG later */}
        <div
          ref={renderRef}
          className="relative mx-auto aspect-[3/4] w-full max-w-sm self-end md:mx-0"
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundImage: `url(${asset("/skins/nunu & willump default.jpg")})`,
              backgroundSize: "cover",
              backgroundPosition: "top center",
              WebkitMaskImage:
                "radial-gradient(120% 100% at 50% 40%, #000 55%, transparent 100%)",
              maskImage:
                "radial-gradient(120% 100% at 50% 40%, #000 55%, transparent 100%)",
              filter: "drop-shadow(0 30px 50px oklch(0.05 0.04 260 / 0.7))",
              animation: "float-soft 6s ease-in-out infinite",
            }}
          />
          <span className="ability-key absolute bottom-2 left-2 rounded-full bg-ink/60 px-3 py-1 text-[10px] tracking-widest text-frost-dim backdrop-blur">
            RENDER PLACEHOLDER
          </span>
        </div>

        <div ref={panelRef} className="holo-glass cracked-ice p-7 md:p-9">
          <p data-stagger className="ability-key text-xs tracking-[0.35em] text-ice-cyan">
            {champion.title.toUpperCase()}
          </p>
          <h2
            data-stagger
            className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl"
          >
            {champion.name}
          </h2>

          <div data-stagger className="mt-5 flex flex-wrap gap-2">
            {champion.role.split(" / ").map((r) => (
              <span
                key={r}
                className="ability-key rounded-full border border-ink-3 px-3 py-1 text-xs text-frost"
              >
                {r}
              </span>
            ))}
            <span className="ability-key rounded-full border border-ink-3 px-3 py-1 text-xs text-frost">
              {champion.region}
            </span>
          </div>

          <p
            data-stagger
            className="mt-6 max-w-prose font-body text-[15px] leading-relaxed text-frost-dim"
          >
            {champion.lore}
          </p>

          <div data-stagger className="mt-7 flex items-center gap-3">
            <span className="ability-key text-xs tracking-widest text-frost-dim">
              DIFFICULTY
            </span>
            <span
              className="flex gap-1.5"
              aria-label={`Difficulty ${champion.difficulty} of ${champion.difficultyMax}`}
            >
              {Array.from({ length: champion.difficultyMax }).map((_, i) => (
                <span
                  key={i}
                  className="h-4 w-4 rotate-45 rounded-[3px]"
                  style={{
                    background:
                      i < champion.difficulty ? "var(--iridescent)" : "transparent",
                    border: "1px solid var(--ice-teal)",
                    opacity: i < champion.difficulty ? 1 : 0.4,
                  }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
