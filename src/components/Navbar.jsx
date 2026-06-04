"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks } from "@/lib/champion";
import { useLenis } from "./SmoothScroll";

export default function Navbar() {
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const fillRef = useRef(null);

  // Scroll progress (0 at top, 1 at page bottom) drives the navbar fill.
  // Written straight to a GPU transform (scaleX) — no React re-render per
  // frame — and synced to Lenis's own scroll tick so it stays buttery.
  useEffect(() => {
    const apply = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    };
    apply();
    if (lenis) {
      lenis.on("scroll", apply);
      window.addEventListener("resize", apply);
      return () => {
        lenis.off("scroll", apply);
        window.removeEventListener("resize", apply);
      };
    }
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          apply();
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, [lenis]);

  const go = (target) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-4">
      <nav className="holo-glass holo-nav relative flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-3">
        {/* scroll-progress fill: scaleX from the right edge, full at page bottom */}
        <div
          ref={fillRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-right"
          style={{
            transform: "scaleX(0)",
            willChange: "transform",
            background:
              "linear-gradient(90deg, oklch(0.86 0.13 200 / 0.34) 0%, oklch(0.8 0.12 175 / 0.22) 28%, oklch(0.7 0.16 300 / 0.13) 65%, oklch(0.72 0.18 340 / 0.05) 100%)",
          }}
        />
        <a
          href="#top"
          onClick={go("#top")}
          className="chromatic relative z-[1] font-display text-lg font-extrabold tracking-tight"
        >
          NUNU<span className="text-ice-cyan"> & </span>WILLUMP
        </a>

        <ul className="relative z-[1] hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.target}>
              <motion.a
                href={l.target}
                onClick={go(l.target)}
                className="ability-key relative block rounded-full px-4 py-2 text-sm tracking-wide text-frost-dim"
                whileHover={{ color: "oklch(0.96 0.01 230)" }}
                whileTap={{ scale: 0.96 }}
              >
                {/* hover halo, no underline / bottom border */}
                <motion.span
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{
                    background:
                      "color-mix(in oklch, var(--ice-cyan) 14%, transparent)",
                    boxShadow: "inset 0 0 0 1px oklch(0.85 0.13 200 / 0.25)",
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                {l.label}
              </motion.a>
            </li>
          ))}
        </ul>

        <button
          className="relative z-[1] grid h-11 w-11 place-items-center rounded-full text-frost md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className="absolute left-0 h-0.5 w-5 bg-frost transition-all"
              style={{ top: open ? 5 : 0, transform: open ? "rotate(45deg)" : "none" }}
            />
            <span
              className="absolute left-0 top-1.5 h-0.5 w-5 bg-frost transition-opacity"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="absolute left-0 h-0.5 w-5 bg-frost transition-all"
              style={{ top: open ? 5 : 11, transform: open ? "rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="holo-glass holo-nav absolute inset-x-4 top-20 flex flex-col gap-1 p-3 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {navLinks.map((l) => (
              <a
                key={l.target}
                href={l.target}
                onClick={go(l.target)}
                className="ability-key rounded-xl px-4 py-3 text-frost-dim hover:bg-ink-3/40 hover:text-frost"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
