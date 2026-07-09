import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg"; // using as main header bg
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { pageIds } from "@/app/cars/carInformation";

export const metadata = {
  title: "Cars | Calgary Solar Car",
  description:
    "Explore the fleet of solar-powered vehicles engineered by the University of Calgary.",
};

const CARS = Object.entries(pageIds).map(([id, data], index) => {
  // Infer some stats from the text for the telemetry vibe
  let status = "RETIRED";
  if (id === "Helios" || id === "Elysia") status = "ACTIVE";

  let carClass = "CHALLENGER";
  if (id === "Elysia" || id === "Delta") carClass = "CRUISER";

  return { id, ...data, status, carClass, index };
});

const Cars = () => {
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
              alt="Fleet Background"
              fill
              priority
              src={backsplash}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.4) saturate(0.8)",
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
              style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
            >
              VEHICLE ARCHIVE
            </div>
            <h1
              className="sc-heading"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", margin: 0 }}
            >
              The Fleet.
            </h1>
            <p
              className="sc-mono"
              style={{
                color: "var(--sc-grey-light)",
                marginTop: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              {"// GENERATIONS OF ENGINEERING EXCELLENCE"}
            </p>
          </div>
        </section>

        {/* Cars List */}
        <section
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "4rem 20px 8rem",
            display: "flex",
            flexDirection: "column",
            gap: "8rem",
          }}
        >
          {CARS.map((car) => (
            <div
              key={car.id}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "4rem",
                alignItems: "center",
                direction: car.index % 2 !== 0 ? "rtl" : "ltr",
              }}
            >
              {/* Image Container with Telemetry Border */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16/10",
                  direction: "ltr",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "-10px",
                    border: "1px solid rgba(245, 166, 35, 0.3)", // amber border
                    zIndex: 0,
                  }}
                />

                {/* Corner Accents */}
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    left: "-15px",
                    width: "15px",
                    height: "15px",
                    borderTop: "2px solid var(--sc-amber)",
                    borderLeft: "2px solid var(--sc-amber)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-15px",
                    right: "-15px",
                    width: "15px",
                    height: "15px",
                    borderBottom: "2px solid var(--sc-amber)",
                    borderRight: "2px solid var(--sc-amber)",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    zIndex: 1,
                  }}
                >
                  <Image
                    alt={car.title}
                    fill
                    src={car.image}
                    style={{ objectFit: "cover" }}
                  />
                  {/* Subtle vignette over the car image */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxShadow: "inset 0 0 100px rgba(10,10,11,0.5)",
                    }}
                  />
                </div>
              </div>

              {/* Data Panel */}
              <div style={{ direction: "ltr" }}>
                <div
                  style={{
                    background: "rgba(18, 18, 20, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid var(--sc-border)",
                    borderLeft: `4px solid ${car.status === "ACTIVE" ? "var(--sc-red)" : "var(--sc-grey-dim)"}`,
                    padding: "2.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2rem",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <h2
                      className="sc-heading"
                      style={{ fontSize: "2.5rem", margin: 0 }}
                    >
                      {car.title}
                    </h2>

                    {/* Status Badge */}
                    <div
                      className="sc-mono"
                      style={{
                        background:
                          car.status === "ACTIVE"
                            ? "rgba(200, 16, 46, 0.2)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          car.status === "ACTIVE"
                            ? "var(--sc-red)"
                            : "var(--sc-grey-light)",
                        padding: "4px 10px",
                        borderRadius: "2px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      STATUS: {car.status}
                    </div>
                  </div>

                  <div
                    className="sc-mono"
                    style={{
                      display: "flex",
                      gap: "2rem",
                      marginBottom: "2rem",
                      color: "var(--sc-amber)",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "var(--sc-grey-dim)",
                          marginBottom: "4px",
                          fontSize: "0.75rem",
                        }}
                      >
                        CLASS
                      </div>
                      {car.carClass}
                    </div>
                    <div>
                      <div
                        style={{
                          color: "var(--sc-grey-dim)",
                          marginBottom: "4px",
                          fontSize: "0.75rem",
                        }}
                      >
                        MODEL_ID
                      </div>
                      SC-{6 - car.index}
                    </div>
                  </div>

                  <p
                    style={{
                      color: "var(--sc-grey-light)",
                      lineHeight: 1.7,
                      fontSize: "1.1rem",
                      margin: 0,
                    }}
                  >
                    {car.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Cars;
