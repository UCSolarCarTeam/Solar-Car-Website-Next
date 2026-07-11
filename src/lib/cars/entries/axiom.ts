import type { CarEntry } from "../types";
import { carImages } from "../images";

export const axiom: CarEntry = {
  id: "Axiom",
  title: "Schulich Axiom",
  image: carImages.axiom,
  carClass: "CHALLENGER",
  status: "RETIRED",
  retired: "2013",
  serviceYears: "2010–2013",
  content: `Schulich Axiom was the team's challenger-class program from 2010 to 2013. The original
    configuration placed 6th overall in the 2010 North American Solar Challenge before a major
    2011 rebuild for the World Solar Challenge — dropping from ~600 lbs to 390 lbs without driver
    and ballast. All improvements were completed ahead of the 2011 race from Darwin to Adelaide.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "130 km/h (2010) · 110 km/h (2011)" },
    {
      label: "Solar Array Type",
      value: "GaAs triple-junction (2010) · Silicon monocrystalline UC Solar (2011)",
    },
    { label: "Chassis", value: "Carbon fiber & Kevlar (2010) · Carbon fiber (2011)" },
    { label: "Shell Composition", value: "Carbon fiber & Kevlar (2010) · Carbon fiber (2011)" },
    { label: "Weight", value: "~600 lbs (2010) · ~390 lbs (2011)" },
    { label: "Commissioned", value: "October 2009" },
    {
      label: "Current Uses",
      value:
        "6th in the 2010 North American Solar Challenge. Rebuilt and competed in the 2011 World Solar Challenge. Retired when the program concluded in 2013.",
    },
  ],
  note: `"It is evident from the previous race that weight is no minor detail. We have taken Axiom on its diet and the result is stunning. Axiom has dropped from around 600 lbs without driver and ballast to 390 lbs. A loss of 210 lbs!" — Mico Madamesila`,
};
