import type { CarEntry } from "../types";
import { carImages } from "../images";

export const schulich1: CarEntry = {
  id: "Schulich1",
  title: "Schulich I",
  image: carImages.schulich1,
  carClass: "CHALLENGER",
  status: "RETIRED",
  retired: "May 2011",
  serviceYears: "2007–2010",
  content: `Schulich I debuted at the 2007 Panasonic World Solar Challenge, finishing 8th as the
    top Canadian team. It later placed 6th at the 2008 North American Solar Challenge — a team
    record at the time. As the team's second car, it introduced gallium arsenide solar cells,
    replacing the silicon cells used on Soleon.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "105 km/h" },
    {
      label: "Solar Array Type",
      value: "Gallium arsenide (GaAs) Triple-junction",
    },
    { label: "Chassis", value: "Steel Space frame" },
    { label: "Shell Composition", value: "Carbon Fiber & Kevlar" },
    { label: "Weight", value: "~520 lbs" },
    { label: "Commissioned", value: "September 2007" },
    { label: "Decommissioned", value: "May 2011" },
    {
      label: "Current Uses",
      value:
        "Participated in the 2007 World Solar Challenge and 2008 North American Solar Challenge. Retired once Axiom took over driver training, mechanical testing, and PR events.",
    },
  ],
  note: `Gallium arsenide (GaAs) is a III-V direct band gap semiconductor with a zinc blende crystal structure, used in devices such as microwave frequency integrated circuits and high-efficiency solar cells.`,
};
