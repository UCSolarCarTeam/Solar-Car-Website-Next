"use client";

import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FooterCTA() {
  return (
    <MagneticButton className="border-none bg-sc-red px-6 py-3 font-sans text-sm font-semibold tracking-widest text-sc-white uppercase">
      <Link className="text-inherit no-underline" href="/support-us">
        Donate
      </Link>
    </MagneticButton>
  );
}
