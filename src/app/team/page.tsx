import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import TeamMember from "@/app/_components/TeamMember";
import type { User } from "@/generated/prisma/browser";
import { getPublicAlumni, getPublicTeamMembers } from "@/server/public/team";

export const dynamic = "error";
export const revalidate = 3600;

export const metadata = {
  title: "Team | Calgary Solar Car",
  description:
    "Meet the brilliant minds building the University of Calgary Solar Car.",
};

const Team = async () => {
  const [teamHierarchy, alumniTeam] = await Promise.all([
    getPublicTeamMembers(),
    getPublicAlumni(),
  ]);

  const {
    accountingTeam,
    businessTeamManager,
    commmunicationsTeam,
    electricalTeam,
    engineeringTeamManager,
    leadRoles,
    managerRoles,
    mechanicalTeam,
    multiTeam,
    softwareTeam,
    sponsorshipTeam,
    teamCaptain,
  } = teamHierarchy ?? {};

  const RoleSection = ({
    title,
    members,
  }: {
    title: string;
    members: (User | null | undefined)[];
  }) => {
    if (!members || members.length === 0) return null;
    return (
      <div className="mb-20">
        <div className="mb-8 flex items-baseline gap-4 border-b border-sc-border pb-4">
          <h2 className="sc-heading m-0 text-3xl text-sc-white">{title}</h2>
          <span className="sc-mono text-sm text-sc-red">
            COUNT: {members.length}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
          {members.map((m) =>
            m ? <TeamMember key={m.id || m.clerkUserId} user={m} /> : null,
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-100 h-[50vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Team Background"
              className="object-cover object-center brightness-[0.3] saturate-50"
              fill
              priority
              src={backsplash}
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-sc-bg" />
          </div>

          <div className="relative z-10 px-5 text-center">
            <div className="sc-label mb-4 text-sc-red">THE CREW</div>
            <h1 className="sc-heading m-0 text-[clamp(3rem,6vw,5rem)]">
              Meet the Team.
            </h1>
            <p className="mx-auto mt-6 max-w-150 text-lg text-sc-grey-light">
              The minds behind the machine. A multidisciplinary student-run
              organization pushing the boundaries of renewable energy.
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-300 px-5 py-16 pb-32">
          <RoleSection
            members={[
              engineeringTeamManager,
              teamCaptain,
              businessTeamManager,
            ].filter(Boolean)}
            title="Co-Chairs"
          />
          <RoleSection members={managerRoles || []} title="Subteam Managers" />
          <RoleSection members={leadRoles || []} title="Team Leads" />
          <RoleSection members={mechanicalTeam || []} title="Mechanical Team" />
          <RoleSection members={electricalTeam || []} title="Electrical Team" />
          <RoleSection members={softwareTeam || []} title="Software Team" />
          <RoleSection members={accountingTeam || []} title="Accounting Team" />
          <RoleSection
            members={commmunicationsTeam || []}
            title="Communications Team"
          />
          <RoleSection
            members={sponsorshipTeam || []}
            title="Sponsorship Team"
          />
          <RoleSection members={multiTeam || []} title="Multi Team" />

          <div className="mt-32">
            <div className="sc-label mb-4 text-sc-amber">LEGACY</div>
            <RoleSection members={alumniTeam || []} title="Alumni" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Team;
