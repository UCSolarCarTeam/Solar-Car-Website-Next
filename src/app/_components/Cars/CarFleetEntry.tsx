"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFleetHighlight } from "./FleetHighlight/FleetHighlightProvider";

export default function CarFleetEntry({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { highlightedId } = useFleetHighlight();
  const isHighlighted = highlightedId === id;

  return (
    <div className={cn("relative scroll-mt-28", className)} id={id}>
      {isHighlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-4 -inset-y-5 z-0 rounded-2xl bg-sc-amber/5 shadow-[0_0_40px_rgba(245,166,35,0.22)] ring-2 ring-sc-amber/55 md:-inset-x-6 md:-inset-y-6"
        />
      )}

      <div className="relative z-[1] grid grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-16">
        {children}
      </div>
    </div>
  );
}
