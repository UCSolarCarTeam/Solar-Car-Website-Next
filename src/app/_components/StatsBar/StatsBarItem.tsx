import * as motion from "framer-motion/client";
import AnimatedCounter from "./AnimatedCounter";

export default function StatsBarItem({
  label,
  suffix,
  value,
  index,
}: {
  label: string;
  suffix: string;
  value: number;
  index: number;
}) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true, amount: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="sc-mono text-4xl font-semibold text-sc-white">
        <AnimatedCounter suffix={suffix} to={value} />
      </div>
      <div className="sc-label text-sc-amber">{label}</div>
    </motion.div>
  );
}
