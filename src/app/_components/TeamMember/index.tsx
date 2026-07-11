"use client";

import type { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { useState } from "react";
import { formatDateOnly } from "@/app/_lib/utils";
import { imageSize } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

import Linkedin from "../svgs/Linkedin";

type TeamMemberProps = {
  user: PublicTeamMember | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  const [hovered, setHovered] = useState(false);

  if (!user) return null;

  const isAlumni = user.yearRetired !== null && user.yearRetired !== undefined;

  const description = isAlumni
    ? (user.companyTitle ?? user.description ?? null)
    : (user.description ?? null);

  const overlayLeft = isAlumni ? user.company : user.fieldOfStudy;
  const hasOverlay = overlayLeft ?? description ?? user.linkedIn ?? false;

  return (
    <div
      className="relative box-content mx-auto flex min-h-[350px] w-[300px] cursor-default flex-col items-center gap-3 rounded-2xl pt-12 text-center text-white max-lg:min-h-[380px] max-lg:w-[280px] max-sm:min-h-[360px] max-sm:w-[min(100%,280px)]"
      key={user.profilePictureUrl}
      onMouseEnter={() => hasOverlay && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "relative z-[1] h-[225px] w-[225px] overflow-hidden rounded-full border-2 border-white/20 transition-[border-color] duration-300 max-lg:h-[220px] max-lg:w-[220px] max-sm:h-[200px] max-sm:w-[200px]",
          hovered && hasOverlay && "border-primary-red",
        )}
      >
        <Image
          alt="Headshot"
          className="object-cover object-center"
          fill
          loading="eager"
          sizes={imageSize("teamHeadshot")}
          src={user.profilePictureUrl ?? defaultProfilePicture}
          unoptimized
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-fit min-w-[210px] rounded-xl bg-primary-red px-1 py-0.5 text-2xl font-semibold wrap-break-word text-white max-lg:px-5 max-lg:py-1 max-lg:text-[1.3rem] max-sm:px-4 max-sm:text-xl">
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
        </div>
        <div className="mt-2.5 text-[1.075rem] font-medium max-lg:text-lg max-sm:text-base">
          {(user.teamRole ?? "").replace(/([a-z])([A-Z])/g, "$1 $2")}
          {user.yearJoined && user.yearRetired && (
            <>
              <br />
              {formatDateOnly(user.yearJoined).slice(0, 4)} -{" "}
              {formatDateOnly(user.yearRetired).slice(0, 4)}
            </>
          )}
        </div>
      </div>

      {hasOverlay && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/80 p-8 backdrop-blur-sm transition-opacity duration-300 max-lg:p-7 max-sm:rounded-xl max-sm:p-6",
            hovered ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex w-full flex-col gap-6 overflow-hidden text-center">
            {overlayLeft && (
              <div className="text-base font-medium wrap-break-word text-white/95 italic after:mx-auto after:mt-2 after:block after:h-0.5 after:w-[150px] after:bg-[linear-gradient(90deg,transparent,var(--primary-red),transparent)] max-lg:text-[0.95rem] max-sm:text-sm">
                {overlayLeft}
              </div>
            )}
            {description && (
              <div className="mb-4 px-2 text-center text-[0.95rem] leading-relaxed font-light wrap-break-word text-white/85 max-lg:text-sm max-sm:text-[0.85rem]">
                {description}
              </div>
            )}

            {user.linkedIn && (
              <div className="pointer-events-auto mx-auto flex h-8 w-8 items-center justify-center overflow-visible rounded bg-primary-red text-white transition-[transform,filter] duration-300 hover:scale-110 hover:drop-shadow-[0_4px_12px_rgba(245,23,32,0.6)] focus-visible:scale-110 focus-visible:drop-shadow-[0_4px_12px_rgba(245,23,32,0.6)]">
                <Link
                  href={user.linkedIn}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaLinkedinIn aria-hidden size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMember;
