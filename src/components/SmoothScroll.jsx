"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Don't re-run expensive trigger refreshes on every mobile URL-bar resize.
ScrollTrigger.config({ ignoreMobileResize: true });

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const rafBound = useRef(false);

  useEffect(() => {
    // Reduced motion: fall back to native scroll, no smoothing.
    if (prefersReduced()) {
      ScrollTrigger.refresh();
      return;
    }

    // Lerp smoothing (frame-rate independent) glides more evenly than
    // duration-easing under varying load — steadier scrub on the snowball.
    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 1.5,
    });

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    rafBound.current = onTick;

    // Publish the external Lenis instance to context consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    // Let sections register their triggers, then sync positions.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
