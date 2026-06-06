"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { biography, stories, asset } from "@/lib/champion";
import StoryReader from "./StoryReader";

gsap.registerPlugin(ScrollTrigger);

// Tales of the Freljord. Sits between the champion-info card and the snowball
// section, transparent so it shares the same held hero-frame background drawn by
// CinemaBackdrop (which fades out only once #abilities arrives). One featured
// biography + two story cards; each opens the immersive StoryReader so the page
// itself never becomes a wall of text.
export default function StoriesSection() {
  const root = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-tale-reveal]", {
        y: 30,
        opacity: 0,
        ease: "power3.out",
        duration: 0.85,
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
    }, root);
    // section changes page height -> let CinemaBackdrop recompute its fade.
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="tales"
      className="relative z-20 py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        {/* header */}
        <div data-tale-reveal className="max-w-2xl">
          <p className="ability-key text-xs tracking-[0.4em] text-ice-cyan">
            TALES OF THE FRELJORD
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Songs worth remembering
          </h2>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-frost-dim">
            A boy who would be a hero, a yeti who forgot his own name, and a
            mother whose song still drifts on the wind. Read the legend, then
            two tales from the road.
          </p>
        </div>

        {/* featured biography */}
        <button
          data-tale-reveal
          onClick={() => setActive(biography)}
          aria-label={`Read the biography, ${biography.title}`}
          className="holo-glass cracked-ice group mt-12 grid w-full overflow-hidden rounded-[22px] text-left transition-transform duration-300 will-change-transform hover:-translate-y-1 md:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="order-2 flex flex-col justify-center p-8 sm:p-10 md:order-1">
            <p className="ability-key text-[11px] tracking-[0.4em] text-ice-cyan">
              {biography.kicker}
            </p>
            <h3 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              {biography.title}
            </h3>
            <p className="mt-4 max-w-prose font-body text-[15px] leading-relaxed text-frost-dim">
              {biography.excerpt}
            </p>
            <span className="ability-key mt-7 inline-flex items-center gap-2 text-sm tracking-wide text-frost transition-colors group-hover:text-ice-cyan">
              Read the full biography
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                ›
              </span>
            </span>
          </div>

          <div className="relative order-1 min-h-[220px] overflow-hidden md:order-2 md:min-h-full">
            <img
              src={asset(biography.cover)}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              draggable={false}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.16 0.03 255 / 0.95) 0%, transparent 55%), linear-gradient(180deg, transparent 60%, oklch(0.13 0.03 258 / 0.7) 100%)",
              }}
            />
          </div>
        </button>

        {/* two story cards */}
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {stories.map((s) => (
            <button
              key={s.id}
              data-tale-reveal
              onClick={() => setActive(s)}
              aria-label={`Read the tale, ${s.title}`}
              className="holo-glass group flex flex-col overflow-hidden rounded-[22px] text-left transition-transform duration-300 will-change-transform hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={asset(s.cover)}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  draggable={false}
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.08 0.03 258 / 0.15) 0%, transparent 30%, oklch(0.14 0.03 258 / 0.92) 100%)",
                  }}
                />
                <span className="ability-key absolute left-5 top-5 rounded-full border border-ice-teal/70 bg-ink/45 px-3 py-1 text-[10px] tracking-[0.3em] text-ice-cyan backdrop-blur">
                  {s.kicker}
                </span>
                <h3 className="absolute inset-x-5 bottom-4 font-display text-3xl font-extrabold leading-none text-frost">
                  {s.title}
                </h3>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="font-body text-[15px] leading-relaxed text-frost-dim">
                  {s.blurb}
                </p>
                <span className="ability-key mt-6 inline-flex items-center gap-2 text-sm tracking-wide text-frost transition-colors group-hover:text-ice-cyan">
                  Read the tale
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    ›
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <StoryReader piece={active} onClose={() => setActive(null)} />
    </section>
  );
}
