import { fleetTimeline } from "@/lib/cars/fleet-timeline";
import TimelineRow from "./TimelineRow";

export default function FleetTimeline() {
  return (
    <div className="border border-sc-border bg-sc-bg-surface/50 p-5 backdrop-blur-md sm:p-10">
      <div className="sc-label mb-6 text-sc-amber">FLEET TIMELINE</div>
      <h2 className="sc-heading mb-10 text-3xl">Generations at a Glance</h2>

      <div className="relative">
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-5 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2"
        />

        <ul className="m-0 flex list-none flex-col gap-0 p-0">
          {fleetTimeline.map((entry, index) => (
            <TimelineRow entry={entry} index={index} key={entry.name} />
          ))}
        </ul>
      </div>
    </div>
  );
}
