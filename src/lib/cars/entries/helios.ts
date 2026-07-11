import type { CarEntry } from "../types";
import { carImages } from "../images";

export const helios: CarEntry = {
  id: "Helios",
  title: "Schulich Helios",
  image: carImages.helios,
  carClass: "CHALLENGER",
  status: "ACTIVE",
  serviceYears: "2026–present",
  content: `Schulich Helios is the current project by the University of Calgary Solar Car Team,
    embodying the future of renewable automotive technology. Capable of theoretically reaching
    speeds of 110 km/h, Helios represents the culmination of the team's intensified efforts
    ahead of the Formula Sun Grand Prix in summer 2026.`,
  specs: [
    { label: "Target Top Speed", value: "~110 km/h (theoretical)" },
    { label: "Status", value: "In development" },
    { label: "Commissioned", value: "2026" },
  ],
};
