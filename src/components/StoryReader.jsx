"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { asset } from "@/lib/champion";
import { useLenis } from "./SmoothScroll";

// fetched raw text cached so re-opening a tale is instant
const rawCache = new Map();

async function loadStory(file) {
  if (rawCache.has(file)) return rawCache.get(file);
  const res = await fetch(asset(file));
  const raw = await res.text();
  rawCache.set(file, raw);
  return raw;
}

// Split into paragraphs and drop the leading title line(s). Handles the source
// quirk where story2 repeats its title ("STONE COLD" / "STONE COLD 1").
function parse(raw, title) {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const up = title.toUpperCase();
  while (lines.length) {
    const head = lines[0].toUpperCase().replace(/\s+\d+$/, "");
    if (head === up) lines.shift();
    else break;
  }
  return lines;
}

const isQuote = (s) => /^["“”']/.test(s);

// Immersive reading overlay. Takes a normalized `piece`:
//   { kicker, title, cover, coverEnd?, paragraphs?, file?, pullQuote? }
// If `paragraphs` is present it renders immediately (biography); otherwise the
// text is fetched from `file` (the two stories). Page scroll is locked via Lenis
// while open so only the panel scrolls.
export default function StoryReader({ piece, onClose }) {
  const lenis = useLenis();
  // fetched text, tagged with its file so we never show a stale story's body
  const [fetched, setFetched] = useState({ file: null, lines: null });
  const scrollRef = useRef(null);
  const closeRef = useRef(null);

  // Derived render state — no synchronous setState in effects. Biography ships
  // its paragraphs inline; stories use the fetched copy once it matches.
  const lines = piece?.paragraphs
    ? piece.paragraphs
    : fetched.file === piece?.file
      ? fetched.lines
      : null;
  const loading = !!piece && !piece.paragraphs && lines === null;

  // lock background scroll, reset to top, wire escape/focus while open
  useEffect(() => {
    if (!piece) return;
    lenis?.stop();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [piece, lenis, onClose]);

  // fetch story bodies on demand (skipped for the inline biography / cache hits)
  useEffect(() => {
    if (!piece || piece.paragraphs || fetched.file === piece.file) return;
    let alive = true;
    loadStory(piece.file)
      .then((raw) => {
        if (alive) setFetched({ file: piece.file, lines: parse(raw, piece.title) });
      })
      .catch(() => {
        if (alive)
          setFetched({
            file: piece.file,
            lines: ["The tale could not be summoned right now."],
          });
      });
    return () => {
      alive = false;
    };
  }, [piece, fetched.file]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {piece && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center p-4 sm:p-6"
          style={{
            background: "oklch(0.05 0.02 260 / 0.74)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={`${piece.title}, ${piece.kicker.toLowerCase()}`}
        >
          <motion.article
            className="holo-glass relative flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* banner */}
            <div className="relative h-44 shrink-0 overflow-hidden sm:h-56">
              <img
                src={asset(piece.cover)}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.08 0.03 258 / 0.25) 0%, transparent 35%, oklch(0.13 0.03 258 / 0.96) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="ability-key text-[11px] tracking-[0.4em] text-ice-cyan">
                  {piece.kicker}
                </p>
                <h2 className="mt-2 font-display text-3xl font-extrabold leading-none text-frost sm:text-4xl">
                  {piece.title}
                </h2>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close reader"
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-ink/55 text-frost backdrop-blur transition-colors hover:bg-ink/80"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* body */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain px-6 py-7 sm:px-9 sm:py-8"
            >
              {loading || !lines ? (
                <p className="ability-key animate-pulse text-sm tracking-widest text-frost-dim">
                  SUMMONING THE TALE…
                </p>
              ) : (
                <div className="space-y-4">
                  {lines.map((p, i) => (
                    <p
                      key={i}
                      className={
                        isQuote(p)
                          ? "border-l-2 border-ice-teal/60 pl-4 font-body text-[15px] italic leading-relaxed text-frost"
                          : "font-body text-[15px] leading-relaxed text-frost-dim"
                      }
                    >
                      {p}
                    </p>
                  ))}

                  {piece.pullQuote && (
                    <blockquote className="mt-7 border-l-2 border-ice-cyan/70 pl-5">
                      <p className="font-display text-lg font-bold leading-snug text-frost">
                        “{piece.pullQuote.text}”
                      </p>
                      <cite className="ability-key mt-2 block text-[11px] not-italic tracking-widest text-ice-cyan">
                        — {piece.pullQuote.by}
                      </cite>
                    </blockquote>
                  )}

                  {piece.coverEnd && (
                    <figure className="mt-8 overflow-hidden rounded-xl">
                      <img
                        src={asset(piece.coverEnd)}
                        alt={`${piece.title} closing scene`}
                        className="h-auto w-full"
                        loading="lazy"
                        draggable={false}
                      />
                    </figure>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
