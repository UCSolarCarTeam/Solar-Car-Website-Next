import type { CarEntry } from "@/lib/cars/types";
import { cn } from "@/lib/utils";
import CarSpecGrid from "./CarSpecGrid";

export default function CarFleetCard({ car }: { car: CarEntry }) {
  return (
    <div
      className={cn(
        "border border-sc-border bg-sc-bg-surface/50 p-10 backdrop-blur-md border-l-4",
        car.status === "ACTIVE" ? "border-l-sc-red" : "border-l-sc-grey-dim",
      )}
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <h2 className="sc-heading m-0 text-4xl">{car.title}</h2>
        <div
          className={cn(
            "sc-mono rounded-sm px-2.5 py-1 text-sm font-semibold",
            car.status === "ACTIVE"
              ? "bg-sc-red/20 text-sc-red"
              : "bg-white/5 text-sc-grey-light",
          )}
        >
          {car.status === "ACTIVE"
            ? "STATUS: ACTIVE"
            : `STATUS: RETIRED · ${car.retired ?? car.serviceYears}`}
        </div>
      </div>

      <div className="sc-mono mb-8 flex flex-wrap gap-8 text-sm text-sc-amber">
        <div>
          <div className="mb-1 text-xs text-sc-grey-dim">CLASS</div>
          {car.carClass}
        </div>
        <div>
          <div className="mb-1 text-xs text-sc-grey-dim">SERVICE</div>
          {car.serviceYears}
        </div>
      </div>

      <p className="m-0 text-lg leading-relaxed text-sc-grey-light">
        {car.content}
      </p>

      {car.specs.length > 0 && <CarSpecGrid specs={car.specs} />}

      {car.note && (
        <blockquote className="sc-mono m-0 border-l-2 border-sc-amber/40 pl-4 text-sm leading-relaxed text-sc-grey-light italic">
          {car.note}
        </blockquote>
      )}
    </div>
  );
}
