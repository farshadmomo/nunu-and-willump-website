"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skins, asset } from "@/lib/champion";

const tierLabel = { base: "Base", legacy: "Legacy", epic: "Epic" };

export default function SkinsSection() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const count = skins.length;
  const current = skins[active];
  const listRef = useRef(null);

  // Keep the highlighted name in view inside the (Lenis-exempt) list — so
  // selecting/arrowing through the longer names always reaches the bottom ones.
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const select = useCallback(
    (i) => {
      setDir(i > active ? 1 : -1);
      setActive(i);
    },
    [active]
  );
  const step = useCallback(
    (d) => {
      setDir(d);
      setActive((a) => (a + d + count) % count);
    },
    [count]
  );

  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <section
      id="skins"
      className="relative min-h-screen overflow-hidden bg-ink pb-16 pt-28"
      onKeyDown={onKey}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.96 0.02 215 / 0.55), transparent)",
        }}
      />

      <div className="relative mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[260px_1fr]">
        {/* typographic index */}
        <div className="order-2 lg:order-1">
          <p className="ability-key mb-5 text-xs tracking-[0.35em] text-ice-cyan">
            SKINS / {String(active + 1).padStart(2, "0")} — {count}
          </p>
          <ul
            ref={listRef}
            data-lenis-prevent
            className="flex max-h-[46vh] flex-col gap-0.5 overflow-y-auto overscroll-contain pr-2 lg:max-h-[60vh]"
            role="listbox"
            aria-label="Skin selector"
            tabIndex={0}
          >
            {skins.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.img} role="option" aria-selected={on} data-active={on}>
                  <button
                    onClick={() => select(i)}
                    className="flex w-full cursor-pointer items-baseline gap-3 py-1.5 text-left"
                  >
                    <span
                      className="ability-key text-[10px] tabular-nums"
                      style={{ color: on ? "var(--ice-cyan)" : "var(--ink-3)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display leading-tight ${
                        on
                          ? "iridescent-text text-2xl font-extrabold"
                          : "text-base font-semibold text-frost-dim"
                      }`}
                    >
                      {s.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* splash stage (static — selection drives an ice-wipe crossfade) */}
        <div className="order-1 lg:order-2">
          <h2 className="mb-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Choose a look
          </h2>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl holo-glass cracked-ice">
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.img
                key={current.img}
                src={asset(current.img)}
                alt={`${current.name} Nunu & Willump skin`}
                className="absolute inset-0 h-full w-full object-cover"
                custom={dir}
                initial={(d) => ({
                  opacity: 0,
                  clipPath:
                    d > 0
                      ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
                      : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                })}
                animate={{
                  opacity: 1,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
                draggable={false}
              />
            </AnimatePresence>

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 45%, oklch(0.1 0.03 258 / 0.92) 100%)",
              }}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div>
                <span className="ability-key rounded-full border border-ice-teal px-3 py-1 text-[11px] tracking-widest text-ice-cyan">
                  {tierLabel[current.tier] || current.tier}
                </span>
                <h3 className="mt-3 font-display text-3xl font-extrabold leading-none sm:text-5xl">
                  {current.name}
                </h3>
              </div>
              <span className="ability-key text-sm tabular-nums text-frost-dim">
                {String(active + 1).padStart(2, "0")} / {count}
              </span>
            </div>

            <button
              onClick={() => step(-1)}
              aria-label="Previous skin"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/40 text-frost backdrop-blur transition-colors hover:bg-ink/70"
            >
              ‹
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next skin"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/40 text-frost backdrop-blur transition-colors hover:bg-ink/70"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
