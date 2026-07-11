import type { CarSpec } from "@/lib/cars/types";

export default function CarSpecGrid({ specs }: { specs: CarSpec[] }) {
  return (
    <dl className="mb-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-sc-border pt-8 sm:grid-cols-2">
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt className="sc-mono mb-1 text-xs text-sc-grey-dim">
            {spec.label.toUpperCase().replace(/\s+/g, "_")}
          </dt>
          <dd className="m-0 text-sm leading-relaxed text-sc-white">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
