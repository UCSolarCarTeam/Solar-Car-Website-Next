"use client";

import { AnimatePresence, motion } from "framer-motion";
import useReducedMotion from "@/app/_hooks/useReducedMotion";
import { HERO_STAGE_1_END, HERO_STAGE_2_END } from "@/lib/animation/constants";
import { labelPop } from "@/lib/animation/variants";

interface Label {
  id: string;
  text: string;
  value: string;
  unit: string;
  /** CSS position relative to the canvas container */
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  /** Which stage triggers this label (1 = array hit, 2 = battery/motor) */
  stage: 1 | 2;
}

// All numbers marked /* PLACEHOLDER */ — swap with real telemetry
const LABELS: Label[] = [
  {
    id: "solar-input",
    text: "SOLAR INPUT",
    value: "1.2" /* PLACEHOLDER */,
    unit: "kW",
    stage: 1,
    top: "22%",
    left: "12%",
  },
  {
    id: "array-efficiency",
    text: "ARRAY EFF.",
    value: "22.4" /* PLACEHOLDER */,
    unit: "%",
    stage: 1,
    top: "22%",
    right: "12%",
  },
  {
    id: "pack-voltage",
    text: "PACK VOLTAGE",
    value: "108" /* PLACEHOLDER */,
    unit: "V",
    stage: 2,
    bottom: "38%",
    left: "10%",
  },
  {
    id: "motor-output",
    text: "MOTOR OUTPUT",
    value: "13.4" /* PLACEHOLDER */,
    unit: "kW",
    stage: 2,
    bottom: "38%",
    right: "10%",
  },
  {
    id: "top-speed",
    text: "TOP SPEED",
    value: "110" /* PLACEHOLDER */,
    unit: "km/h",
    stage: 2,
    bottom: "28%",
    left: "50%",
  },
];

interface HeroLabelsProps {
  progress: number;
}

export default function HeroLabels({ progress }: HeroLabelsProps) {
  const stage1Active = progress >= HERO_STAGE_1_END * 0.8; // 80% into stage 1
  const stage2Active = progress >= HERO_STAGE_2_END * 0.6;
  const prefersReduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {prefersReduced ? (
        /* Reduced motion: show all labels instantly, no pop-in animation */
        LABELS.map((label) => {
          const visible = label.stage === 1 ? stage1Active : stage2Active;
          if (!visible) return null;

          return (
            <div
              key={label.id}
              style={{
                position: "absolute",
                top: label.top,
                bottom: label.bottom,
                left: label.left,
                right: label.right,
                transform:
                  label.left === "50%" ? "translateX(-50%)" : undefined,
              }}
            >
              {/* Connector line */}
              <div
                style={{
                  width: "1px",
                  height: "28px",
                  background:
                    "linear-gradient(to bottom, var(--sc-amber), transparent)",
                  margin: "0 auto 6px",
                }}
              />
              {/* Data card */}
              <div
                style={{
                  background: "rgba(10, 10, 11, 0.72)",
                  border: "1px solid rgba(245, 166, 35, 0.3)",
                  borderRadius: "2px",
                  padding: "6px 10px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="sc-label"
                  style={{ color: "var(--sc-amber)", marginBottom: "2px" }}
                >
                  {label.text}
                </div>
                <div
                  style={{
                    fontFamily: "var(--sc-font-mono)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--sc-white)",
                    lineHeight: 1,
                  }}
                >
                  {label.value}
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--sc-grey-light)",
                      marginLeft: "3px",
                    }}
                  >
                    {label.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <AnimatePresence>
          {LABELS.map((label) => {
            const visible = label.stage === 1 ? stage1Active : stage2Active;
            if (!visible) return null;

            return (
              <motion.div
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                initial="hidden"
                key={label.id}
                style={{
                  position: "absolute",
                  top: label.top,
                  bottom: label.bottom,
                  left: label.left,
                  right: label.right,
                  transform:
                    label.left === "50%" ? "translateX(-50%)" : undefined,
                }}
                variants={labelPop}
              >
                {/* Connector line */}
                <div
                  style={{
                    width: "1px",
                    height: "28px",
                    background:
                      "linear-gradient(to bottom, var(--sc-amber), transparent)",
                    margin: "0 auto 6px",
                  }}
                />
                {/* Data card */}
                <div
                  style={{
                    background: "rgba(10, 10, 11, 0.72)",
                    border: "1px solid rgba(245, 166, 35, 0.3)",
                    borderRadius: "2px",
                    padding: "6px 10px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="sc-label"
                    style={{ color: "var(--sc-amber)", marginBottom: "2px" }}
                  >
                    {label.text}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--sc-font-mono)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "var(--sc-white)",
                      lineHeight: 1,
                    }}
                  >
                    {label.value}
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--sc-grey-light)",
                        marginLeft: "3px",
                      }}
                    >
                      {label.unit}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
