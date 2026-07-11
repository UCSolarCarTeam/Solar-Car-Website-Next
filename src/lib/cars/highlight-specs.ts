import type { CarSpec } from "./types";

const HIGHLIGHT_LABELS = [
  "Maximum Achieved Speed",
  "Target Top Speed",
  "Solar Array Type",
  "Weight",
  "Chassis",
  "Shell Composition",
] as const;

export function getHighlightSpecs(specs: CarSpec[]): CarSpec[] {
  const picked: CarSpec[] = [];

  for (const label of HIGHLIGHT_LABELS) {
    const spec = specs.find((s) => s.label === label);
    if (spec) picked.push(spec);
    if (picked.length >= 4) return picked;
  }

  for (const spec of specs) {
    if (!picked.some((p) => p.label === spec.label)) picked.push(spec);
    if (picked.length >= 4) break;
  }

  return picked;
}
