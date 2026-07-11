import type { CarEntry } from "../types";
import { carImages } from "../images";

export const elysia: CarEntry = {
  id: "Elysia",
  title: "Schulich Elysia",
  image: carImages.elysia,
  carClass: "CRUISER",
  status: "RETIRED",
  retired: "Summer 2025",
  serviceYears: "2019–2025",
  content: `Schulich Elysia began its design phase in 2016 and this catamaran-style cruiser was
    completed in 2019 to improve battery cooling and aerodynamics. Elysia took first place in
    the Multi-Occupant Vehicle Class at the 2019 American Solar Challenge and completed its
    final race at the Formula Sun Grand Prix in Bowling Green, Kentucky.`,
  specs: [
    { label: "Solar Array Type", value: "Multi-junction GaAs" },
    { label: "Class", value: "Cruiser (MOV)" },
    { label: "Commissioned", value: "2019" },
    { label: "Decommissioned", value: "Summer 2025" },
  ],
};
