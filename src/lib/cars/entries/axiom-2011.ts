import type { CarEntry } from "../types";
import { carImages } from "../images";

export const axiom2011: CarEntry = {
  id: "Axiom2011",
  title: "Schulich Axiom (2011)",
  image: carImages.axiom,
  carClass: "CHALLENGER",
  status: "RETIRED",
  retired: "2013",
  serviceYears: "2011–2013",
  content: `The 2011 evolution of Schulich Axiom was rebuilt for the World Solar Challenge with
    a dramatic weight reduction — dropping from ~600 lbs to 390 lbs without driver and ballast.
    All improvements were completed ahead of the 2011 race from Darwin to Adelaide.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "110 km/h" },
    {
      label: "Solar Array Type",
      value: "Silicon Monocrystalline (Si) UC Solar Embedded",
    },
    { label: "Chassis", value: "Carbon Fiber" },
    { label: "Shell Composition", value: "Carbon Fiber" },
    { label: "Weight", value: "~390 lbs" },
    { label: "Commissioned", value: "May 2011" },
    {
      label: "Current Uses",
      value:
        "Competed in the 2011 World Solar Challenge. Retired after the Axiom program concluded in 2013.",
    },
  ],
  note: `"It is evident from the previous race that weight is no minor detail. We have taken Axiom on its diet and the result is stunning. Axiom has dropped from around 600 lbs without driver and ballast to 390 lbs. A loss of 210 lbs!" — Mico Madamesila`,
};
