import carData from "./cars.json";
import type { CarEntry, FleetTimelineEntry } from "./types";

export const cars = carData as CarEntry[];

export const fleetTimeline: FleetTimelineEntry[] = cars.map((car) => ({
  name: car.title,
  years: car.serviceYears,
  scrollTargetId: car.id,
}));

export const pageIds = Object.fromEntries(
  cars.map((car) => [
    car.id,
    {
      content: car.content,
      image: car.image,
      title: car.title,
      position: "left" as const,
    },
  ]),
);

export { getHighlightSpecs } from "./highlight-specs";
export type {
  CarClass,
  CarEntry,
  CarSpec,
  CarStatus,
  FleetTimelineEntry,
} from "./types";
