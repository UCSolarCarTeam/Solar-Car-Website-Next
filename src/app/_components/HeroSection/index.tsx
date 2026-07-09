"use client";

import { getGPUTier } from "detect-gpu";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import { Suspense, useEffect, useRef, useState } from "react";
import useReducedMotion from "@/app/_hooks/useReducedMotion";
import useViewport from "@/app/_hooks/useViewport";
import { fadeUp } from "@/lib/animation/variants";
import { imageSize } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
});

const telemetryData = [
  { label: "SYS_VOLTAGE", value: "108V", pos: { top: "15%", left: "5%" } },
  { label: "ARRAY_EFF", value: "22.4%", pos: { top: "15%", right: "5%" } },
  {
    label: "PEAK_OUTPUT",
    value: "1.2kW",
    pos: { bottom: "15%", left: "5%" },
  },
  { label: "STATUS", value: "NOMINAL", pos: { bottom: "15%", right: "5%" } },
] as const;

const overlayGradient =
  "radial-gradient(circle at center, transparent 30%, var(--sc-bg) 95%), linear-gradient(to bottom, rgba(10,10,11,0.2) 0%, var(--sc-bg) 100%)";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { width } = useViewport();
  const isMobile = (width ?? 1200) <= 768;

  const [isLowTier, setIsLowTier] = useState(false);

  useEffect(() => {
    getGPUTier().then((tier) => {
      // Only skip 3D on devices with no usable GPU or phones
      if (tier.tier === 0 || tier.isMobile) {
        setIsLowTier(true);
      }
    });
  }, []);

  const show3D = !prefersReduced && !isLowTier;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-sc-bg"
      ref={containerRef}
    >
      {show3D ? (
        <div className="absolute inset-0 z-0">
          <Suspense
            fallback={
              <Image
                alt="Loading 3D Scene..."
                className="object-cover object-center blur-xl"
                fill
                priority
                sizes={imageSize("hero")}
                src={backsplash}
              />
            }
          >
            <Hero3DCanvas />
          </Suspense>
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: overlayGradient }}
          />
        </div>
      ) : prefersReduced ? (
        <div className="absolute inset-0 z-0">
          <Image
            alt="Schulich Elysia Solar Car"
            className="object-cover object-center"
            fill
            priority
            sizes={imageSize("hero")}
            src={backsplash}
          />
          <div
            className="absolute inset-0"
            style={{ background: overlayGradient }}
          />
        </div>
      ) : (
        <motion.div
          className="absolute -inset-5 z-0"
          style={{ y, scale, opacity }}
        >
          <Image
            alt="Schulich Elysia Solar Car"
            className="object-cover object-center"
            fill
            priority
            sizes={imageSize("hero")}
            src={backsplash}
          />
          <div
            className="absolute inset-0"
            style={{ background: overlayGradient }}
          />
        </motion.div>
      )}

      {!isMobile &&
        telemetryData.map((item, index) => (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            key={item.label}
            style={{
              position: "absolute",
              ...item.pos,
              zIndex: 10,
              borderLeft: "2px solid var(--sc-red)",
              paddingLeft: "12px",
            }}
            transition={{
              duration: 0.8,
              delay: 0.5 + index * 0.1,
              ease: "easeOut",
            }}
          >
            <div className="sc-label">{item.label}</div>
            <div
              className="sc-mono"
              style={{
                fontSize: "1.25rem",
                color: "var(--sc-white)",
                fontWeight: 500,
              }}
            >
              {item.value}
            </div>
          </motion.div>
        ))}

      {/* ── Center Headline ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 10,
          width: "100%",
          padding: isMobile ? "0 20px" : undefined,
        }}
      >
        <motion.div
          animate="visible"
          initial="hidden"
          transition={{ delay: 0.2 }}
          variants={fadeUp}
        >
          <p
            className="sc-label"
            style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
          >
            <div className="sc-label">{item.label}</div>
            <div className="sc-mono text-xl font-medium text-sc-white">
              {item.value}
            </div>
          </motion.div>
        ))}

      <div
        className={cn(
          "absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center",
          isMobile && "px-5",
        )}
      >
        <motion.div
          animate="visible"
          initial="hidden"
          transition={{ delay: 0.2 }}
          variants={fadeUp}
        >
          <p className="sc-label mb-4 text-sc-amber">
            UNIVERSITY OF CALGARY SOLAR CAR TEAM
          </p>
        </motion.div>

        <h1
          className="sc-heading"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            lineHeight: 1,
            textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {["EDUCATE.", "INNOVATE.", "INSPIRE."].map((word, i) => (
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              custom={i}
              initial={{ opacity: 0, y: 50 }}
              key={word}
              style={{ display: "block" }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="sc-label" style={{ color: "var(--sc-grey-light)" }}>
          SCROLL
        </div>
        {prefersReduced ? (
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, var(--sc-red), transparent)",
            }}
          />
        ) : (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            className="h-10 w-px bg-gradient-to-b from-sc-red to-transparent"
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </section>
  );
}
