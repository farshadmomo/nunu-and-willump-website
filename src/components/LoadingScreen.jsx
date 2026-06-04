"use client";

import { useEffect, useRef, useState } from "react";
import { preloadAll } from "@/lib/preloader";
import { useLenis } from "./SmoothScroll";

// Preloads every heavy asset behind a snowball that rolls along a line, growing
// as it goes, then resets to the left and rolls again. Wipes away at 100%.
export default function LoadingScreen({ onReady }) {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading -> reveal -> gone
  const started = useRef(false);

  useEffect(() => {
    document.body.style.overflow = phase === "gone" ? "" : "hidden";
    if (phase !== "gone") lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase, lenis]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;

    preloadAll((p) => !cancelled && setProgress(p)).then((frames) => {
      if (cancelled) return;
      onReady?.(frames);
      setProgress(1);
      setPhase("reveal");
      setTimeout(() => setPhase("gone"), 800);
    });

    return () => {
      cancelled = true;
    };
  }, [onReady]);

  if (phase === "gone") return null;

  const pct = Math.round(progress * 100);
  const revealing = phase === "reveal";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-500"
      style={{ opacity: revealing ? 0 : 1 }}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading the Freljord"
    >
      <p className="chromatic mb-12 font-display text-2xl font-extrabold tracking-tight">
        NUNU <span className="text-ice-cyan">&</span> WILLUMP
      </p>

      {/* the rolling line */}
      <div className="relative h-[60px] w-[min(560px,80vw)]">
        {/* track */}
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink-3" />
        {/* trail that fills as the ball rolls */}
        <div
          className="absolute left-0 top-1/2 h-px -translate-y-1/2"
          style={{
            background: "var(--iridescent)",
            opacity: 0.7,
            animation: "roll-trail 2.2s cubic-bezier(.45,.05,.55,.95) infinite",
          }}
        />
        {/* the growing snowball, rolling on TOP of the line */}
        <div
          className="absolute top-1/2"
          style={{
            transform: "translate(-50%,-100%)",
            animation: "roll-line 2.2s cubic-bezier(.45,.05,.55,.95) infinite",
          }}
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at 34% 30%, oklch(0.99 0.01 220) 0%, oklch(0.9 0.03 220) 45%, oklch(0.74 0.05 235) 80%, oklch(0.6 0.06 245) 100%)",
              boxShadow:
                "inset -6px -6px 12px oklch(0.5 0.06 250 / 0.55), 0 0 24px oklch(0.85 0.1 210 / 0.4)",
              animation: "roll-spin 2.2s linear infinite",
            }}
          />
          {/* snow flicked off the trailing side as it rolls */}
          <span className="loader-flake" style={{ animationDelay: "0s" }} />
          <span className="loader-flake" style={{ animationDelay: "0.28s", left: "9%" }} />
          <span className="loader-flake" style={{ animationDelay: "0.55s", left: "22%" }} />
        </div>
      </div>

      <div className="mt-10 text-center">
        <div className="ability-key text-3xl font-medium text-frost">{pct}%</div>
        <p className="ability-key mt-3 text-xs tracking-[0.35em] text-frost-dim">
          ROLLING THE SNOWBALL
        </p>
      </div>
    </div>
  );
}
