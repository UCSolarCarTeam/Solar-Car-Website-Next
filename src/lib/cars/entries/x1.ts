import type { CarEntry } from "../types";
import { carImages } from "../images";

export const x1: CarEntry = {
  id: "X1",
  title: "X1 (prototype)",
  image: carImages.x1,
  carClass: "PROTOTYPE",
  status: "RETIRED",
  retired: "June 2006",
  serviceYears: "2005–2006",
  content: `The X1 prototype was the team's early proof-of-concept vehicle — a steel space frame
    wrapped in fibreglass and gelcoat. Solar stickers adorned the shell for show; there was no
    functional solar array. It laid the groundwork for every Schulich vehicle that followed.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "~70 km/h" },
    {
      label: "Solar Array Type",
      value: "None (stickers merely for show)",
    },
    { label: "Chassis", value: "Steel Space frame" },
    { label: "Shell Composition", value: "Fibreglass & Gelcoat" },
    { label: "Commissioned", value: "May 2005" },
    { label: "Decommissioned", value: "June 2006" },
  ],
};
