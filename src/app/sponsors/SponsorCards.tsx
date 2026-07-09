"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const TIER_CARD_CLASSES = {
  gold: "border-sc-border hover:border-sc-amber hover:bg-[rgba(18,18,20,0.8)] hover:shadow-[0_0_30px_rgba(245,166,35,0.13)]",
  silver:
    "border-sc-border hover:border-[rgba(200,200,210,0.8)] hover:bg-[rgba(18,18,20,0.8)] hover:shadow-[0_0_30px_rgba(200,200,210,0.13)]",
  bronze:
    "border-sc-border hover:border-[#CD7F32] hover:bg-[rgba(18,18,20,0.8)] hover:shadow-[0_0_30px_rgba(205,127,50,0.13)]",
  friends:
    "border-sc-border hover:border-sc-white hover:bg-[rgba(18,18,20,0.8)] hover:shadow-[0_0_30px_rgba(240,239,236,0.08)]",
  lead: "border-sc-border hover:border-sc-red hover:shadow-[0_0_60px_rgba(200,16,46,0.15)]",
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

function setLeadSponsorCardHover(target: HTMLElement, hovered: boolean) {
  target.style.borderColor = hovered ? TIER_COLORS.lead : "var(--sc-border)";
  target.style.boxShadow = hovered
    ? `0 0 60px ${TIER_COLORS.lead}25`
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
  tier?: Exclude<TierKey, "lead">;
  index?: number;
}) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link
        className="block no-underline"
        href={href}
        prefetch={false}
        target="_blank"
      >
        <div
          className={cn(
            "group relative flex h-[150px] items-center justify-center rounded border bg-[rgba(18,18,20,0.5)] p-8 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300",
            TIER_CARD_CLASSES[tier],
          )}
        >
          <Image
            alt={name}
            className="object-contain p-6 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
            fill
            sizes={imageSize("sponsorLogo")}
            src={logoUrl}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function LeadSponsorCard() {
  const card = (
    <div
      onBlur={(e) => setLeadSponsorCardHover(e.currentTarget, false)}
      onFocus={(e) => setLeadSponsorCardHover(e.currentTarget, true)}
      onMouseOut={(e) => setLeadSponsorCardHover(e.currentTarget, false)}
      onMouseOver={(e) => setLeadSponsorCardHover(e.currentTarget, true)}
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, amount: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
    >
      <div
        className={cn(
          "relative mx-auto max-w-[800px] rounded border bg-[rgba(18,18,20,0.5)] p-16 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
          TIER_CARD_CLASSES.lead,
        )}
      >
        <Image
          alt="lead sponsor"
          className="h-auto w-full object-contain brightness-[1.2]"
          height={120}
          loading="eager"
          priority
          src="/assets/sponsors/logo-schulich.svg"
          width={800}
        />
      </div>
    </motion.div>
  );
}
