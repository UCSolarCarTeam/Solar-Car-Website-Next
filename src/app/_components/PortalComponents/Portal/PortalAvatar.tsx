"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

const placeholder = "/assets/DefaultProfilePicture-Square.png";

export default function PortalAvatar({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  const source = src?.trim() || placeholder;

  // A new URL gets a fresh attempt, even if the previous image failed.
  return <AvatarImage alt={alt} key={source} source={source} />;
}

function AvatarImage({ alt, source }: { alt: string; source: string }) {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = failed || source === placeholder;

  return (
    <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1">
      <Image
        alt={alt}
        className={cn(
          "block size-full rounded-lg",
          isPlaceholder ? "object-contain" : "object-cover",
        )}
        height={64}
        onError={() => setFailed(true)}
        src={isPlaceholder ? placeholder : source}
        unoptimized
        width={64}
      />
    </div>
  );
}
