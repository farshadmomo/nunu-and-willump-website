"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { skins, asset } from "@/lib/champion";

const tierLabel = { base: "Base", legacy: "Legacy", epic: "Epic" };

function Plus() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ down }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ transform: down ? "rotate(180deg)" : "none" }}
    >
      <path
        d="M3 10l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Skins browser modeled on Skiper UI's "Apple Feature Block" (skiper76): an
// accordion pill list where the active item expands into a title + description
// card, paired with a large splash that crossfades to match. Re-themed from the
// original black/gray into the site's holo-iridescent ice glass.
export default function SkinsSection() {
  const [active, setActive] = useState(0);
  const count = skins.length;
  const current = skins[active];
  const listRef = useRef(null);

  // keep the expanded skin in view inside the (Lenis-exempt) scrolling list
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const select = useCallback((i) => setActive(i), []);
  const step = useCallback(
    (d) => setActive((a) => (a + d + count) % count),
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

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <p className="ability-key mb-2 text-xs tracking-[0.4em] text-ice-cyan">
          SKINS / {String(active + 1).padStart(2, "0")} — {count}
        </p>
        <h2 className="mb-8 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Choose a look
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(280px,360px)_1fr]">
          {/* accordion list + carousel chevrons */}
          <div className="order-2 flex gap-3 lg:order-1">
            <div className="flex flex-col justify-center gap-2">
              <button
                onClick={() => step(-1)}
                aria-label="Previous skin"
                className="holo-glass grid h-10 w-10 place-items-center rounded-full text-frost transition-colors hover:text-ice-cyan"
              >
                <Chevron />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next skin"
                className="holo-glass grid h-10 w-10 place-items-center rounded-full text-frost transition-colors hover:text-ice-cyan"
              >
                <Chevron down />
              </button>
            </div>

            <ul
              ref={listRef}
              data-lenis-prevent
              role="listbox"
              aria-label="Skin selector"
              tabIndex={0}
              className="flex max-h-[58vh] flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pr-1"
            >
              {skins.map((s, i) => {
                const on = i === active;
                return (
                  <motion.li
                    layout
                    key={s.img}
                    role="option"
                    aria-selected={on}
                    data-active={on}
                    transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    className="list-none"
                  >
                    <button
                      onClick={() => select(i)}
                      className={`group flex w-full items-start gap-3 text-left transition-colors ${
                        on
                          ? "holo-glass rounded-2xl px-5 py-4"
                          : "rounded-2xl px-4 py-3"
                      }`}
                      style={
                        on
                          ? undefined
                          : {
                              background:
                                "color-mix(in oklch, var(--ink-2) 42%, transparent)",
                            }
                      }
                    >
                      {!on && (
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ice-teal/50 text-ice-cyan transition-colors group-hover:bg-ice-cyan/10">
                          <Plus />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        {on && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="ability-key block text-[10px] tracking-[0.3em] text-ice-cyan"
                          >
                            {tierLabel[s.tier] || s.tier}
                          </motion.span>
                        )}
                        <span
                          className={`block font-display leading-tight ${
                            on
                              ? "mt-1 text-2xl font-extrabold text-frost"
                              : "text-base font-semibold text-frost-dim group-hover:text-frost"
                          }`}
                        >
                          {s.name}
                        </span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-2 font-body text-sm leading-relaxed text-frost-dim"
                            >
                              {s.blurb}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* splash stage — crossfades + settles on selection */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl holo-glass cracked-ice">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={current.img}
                  src={asset(current.img)}
                  alt={`${current.name} skin`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
