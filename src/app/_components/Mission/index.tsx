"use client";

import { motion } from "framer-motion";
import SectionReveal from "@/components/ui/SectionReveal";

const MISSION_NODES = [
  { cx: 150, cy: 100, delay: 1.2 },
  { cx: 250, cy: 200, delay: 1.5 },
  { cx: 200, cy: 150, delay: 1.2 },
] as const;

const missionDiagramVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export default function Mission() {
  return (
    <section className="w-full bg-sc-bg px-5 py-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-16">
        <div>
          <div className="sc-label mb-4 text-sc-red">OUR MISSION</div>
          <h2 className="sc-heading mb-6 text-[clamp(2rem,4vw,3rem)]">
            Pushing the Boundaries of Renewable Energy.
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-sc-grey-light">
            The University of Calgary Solar Car Team is a multidisciplinary,
            student-run organization dedicated to designing, building, and
            racing solar-powered vehicles.
          </p>
          <p className="text-lg leading-relaxed text-sc-grey-light">
            We provide students with hands-on engineering and business
            experience while promoting sustainable technology to the broader
            community. Our cars have competed globally, proving that solar power
            is not just viable, but highly competitive.
          </p>
        </SectionReveal>

        {/* Abstract Energy Diagram (SVG) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.svg
            fill="none"
            height="100%"
            initial="hidden"
            variants={missionDiagramVariants}
            viewBox="0 0 400 300"
            viewport={{ once: true, amount: 0.5 }}
            whileInView="visible"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <pattern
              height="40"
              id="grid"
              patternUnits="userSpaceOnUse"
              width="40"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--sc-border)"
                strokeWidth="1"
              />
            </pattern>
            <rect fill="url(#grid)" height="300" width="400" />

            <motion.path
              d="M 0 150 Q 100 150 150 100 T 250 200 T 400 100"
              fill="none"
              stroke="var(--sc-amber)"
              strokeLinecap="round"
              strokeWidth="4"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 2, ease: "easeInOut" },
                },
              }}
            />
            <motion.path
              d="M 50 250 L 150 250 L 200 150 L 350 150"
              fill="none"
              stroke="var(--sc-red)"
              strokeLinecap="round"
              strokeWidth="2"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeInOut",
                  },
                },
              }}
            />

            {MISSION_NODES.map((node) => (
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                fill="var(--sc-bg)"
                key={`${node.cx}-${node.cy}`}
                r="6"
                stroke="var(--sc-white)"
                strokeWidth="3"
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      delay: node.delay,
                      duration: 0.5,
                      type: "spring",
                    },
                  },
                }}
              />
            ))}
          </motion.svg>
        </div>

        <MissionDiagram />
      </div>
    </section>
  );
}
