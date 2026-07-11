"use client";

import Image from "next/image";
import { useState } from "react";
import { getHighlightSpecs } from "@/lib/cars/highlight-specs";
import type { CarEntry } from "@/lib/cars/types";
import { imageSize } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

export default function CarFleetImage({
  car,
  className,
  stretch = false,
}: {
  car: CarEntry;
  className?: string;
  stretch?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const highlights = getHighlightSpecs(car.specs);
  const active = revealed;

  return (
    <div
      className={cn(
        "group relative w-full",
        stretch
          ? "h-full min-h-[280px] md:min-h-full"
          : "aspect-[16/10]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -inset-2.5 z-0 border transition-colors duration-300",
          active
            ? "border-sc-amber/60"
            : "border-sc-amber/30 group-hover:border-sc-amber/60",
        )}
      />
      <div
        className={cn(
          "absolute -top-[15px] -left-[15px] z-0 h-[15px] w-[15px] border-t-2 border-l-2 transition-colors duration-300",
          active
            ? "border-sc-amber"
            : "border-sc-amber/70 group-hover:border-sc-amber",
        )}
      />
      <div
        className={cn(
          "absolute -right-[15px] -bottom-[15px] z-0 h-[15px] w-[15px] border-r-2 border-b-2 transition-colors duration-300",
          active
            ? "border-sc-amber"
            : "border-sc-amber/70 group-hover:border-sc-amber",
        )}
      />

      <button
        aria-expanded={active}
        aria-label={`${car.title} telemetry stats`}
        className="relative z-[1] h-full min-h-[inherit] w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left"
        onClick={() => setRevealed((v) => !v)}
        type="button"
      >
        <Image
          alt={car.title}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          fill
          sizes={imageSize("carFleet")}
          src={car.image}
        />
        <div
          className={cn(
            "absolute inset-0 shadow-[inset_0_0_100px_rgba(10,10,11,0.5)] transition-opacity duration-300",
            active ? "opacity-60" : "group-hover:opacity-60",
          )}
        />

        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-sc-bg via-sc-bg/90 to-sc-bg/20 p-6 opacity-0 transition-opacity duration-300",
            active ? "opacity-100" : "group-hover:opacity-100",
          )}
        >
          <div className="sc-label mb-3 text-sc-amber">TELEMETRY</div>
          <dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map((spec) => (
              <div key={spec.label}>
                <dt className="sc-mono mb-0.5 text-[10px] text-sc-grey-dim">
                  {spec.label.toUpperCase().replace(/\s+/g, "_")}
                </dt>
                <dd className="m-0 text-sm leading-snug text-sc-white">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="sc-mono mt-4 flex flex-wrap gap-3 text-xs text-sc-amber">
            <span>{car.carClass}</span>
            <span className="text-sc-grey-dim">·</span>
            <span>{car.serviceYears}</span>
          </div>
        </div>

        <span
          className={cn(
            "sc-mono pointer-events-none absolute top-4 right-4 rounded-sm bg-sc-bg/80 px-2 py-1 text-[10px] text-sc-grey-light transition-opacity duration-300 sm:hidden",
            active && "opacity-0",
          )}
        >
          TAP FOR STATS
        </span>
      </button>
    </div>
  );
}
