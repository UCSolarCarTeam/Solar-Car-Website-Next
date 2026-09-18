import Link from "next/link";
import * as TEAM from "team.json";

const teamLinkedIn = TEAM.socials.find(
  (social) => social.label === "LinkedIn",
)?.href;
export default function ClosedRecruitment() {
  return (
    <div className="flex flex-wrap justify-center gap-12">
      <div className="max-w-3xl flex flex-col items-center gap-4 text-center">
        <div className="py-4 pb-12 text-xl font-normal">
          The current application period for the Calgary Solar Car Team is now
          closed. We'll be accepting new applications in the next semester. If
          you're excited about renewable energy, engineering innovation, and
          working with a passionate student team to build solar-powered
          vehicles, we encourage you to keep an eye on our{" "}
          <Link
            className="text-sc-amber underline"
            href={
              teamLinkedIn ??
              "https://www.linkedin.com/company/university-ofcalgary-solar-car-team"
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn!
          </Link>
        </div>
      </div>
    </div>
  );
}
