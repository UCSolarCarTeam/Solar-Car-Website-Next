"use client";

import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function JoinCTAButton() {
  return (
    <MagneticButton className="border-none bg-sc-red px-12 py-4 font-sans text-lg font-semibold tracking-widest text-sc-white uppercase">
      <Link className="text-inherit no-underline" href="/recruitment">
        Apply Now
      </Link>
    </MagneticButton>
  );
}
