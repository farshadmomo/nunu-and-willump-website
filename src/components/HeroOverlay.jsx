"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { champion } from "@/lib/champion";

gsap.registerPlugin(ScrollTrigger);

// Transparent hero: provides the scroll distance for the backdrop scrub and
// holds the title, which parallaxes away as you scroll. 300vh of scrub room.
export default function HeroOverlay() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        yPercent: -26,
        opacity: 0,
        ease: "power1.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "55% top",
          scrub: 0.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="top" className="relative h-[300vh]">
      <div
        ref={titleRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-end px-6 pb-[14vh] text-center"
      >
        <p className="ability-key mb-4 text-xs tracking-[0.4em] text-ice-cyan sm:text-sm">
          {champion.region.toUpperCase()} • {champion.role.toUpperCase()}
        </p>
        <h1 className="chromatic prism-sweep font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          NUNU <span className="text-ice-cyan">&</span> WILLUMP
        </h1>
        <p className="mt-5 max-w-md font-body text-base text-frost-dim sm:text-lg">
          {champion.tagline}
        </p>
        <div className="ability-key mt-10 flex items-center gap-2 text-xs text-frost-dim">
          <span>SCROLL</span>
          <span className="inline-block h-8 w-px animate-pulse bg-frost-dim" />
        </div>
      </div>
    </section>
  );
}
