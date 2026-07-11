import type { FleetTimelineEntry } from "@/lib/cars/types";
import { cn } from "@/lib/utils";
import TimelineCard from "./TimelineCard";
import TimelineNode from "./TimelineNode";

export default function TimelineRow({
  entry,
  index,
}: {
  entry: FleetTimelineEntry;
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const isCurrent = index === 0;

  return (
    <li className="relative py-6 md:grid md:grid-cols-[1fr_2.5rem_1fr] md:items-center md:gap-6">
      <div className="flex items-center gap-4 md:hidden">
        <TimelineNode entry={entry} isCurrent={isCurrent} />
        <TimelineCard entry={entry} index={index} />
      </div>

      <div className="hidden md:contents">
        <div
          className={cn(
            "flex items-center justify-end gap-3",
            !isLeft && "invisible pointer-events-none",
          )}
        >
          {isLeft && (
            <>
              <TimelineCard entry={entry} index={index} />
              <div aria-hidden className="h-px w-8 shrink-0 bg-white/10" />
            </>
          )}
        </div>

        <div className="flex justify-center">
          <TimelineNode entry={entry} isCurrent={isCurrent} />
        </div>

        <div
          className={cn(
            "flex items-center justify-start gap-3",
            isLeft && "invisible pointer-events-none",
          )}
        >
          {!isLeft && (
            <>
              <div aria-hidden className="h-px w-8 shrink-0 bg-white/10" />
              <TimelineCard entry={entry} index={index} />
            </>
          )}
        </div>
      </div>
    </li>
  );
}
