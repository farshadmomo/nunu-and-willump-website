"use client";

import { forwardRef } from "react";
import { asset } from "@/lib/champion";

const sidePos = {
  left: "left-4 sm:left-10 top-1/2 -translate-y-1/2 items-start text-left",
  right: "right-4 sm:right-10 top-1/2 -translate-y-1/2 items-end text-right",
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center",
};

// Presentational ability frame: looping ability clip + label.
const AbilityCard = forwardRef(function AbilityCard(
  { ability, videoRef },
  ref
) {
  return (
    <div
      ref={ref}
      className={`absolute z-20 flex w-[78%] max-w-sm flex-col gap-3 opacity-0 ${
        sidePos[ability.side] || sidePos.left
      }`}
    >
      <div className="holo-glass overflow-hidden p-2">
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-xl object-cover"
          src={asset(ability.video)}
          poster={asset(ability.cover)}
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      {/* Dark frosted plate keeps copy legible even when the snowball
          whites out the background behind it. */}
      <div
        className={`flex max-w-xs flex-col gap-1 rounded-2xl px-4 py-3 ${
          ability.side === "right"
            ? "items-end text-right"
            : ability.side === "center"
              ? "items-center text-center"
              : "items-start text-left"
        }`}
        style={{
          background: "color-mix(in oklch, var(--ink) 78%, transparent)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 8px 30px -12px oklch(0.05 0.04 260 / 0.7)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="ability-key grid h-7 w-7 place-items-center rounded-md border border-ice-cyan bg-ice-cyan/10 text-xs font-semibold text-ice-cyan">
            {ability.key}
          </span>
          <h3
            className="font-display text-xl font-bold"
            style={{ color: "oklch(0.92 0.07 205)" }}
          >
            {ability.name}
          </h3>
        </div>
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: "oklch(0.86 0.03 230)" }}
        >
          {ability.blurb}
        </p>
      </div>
    </div>
  );
});

export default AbilityCard;
