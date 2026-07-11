"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
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
