import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import { recruitmentOpen } from "@/flags";
import { HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "Recruitment | Calgary Solar Car",
  description:
    "Join the University of Calgary Solar Car Team and help build the future of sustainable transportation.",
};

const Recruitment = async () => {
  const isRecruitmentClosed = !(await recruitmentOpen());

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
            height: "60vh",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              alt="Solar Car Background"
              fill
              priority
              src={backsplash}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.4) saturate(0.8)",
              }}
            />
            {/* Vignette */}
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
              style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
            >
              JOIN THE TEAM
            </div>
            <h1
              className="sc-heading"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: 0 }}
            >
              Build the Future.
            </h1>
            <p
              className="sc-mono"
              style={{
                color: "var(--sc-grey-light)",
                marginTop: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              {isRecruitmentClosed
                ? "RECRUITMENT_STATUS: CLOSED"
                : "RECRUITMENT_STATUS: ACCEPTING_APPLICATIONS"}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "4rem 20px 8rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "rgba(18, 18, 20, 0.6)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--sc-border)",
              borderRadius: "4px",
              padding: "3rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            {!isRecruitmentClosed && (
              <div
                style={{
                  background: "rgba(200, 16, 46, 0.1)",
                  borderLeft: "2px solid var(--sc-red)",
                  padding: "1rem",
                  marginBottom: "3rem",
                }}
              >
                <span
                  className="sc-mono"
                  style={{ color: "var(--sc-amber)", fontSize: "0.9rem" }}
                >
                  {"// SYSTEM ALERT"}
                </span>
                <p style={{ margin: "0.5rem 0 0 0", color: "var(--sc-white)" }}>
                  Applications close on September 13th. Select a sub-team below
                  to begin your application.
                </p>
              </div>
            )}

            <RecruitmentForms isRecruitmentClosed={isRecruitmentClosed} />
          </div>
        </section>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Recruitment;
