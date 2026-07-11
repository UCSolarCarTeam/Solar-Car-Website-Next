"use client";

import type { FleetTimelineEntry } from "@/lib/cars/types";
import { cn } from "@/lib/utils";
import { useFleetHighlight } from "../FleetHighlight/FleetHighlightProvider";

export default function TimelineNode({
  entry,
  isCurrent,
}: {
  entry: FleetTimelineEntry;
  isCurrent: boolean;
}) {
  const { scrollToCar } = useFleetHighlight();

  function handleActivate() {
    scrollToCar(entry.scrollTargetId);
  }

  return (
    <button
      aria-label={`Jump to ${entry.name}`}
      className="relative z-10 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-transform hover:scale-110 hover:shadow-[0_0_12px_rgba(245,166,35,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sc-amber"
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      type="button"
    >
      <span
        className={cn(
          "block rounded-full border-2 border-sc-amber transition-colors",
          isCurrent ? "size-5 bg-sc-amber" : "size-4 bg-sc-bg",
        )}
      />
    </button>
  );
}
