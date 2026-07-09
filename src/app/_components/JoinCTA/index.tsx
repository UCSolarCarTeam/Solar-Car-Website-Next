"use client";

import { useRouter } from "next/navigation";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionReveal from "@/components/ui/SectionReveal";

export default function JoinCTA() {
  const router = useRouter();

  return (
    <section
      style={{
        width: "100%",
        padding: "10rem 20px",
        background: "var(--sc-bg)",
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
            "radial-gradient(circle, rgba(200, 16, 46, 0.15) 0%, transparent 70%)",
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
            JOIN THE TEAM
          </div>
          <h2
            className="sc-heading"
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              marginBottom: "2rem",
              lineHeight: 1.1,
            }}
          >
            Build the Future of Transportation.
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
            Whether you are an engineer, designer, or business student, there is
            a place for you on the team. Gain real-world experience and push the
            limits of solar technology.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <MagneticButton
              onClick={() => router.push("/recruitment")}
              style={{
                background: "var(--sc-red)",
                color: "var(--sc-white)",
                border: "none",
                padding: "1rem 3rem",
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "var(--sc-font-sans)",
              }}
            >
              Apply Now
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
