"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import useReducedMotion from "@/app/_hooks/useReducedMotion";

/** Color accents per sponsor tier */
const TIER_COLORS = {
  gold: "var(--sc-amber)",
  silver: "rgba(200, 200, 210, 0.8)",
  bronze: "#CD7F32",
  friends: "var(--sc-white)",
  lead: "var(--sc-red)",
} as const;

type TierKey = keyof typeof TIER_COLORS;

function setSponsorCardHover(
  target: HTMLElement,
  accentColor: string,
  hovered: boolean,
) {
  target.style.borderColor = hovered ? accentColor : "var(--sc-border)";
  target.style.background = hovered
    ? "rgba(18, 18, 20, 0.8)"
    : "rgba(18, 18, 20, 0.5)";
  target.style.boxShadow = hovered ? `0 0 30px ${accentColor}22` : "none";
  const img = target.querySelector("img");
  if (img) {
    img.style.opacity = hovered ? "1" : "0.7";
  }
}

function setLeadSponsorCardHover(
  target: HTMLElement,
  hovered: boolean,
  prefersReduced: boolean,
) {
  target.style.borderColor = hovered ? TIER_COLORS.lead : "var(--sc-border)";
  target.style.boxShadow = hovered
    ? `0 0 60px ${TIER_COLORS.lead}25`
    : prefersReduced
      ? `0 0 60px ${TIER_COLORS.lead}15`
      : "none";
}

export function SponsorCard({
  href,
  name,
  logoUrl,
  tier = "friends",
  index = 0,
}: {
  href: string;
  name: string;
  logoUrl: string;
  tier?: TierKey;
  index?: number;
}) {
  const prefersReduced = useReducedMotion();
  const accentColor = TIER_COLORS[tier];

  const card = (
    <Link
      href={href}
      prefetch={false}
      style={{ textDecoration: "none", display: "block" }}
      target="_blank"
    >
      <div
        onBlur={(e) => setSponsorCardHover(e.currentTarget, accentColor, false)}
        onFocus={(e) => setSponsorCardHover(e.currentTarget, accentColor, true)}
        onMouseOut={(e) =>
          setSponsorCardHover(e.currentTarget, accentColor, false)
        }
        onMouseOver={(e) =>
          setSponsorCardHover(e.currentTarget, accentColor, true)
        }
        style={{
          background: "rgba(18, 18, 20, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--sc-border)",
          borderRadius: "4px",
          padding: "2rem",
          height: "150px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
        }}
      >
        <Image
          alt={name}
          fill
          src={logoUrl}
          style={{
            objectFit: "contain",
            padding: "1.5rem",
            opacity: 0.7,
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </Link>
  );

  // Reduced motion: no whileInView animation
  if (prefersReduced) {
    return card;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {card}
    </motion.div>
  );
}

export function LeadSponsorCard() {
  const prefersReduced = useReducedMotion();

  const card = (
    <div
      onBlur={(e) =>
        setLeadSponsorCardHover(e.currentTarget, false, prefersReduced)
      }
      onFocus={(e) =>
        setLeadSponsorCardHover(e.currentTarget, true, prefersReduced)
      }
      onMouseOut={(e) =>
        setLeadSponsorCardHover(e.currentTarget, false, prefersReduced)
      }
      onMouseOver={(e) =>
        setLeadSponsorCardHover(e.currentTarget, true, prefersReduced)
      }
      style={{
        background: "rgba(18, 18, 20, 0.5)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--sc-border)",
        borderRadius: "4px",
        padding: "4rem",
        position: "relative",
        maxWidth: "800px",
        margin: "0 auto",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: prefersReduced
          ? `0 0 60px ${TIER_COLORS.lead}15`
          : undefined,
      }}
    >
      <Image
        alt="lead sponsor"
        height={120}
        loading="eager"
        priority
        src="/assets/sponsors/logo-schulich.svg"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          filter: "brightness(1.2)",
        }}
        width={800}
      />
    </div>
  );

  if (prefersReduced) {
    return card;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      {card}
    </motion.div>
  );
}
