import Image from "next/image";
import Link from "next/link";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { FaLinkedinIn } from "react-icons/fa6";
import { formatDateOnly } from "@/app/_lib/utils";
import { cn } from "@/lib/utils";
import type { PublicTeamMember } from "@/app/team/actions";

type TeamMemberProps = {
  user: PublicTeamMember | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  if (!user) return null;

  const isAlumni = user.yearRetired !== null && user.yearRetired !== undefined;

  const description = isAlumni
    ? (user.companyTitle ?? user.description ?? null)
    : (user.description ?? null);

  const overlayLeft = isAlumni ? user.company : user.fieldOfStudy;
  const hasOverlay = overlayLeft ?? description ?? user.linkedIn ?? false;

  return (
    <div
      className={cn(
        "relative box-content flex min-h-87.5 w-75 cursor-default flex-col items-center gap-3 rounded-2xl pt-12 text-center text-white max-lg:min-h-95 max-lg:w-70 max-sm:w-full max-sm:max-w-75 max-sm:min-h-90",
        hasOverlay && "group hover:-translate-y-1",
      )}
      key={user.profilePictureUrl}
    >
      <div
        className={cn(
          "relative z-1 h-56.25 w-56.25 overflow-hidden rounded-full border-2 border-white/20 transition-[border-color,transform] duration-300 max-lg:h-55 max-lg:w-55 max-sm:h-50 max-sm:w-50",
          hasOverlay && "group-hover:scale-105 group-hover:border-primary-red",
        )}
      >
        <Image
          alt="Headshot"
          className="object-cover"
          fill
          loading="eager"
          src={user.profilePictureUrl ?? defaultProfilePicture}
          unoptimized
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="w-fit min-w-52.5 rounded-xl bg-primary-red px-1 py-0.5 text-2xl font-semibold wrap-break-word text-white max-lg:px-5 max-lg:py-1 max-lg:text-[1.3rem] max-sm:px-4 max-sm:text-xl">
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
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/80 p-8 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 max-lg:p-7 max-sm:rounded-xl max-sm:p-6">
          <div className="flex w-full flex-col gap-6 overflow-hidden text-center">
            {overlayLeft && (
              <div className="text-base font-medium wrap-break-word text-white/95 italic after:mx-auto after:mt-2 after:block after:h-0.5 after:w-37.5 after:bg-[linear-gradient(90deg,transparent,var(--primary-red),transparent)] max-lg:text-[0.95rem] max-sm:text-sm">
                {overlayLeft}
              </div>
            )}
            {description && (
              <div className="mb-4 px-2 text-center text-[0.95rem] leading-relaxed font-light wrap-break-word text-white/85 max-lg:text-sm max-sm:text-[0.85rem]">
                {description}
              </div>
            )}

            {user.linkedIn && (
              <div className="mx-auto flex h-8 w-8 items-center justify-center overflow-visible rounded bg-primary-red text-white transition-[transform,filter] duration-300 hover:scale-110 hover:drop-shadow-[0_4px_12px_rgba(245,23,32,0.6)] focus-visible:scale-110 focus-visible:drop-shadow-[0_4px_12px_rgba(245,23,32,0.6)]">
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
