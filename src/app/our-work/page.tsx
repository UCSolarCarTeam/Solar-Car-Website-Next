import Image from "next/image";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { getOurWork } from "./actions";

export const metadata = {
  title: "Our Work | Calgary Solar Car",
  description: "A timeline of our journey and engineering milestones.",
};

const OurWorkTimelinePage = async () => {
  const timelineData = await getOurWork();

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
            height: "40vh",
            minHeight: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundSize: "50px 50px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at center, transparent 0%, var(--sc-bg) 70%)",
              zIndex: 1,
            }}
          />

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
              TIMELINE
            </div>
            <h1
              className="sc-heading"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: 0 }}
            >
              What We&apos;re Working On.
            </h1>
          </div>
        </section>

        {/* Timeline Content */}
        <section
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "4rem 20px 8rem",
            position: "relative",
            zIndex: 10,
          }}
        >
          {!timelineData || timelineData.length === 0 ? (
            <div
              className="sc-mono"
              style={{ textAlign: "center", color: "var(--sc-grey-dim)" }}
            >
              {"// NO DATA AVAILABLE"}
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6rem" }}
            >
              {timelineData.map((yearData) => (
                <div key={yearData.year}>
                  {/* Year Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                      marginBottom: "3rem",
                    }}
                  >
                    <h2
                      className="sc-heading"
                      style={{
                        color: "var(--sc-amber)",
                        fontSize: "4rem",
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {yearData.year}
                    </h2>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "var(--sc-border)",
                      }}
                    />
                  </div>

                  {/* Months Grid */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "3rem",
                    }}
                  >
                    {yearData.months.map((month, index) => (
                      <div
                        key={index}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                          gap: "3rem",
                          background: "rgba(18, 18, 20, 0.5)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid var(--sc-border)",
                          borderRadius: "4px",
                          padding: "2rem",
                          alignItems: "center",
                        }}
                      >
                        {/* Image */}
                        {month.image && (
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              aspectRatio: "16/9",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <Image
                              alt={month.month}
                              fill
                              src={month.image}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div>
                          <div
                            className="sc-mono"
                            style={{
                              color: "var(--sc-red)",
                              fontSize: "0.9rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {"// UPDATE"}
                          </div>
                          <h3
                            className="sc-heading"
                            style={{
                              fontSize: "2rem",
                              marginBottom: "1rem",
                              color: "var(--sc-white)",
                            }}
                          >
                            {month.month}
                          </h3>
                          {month.description && (
                            <p
                              style={{
                                color: "var(--sc-grey-light)",
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {month.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OurWorkTimelinePage;
