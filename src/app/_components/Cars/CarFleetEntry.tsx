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
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-16 rounded-xl transition-all duration-500 md:grid-cols-2",
        isHighlighted &&
          "bg-sc-amber/5 shadow-[0_0_32px_rgba(245,166,35,0.2)] ring-2 ring-sc-amber/50",
        className,
      )}
      id={id}
    >
      {children}
    </div>
  );
}
