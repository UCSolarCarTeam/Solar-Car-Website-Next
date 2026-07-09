import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import TeamMember from "@/app/_components/TeamMember";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Team | Calgary Solar Car",
  description:
    "Meet the brilliant minds building the University of Calgary Solar Car.",
};

const Team = async () => {
  const teamHierarchy = await trpc.fe.getTeamMembers();
  const alumniTeam = await trpc.fe.getAlumni();

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
    members: any[];
  }) => {
    if (!members || members.length === 0) return null;
    return (
      <div style={{ marginBottom: "5rem" }}>
        <div
          style={{
            borderBottom: "1px solid var(--sc-border)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "baseline",
            gap: "1rem",
          }}
        >
          <h2
            className="sc-heading"
            style={{ color: "var(--sc-white)", fontSize: "2rem", margin: 0 }}
          >
            {title}
          </h2>
          <span
            className="sc-mono"
            style={{ color: "var(--sc-red)", fontSize: "0.9rem" }}
          >
            COUNT: {members.length}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {members.map((m) =>
            m ? <TeamMember key={m.id || m.clerkUserId} user={m} /> : null,
          )}
        </div>
      </div>
    );
  };

  return (
    <HydrateClient>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          background: "var(--sc-bg)",
          color: "var(--sc-white)",
        }}
      >
        {/* Cinematic Header */}
        <section
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              alt="Team Background"
              fill
              priority
              src={backsplash}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.3) saturate(0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 0%, var(--sc-bg) 100%)",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <div
              className="sc-label"
              style={{ color: "var(--sc-red)", marginBottom: "1rem" }}
            >
              THE CREW
            </div>
            <h1
              className="sc-heading"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: 0 }}
            >
              Meet the Team.
            </h1>
            <p
              style={{
                color: "var(--sc-grey-light)",
                marginTop: "1.5rem",
                fontSize: "1.1rem",
                maxWidth: "600px",
                margin: "1.5rem auto 0",
              }}
            >
              The minds behind the machine. A multidisciplinary student-run
              organization pushing the boundaries of renewable energy.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 20px 8rem",
            position: "relative",
            zIndex: 10,
          }}
        >
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

          {/* Alumni Section */}
          <div style={{ marginTop: "8rem" }}>
            <div
              className="sc-label"
              style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
            >
              LEGACY
            </div>
            <RoleSection members={alumniTeam || []} title="Alumni" />
          </div>
        </section>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Team;
