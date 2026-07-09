import { SponsorLevel } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionReveal from "@/components/ui/SectionReveal";
import type { RouterOutputs } from "@/trpc/react";
import { HydrateClient, trpc } from "@/trpc/server";
import { LeadSponsorCard, SponsorCard } from "./SponsorCards";

type Sponsor = RouterOutputs["fe"]["getSponsors"][0];

const SponsorLevelSection = ({
  title,
  description,
  sponsorLevel,
  sponsors,
  tierKey,
}: {
  title: string;
  description: string;
  sponsorLevel: SponsorLevel;
  sponsors: Sponsor[];
  tierKey: "gold" | "silver" | "bronze" | "friends";
}) => {
  const levelSponsors = sponsors.filter(
    (sponsor) => sponsor.sponsorLevel === sponsorLevel,
  );
  if (levelSponsors.length === 0) return null;

  return (
    <div style={{ marginBottom: "8rem" }}>
      <SectionReveal>
        <div
          style={{
            borderBottom: "1px solid var(--sc-border)",
            paddingBottom: "1rem",
            marginBottom: "4rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h2
            className="sc-heading"
            style={{ color: "var(--sc-white)", fontSize: "2.5rem", margin: 0 }}
          >
            {title}
          </h2>
          <p
            className="sc-mono"
            style={{
              color: "var(--sc-grey-light)",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            {"// "}
            {description}
          </p>
        </div>
      </SectionReveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "2rem",
        }}
      >
        {levelSponsors.map((sponsor, index) => (
          <SponsorCard
            href={sponsor.websiteUrl}
            index={index}
            key={sponsor.name}
            logoUrl={sponsor.logoUrl}
            name={sponsor.name}
            tier={tierKey}
          />
        ))}
      </div>
    </div>
  );
};

const Sponsors = async () => {
  const sponsors = await trpc.fe.getSponsors();

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
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              alt="Sponsors Background"
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
            <SectionReveal delay={0.2}>
              <div
                className="sc-label"
                style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
              >
                OUR PARTNERS
              </div>
              <h1
                className="sc-heading"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 6rem)",
                  margin: 0,
                  textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                Fueling Innovation.
              </h1>
              <p
                style={{
                  color: "var(--sc-grey-light)",
                  marginTop: "1.5rem",
                  fontSize: "1.2rem",
                  maxWidth: "650px",
                  margin: "1.5rem auto 0",
                  lineHeight: 1.6,
                }}
              >
                Our work is made possible by the generous support of our
                sponsors. They provide the resources we need to push the
                boundaries of renewable energy.
              </p>
            </SectionReveal>
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
          {/* Lead Sponsor */}
          <div style={{ marginBottom: "10rem", textAlign: "center" }}>
            <SectionReveal>
              <div
                className="sc-label"
                style={{ color: "var(--sc-red)", marginBottom: "1rem" }}
              >
                TITLE SPONSOR
              </div>
              <p
                className="sc-mono"
                style={{
                  color: "var(--sc-grey-light)",
                  fontSize: "1rem",
                  marginBottom: "4rem",
                }}
              >
                {
                  "// A special thank you to our kind donor, the faculty and everything they've done for us!"
                }
              </p>
            </SectionReveal>
            <LeadSponsorCard />
          </div>

          <SponsorLevelSection
            description="Thank you for helping our team educate future generations on the necessity of renewable resources!"
            sponsorLevel={SponsorLevel.Gold}
            sponsors={sponsors ?? []}
            tierKey="gold"
            title="Gold Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for giving us the ability to demonstrate that sustainable energy can be practical!"
            sponsorLevel={SponsorLevel.Silver}
            sponsors={sponsors ?? []}
            tierKey="silver"
            title="Silver Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for giving us the ability to demonstrate that sustainable energy can be practical!"
            sponsorLevel={SponsorLevel.Bronze}
            sponsors={sponsors ?? []}
            tierKey="bronze"
            title="Bronze Sponsors"
          />
          <SponsorLevelSection
            description="Thank you for helping us continue to innovate!"
            sponsorLevel={SponsorLevel.Friends}
            sponsors={sponsors ?? []}
            tierKey="friends"
            title="Friends of Solar Car"
          />
        </section>

        {/* Call to Action Section */}
        <section
          style={{
            width: "100%",
            padding: "8rem 20px",
            background: "var(--sc-bg-surface)",
            borderTop: "1px solid var(--sc-border)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60vw",
              height: "60vw",
              background:
                "radial-gradient(circle, rgba(245, 166, 35, 0.1) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            <SectionReveal>
              <div
                className="sc-label"
                style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
              >
                BECOME A SPONSOR
              </div>
              <h2
                className="sc-heading"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  marginBottom: "1.5rem",
                  lineHeight: 1.1,
                }}
              >
                Partner With Us.
              </h2>
              <p
                style={{
                  color: "var(--sc-grey-light)",
                  fontSize: "1.2rem",
                  lineHeight: 1.6,
                  marginBottom: "3rem",
                  maxWidth: "600px",
                  margin: "0 auto 3rem",
                }}
              >
                Join us in our mission to push the limits of sustainable
                technology. Your support enables our students to gain invaluable
                hands-on experience and innovate for a greener future.
              </p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link href="/support-us" style={{ textDecoration: "none" }}>
                  <MagneticButton
                    style={{
                      background: "var(--sc-amber)",
                      color: "var(--sc-bg)",
                      border: "none",
                      padding: "1rem 3rem",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      fontFamily: "var(--sc-font-sans)",
                    }}
                  >
                    View Sponsorship Package
                  </MagneticButton>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Sponsors;
