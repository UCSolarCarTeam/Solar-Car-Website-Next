import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/support-us/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata = {
  title: "Support Us | Calgary Solar Car",
  description: "Support the University of Calgary Solar Car Team.",
};

const SupportUs = () => {
  return (
    <>
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
            height: "70vh",
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              alt="Support Us Background"
              fill
              priority
              src={backsplash}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.3) saturate(0.5)",
              }}
            />
            {/* Red accent gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at bottom, rgba(200, 16, 46, 0.2) 0%, transparent 60%), linear-gradient(to bottom, transparent 0%, var(--sc-bg) 100%)",
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
              SUPPORT OUR TEAM
            </div>
            <h1
              className="sc-heading"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: 0 }}
            >
              Invest in Innovation.
            </h1>
            <p
              style={{
                color: "var(--sc-grey-light)",
                marginTop: "1.5rem",
                fontSize: "1.2rem",
                maxWidth: "700px",
                margin: "1.5rem auto 3rem",
                lineHeight: 1.6,
              }}
            >
              The University of Calgary Solar Car Team builds and operates our
              car and program through kind support from generous sponsors. You
              can support us through sponsoring, donating and helping us through
              in-kind donations.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <MagneticButton
                style={{
                  background: "var(--sc-amber)",
                  color: "var(--sc-bg)",
                  border: "none",
                  padding: "1rem 3rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontFamily: "var(--sc-font-sans)",
                }}
              >
                <Link
                  href="mailto:sponsorship@calgarysolarcar.ca"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Sponsor, Contribute and Donate
                </Link>
              </MagneticButton>
            </div>
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
              background: "rgba(18, 18, 20, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--sc-border)",
              borderLeft: "4px solid var(--sc-red)",
              padding: "4rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "3rem",
            }}
          >
            <div>
              <div
                className="sc-mono"
                style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
              >
                {"// WHY SUPPORT US?"}
              </div>
              <p
                style={{
                  color: "var(--sc-grey-light)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Your contributions directly fund the materials, logistics, and
                research required to build world-class solar vehicles. You are
                investing in the next generation of engineers, business leaders,
                and innovators.
              </p>
            </div>
            <div>
              <div
                className="sc-mono"
                style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
              >
                {"// IN-KIND DONATIONS"}
              </div>
              <p
                style={{
                  color: "var(--sc-grey-light)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                We also gladly accept in-kind donations such as tools, software
                licenses, manufacturing services, and raw materials. Every
                contribution helps us get closer to the finish line.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SupportUs;
