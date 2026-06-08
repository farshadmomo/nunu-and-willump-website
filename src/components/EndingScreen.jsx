"use client";

import { motion } from "motion/react";
import { champion } from "@/lib/champion";
import { useLenis } from "./SmoothScroll";

export default function EndingScreen() {
  const lenis = useLenis();

  const replay = () => {
    if (lenis)
      lenis.scrollTo(0, {
        duration: 3.6, // long, unhurried ride back to the start
        easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic: soft settle
        force: true,
      });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      className="relative grid min-h-screen place-items-center overflow-hidden px-6"
      style={{ background: "oklch(0.08 0.02 260)" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--iridescent)" }}
        />
      </div>

      <motion.div
        className="relative max-w-2xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="ability-key text-xs tracking-[0.4em] text-ice-cyan">
          THE BOY AND HIS YETI
        </p>
        <blockquote className="prism-sweep mt-6 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
          <span className="iridescent-text">&ldquo;{champion.endingQuote}&rdquo;</span>
        </blockquote>
        <p className="mx-auto mt-8 max-w-md font-body text-frost-dim">
          Somewhere out there, a mother waits. Until then, they keep rolling.
        </p>

        <button
          onClick={replay}
          className="ability-key mt-12 inline-flex items-center gap-3 rounded-full holo-glass px-7 py-4 text-sm tracking-widest text-frost transition-transform hover:scale-[1.03] active:scale-95"
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: "var(--iridescent)" }}
          />
          REPLAY THE JOURNEY
        </button>

        <p className="ability-key mt-14 text-[10px] tracking-widest text-frost-dim/70">
          FAN TRIBUTE • NOT AFFILIATED WITH RIOT GAMES
        </p>
      </motion.div>
    </section>
  );
}
