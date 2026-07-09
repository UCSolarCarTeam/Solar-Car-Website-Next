"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { pageIds } from "@/app/cars/carInformation";
import SectionReveal from "@/components/ui/SectionReveal";

const CARS = Object.entries(pageIds).map(([id, data]) => ({ id, ...data }));

export default function CarShowcase() {
  return (
    <section
      style={{
        width: "100%",
        padding: "8rem 20px",
        background: "var(--sc-bg-surface)",
        borderTop: "1px solid var(--sc-border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionReveal>
          <div
            className="sc-label"
            style={{ color: "var(--sc-red)", marginBottom: "1rem" }}
          >
            THE FLEET
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
            }}
          >
            <h2
              className="sc-heading"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Generations of Innovation.
            </h2>
            <Link
              className="sc-mono"
              href="/cars"
              style={{
                color: "var(--sc-white)",
                textDecoration: "none",
                borderBottom: "1px solid var(--sc-red)",
                paddingBottom: "4px",
              }}
            >
              VIEW ALL VEHICLES
            </Link>
          </div>
        </SectionReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
          }}
        >
          {CARS.slice(0, 3).map((car, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              key={car.id}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link
                href="/cars"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/3",
                    overflow: "hidden",
                    borderRadius: "4px",
                    border: "1px solid var(--sc-border)",
                  }}
                >
                  <motion.div
                    style={{ width: "100%", height: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      alt={car.title}
                      fill
                      src={car.image}
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(10,10,11,0.9) 0%, transparent 60%)",
                      }}
                    />
                  </motion.div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      right: "20px",
                    }}
                  >
                    <div
                      className="sc-mono"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--sc-red)",
                        marginBottom: "4px",
                      }}
                    >
                      STATUS: {index === 0 ? "ACTIVE" : "RETIRED"}
                    </div>
                    <h3
                      className="sc-heading"
                      style={{
                        color: "var(--sc-white)",
                        fontSize: "1.5rem",
                        margin: 0,
                      }}
                    >
                      {car.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
