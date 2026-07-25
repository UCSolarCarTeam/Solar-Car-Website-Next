"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFleetHighlight } from "../FleetHighlight/FleetHighlightProvider";

export default function TimelineCardButton({
  children,
  scrollTargetId,
}: {
  children: ReactNode;
  scrollTargetId: string;
}) {
  const { scrollToCar } = useFleetHighlight();

  return (
    <button
      className={cn(
        "min-w-0 flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 text-left transition-colors",
        "hover:border-white/20 hover:bg-white/[0.07]",
        "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sc-amber",
      )}
      onClick={() => scrollToCar(scrollTargetId)}
      type="button"
    >
      {children}
    </button>
  );
}
