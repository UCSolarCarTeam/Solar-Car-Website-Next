import StatsBarItem from "./StatsBarItem";

const STATS = [
  { label: "YEARS ACTIVE", value: 12, suffix: "+" },
  { label: "RACES COMPLETED", value: 8, suffix: "" },
  { label: "SOLAR ARRAY", value: 1200, suffix: "W" },
  { label: "TEAM MEMBERS", value: 60, suffix: "+" },
] as const;

export default function StatsBar() {
  return (
    <section className="w-full border-y border-sc-border bg-sc-bg-surface py-12">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8 text-center">
        {STATS.map((stat, index) => (
          <StatsBarItem
            index={index}
            key={stat.label}
            label={stat.label}
            suffix={stat.suffix}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  );
}
