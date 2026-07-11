import { axiom } from "./entries/axiom";
import { delta } from "./entries/delta";
import { elysia } from "./entries/elysia";
import { helios } from "./entries/helios";
import { schulich1 } from "./entries/schulich-1";
import { soleon } from "./entries/soleon";
import { x1 } from "./entries/x1";

export type {
  CarClass,
  CarEntry,
  CarSpec,
  CarStatus,
  FleetTimelineEntry,
} from "./types";

export { fleetTimeline } from "./fleet-timeline";
export { getHighlightSpecs } from "./highlight-specs";

/** Newest first — matches scroll order on /cars */
export const cars = [
  helios,
  elysia,
  delta,
  axiom,
  schulich1,
  soleon,
  x1,
] as const;

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
