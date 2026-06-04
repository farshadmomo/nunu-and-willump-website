"use client";

import { useEffect, useState } from "react";

// Ambient drifting snow. Generated after mount so server and client markup
// match (no random during render) and reduced-motion users get nothing extra.
export default function SnowParticles({ count = 38 }) {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    // Client-only random, set once on mount to avoid SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlakes(
      Array.from({ length: count }, (_, i) => {
        const size = 1 + Math.random() * 3;
        return {
          id: i,
          left: Math.random() * 100,
          size,
          delay: Math.random() * -12,
          duration: 9 + Math.random() * 12,
          drift: (Math.random() - 0.5) * 40,
          opacity: 0.25 + Math.random() * 0.5,
        };
      })
    );
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {flakes.map((f) => (
        <span
          key={f.id}
          className="absolute -top-4 rounded-full bg-frost"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `snow-fall ${f.duration}s linear ${f.delay}s infinite`,
            translate: `${f.drift}px 0`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
