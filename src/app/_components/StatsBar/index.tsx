"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "YEARS ACTIVE", value: 12, suffix: "+" },
  { label: "RACES COMPLETED", value: 8, suffix: "" },
  { label: "SOLAR ARRAY", value: 1200, suffix: "W" },
  { label: "TEAM MEMBERS", value: 60, suffix: "+" },
];

function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      setCount(Math.floor(easeProgress * (to - from) + from));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, from, to, duration]);

  return (
    <span ref={nodeRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section
      style={{
        width: "100%",
        background: "var(--sc-bg-surface)",
        borderTop: "1px solid var(--sc-border)",
        borderBottom: "1px solid var(--sc-border)",
        padding: "3rem 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            key={stat.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true, amount: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div
              className="sc-mono"
              style={{
                fontSize: "2.5rem",
                color: "var(--sc-white)",
                fontWeight: 600,
              }}
            >
              <AnimatedCounter suffix={stat.suffix} to={stat.value} />
            </div>
            <div className="sc-label" style={{ color: "var(--sc-amber)" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
