import type { CarEntry } from "../types";
import { carImages } from "../images";

export const axiom2010: CarEntry = {
  id: "Axiom2010",
  title: "Schulich Axiom (2010)",
  image: carImages.axiom,
  carClass: "CHALLENGER",
  status: "RETIRED",
  retired: "2011",
  serviceYears: "2010–2011",
  content: `Schulich Axiom (2010) was the team's challenger-class entry that placed 6th overall
    in the 2010 North American Solar Challenge. This configuration preceded the major 2011
    lightweight rebuild for the World Solar Challenge.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "130 km/h" },
    {
      label: "Solar Array Type",
      value: "Gallium arsenide (GaAs) Triple-junction",
    },
    { label: "Chassis", value: "Carbon Fiber & Kevlar" },
    { label: "Shell Composition", value: "Carbon Fiber & Kevlar" },
    { label: "Weight", value: "~600 lbs" },
    { label: "Commissioned", value: "October 2009" },
    {
      label: "Current Uses",
      value:
        "Placed 6th in the 2010 North American Solar Challenge. Rebuilt for the 2011 season.",
    },
  ],
};
