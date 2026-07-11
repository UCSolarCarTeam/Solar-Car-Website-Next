import type { CarEntry } from "../types";
import { carImages } from "../images";

export const delta: CarEntry = {
  id: "Delta",
  title: "Schulich Delta",
  image: carImages.delta,
  carClass: "CRUISER",
  status: "RETIRED",
  retired: "2015",
  serviceYears: "2013–2015",
  content: `Canada's first cruiser-class solar car, built from 2012 to 2015. Delta raced in the
    2013 Bridgestone World Solar Challenge (8th) and the 2015 Formula Sun Grand Prix, completing
    84 laps with a fastest lap of 5:33.886 to finish 9th. Officially retired in 2015, Delta
    continues to inspire through educational demonstrations.`,
  specs: [
    { label: "Class", value: "Cruiser" },
    { label: "Commissioned", value: "2013" },
    { label: "Decommissioned", value: "2015" },
    {
      label: "Notable Result",
      value: "8th — 2013 World Solar Challenge",
    },
  ],
};
