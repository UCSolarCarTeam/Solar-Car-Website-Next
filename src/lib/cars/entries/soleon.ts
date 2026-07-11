import type { CarEntry } from "../types";
import { carImages } from "../images";

export const soleon: CarEntry = {
  id: "Soleon",
  title: "Schulich Soleon",
  image: carImages.soleon,
  carClass: "CHALLENGER",
  status: "RETIRED",
  retired: "July 2007",
  serviceYears: "2004–2006",
  content: `Built in 2004 for the inaugural North American Solar Challenge (2005), Soleon finished
    13th — an impressive debut. It then competed in the 2005 World Solar Challenge, placing
    1st in its class and 10th overall.`,
  specs: [
    { label: "Maximum Achieved Speed", value: "140 km/h" },
    { label: "Solar Array Type", value: "Silicon" },
    { label: "Chassis", value: "Aluminum Space frame" },
    { label: "Shell Composition", value: "Carbon Fiber & Kevlar" },
    { label: "Weight", value: "~500 lbs" },
    { label: "Commissioned", value: "June 2005" },
    { label: "Decommissioned", value: "July 2007" },
    {
      label: "Current Uses",
      value:
        "Donated to the Calgary Telus World of Science in fall 2008 and displayed for two years. Now retired and looking for a nice warm garage to rest.",
    },
  ],
};
