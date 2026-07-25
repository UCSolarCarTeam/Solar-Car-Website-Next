import * as motion from "framer-motion/client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

type TierKey = keyof typeof TIER_CARD_CLASSES;

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
            src={logoUrl}
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function LeadSponsorCard() {
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
