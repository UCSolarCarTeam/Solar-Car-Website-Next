import type { FleetTimelineEntry } from "@/lib/cars/types";
import TimelineCardButton from "./TimelineCardButton";

export default function TimelineCard({
  entry,
  index,
}: {
  entry: FleetTimelineEntry;
  index: number;
}) {
  return (
    <TimelineCardButton scrollTargetId={entry.scrollTargetId}>
      <h3 className="sc-mono m-0 text-sm font-medium leading-snug text-sc-white">
        {String(index + 1).padStart(2, "0")}. {entry.name.toUpperCase()}
      </h3>
      <span className="sc-mono mt-3 inline-block max-w-full rounded-full bg-sc-amber/10 px-2.5 py-0.5 text-xs text-sc-amber">
        {entry.years}
      </span>
    </TimelineCardButton>
  );
}
