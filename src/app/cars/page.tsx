import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import CarsFleetList from "@/app/_components/Cars/CarsFleetList";
import CarsHero from "@/app/_components/Cars/CarsHero";
import FleetTimeline from "@/app/_components/Cars/FleetTimeline";
import { FleetHighlightProvider } from "@/app/_components/Cars/FleetHighlight/FleetHighlightProvider";
import Navbar from "@/app/_components/Navbar";
import { pageIds } from "@/app/cars/carInformation";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Cars | Calgary Solar Car",
  description:
    "Explore the fleet of solar-powered vehicles engineered by the University of Calgary.",
};

const CARS = Object.entries(pageIds).map(([id, data], index) => {
  let status = "RETIRED";
  if (id === "Helios") status = "ACTIVE";

  let carClass = "CHALLENGER";
  if (id === "Elysia" || id === "Delta") carClass = "CRUISER";

  return { id, ...data, status, carClass, index };
});

const Cars = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-[400px] h-[50vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Fleet Background"
              className="object-cover object-center brightness-[0.4] saturate-[0.8]"
              fill
              priority
              src={backsplash}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sc-bg" />
          </div>

          <div className="relative z-10 px-5 text-center">
            <div className="sc-label mb-4 text-sc-amber">VEHICLE ARCHIVE</div>
            <h1 className="sc-heading m-0 text-[clamp(3rem,6vw,5rem)]">
              The Fleet.
            </h1>
            <p className="sc-mono mt-6 text-lg text-sc-grey-light">
              {"// GENERATIONS OF ENGINEERING EXCELLENCE"}
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-[1400px] flex-col gap-32 px-5 py-16 pb-32">
          {CARS.map((car) => (
            <div
              className="grid grid-cols-1 items-center gap-16 md:grid-cols-2"
              key={car.id}
            >
              <div
                className={cn(
                  "relative aspect-[16/10] w-full",
                  car.index % 2 !== 0 && "md:order-2",
                )}
              >
                <div className="absolute -inset-2.5 z-0 border border-sc-amber/30" />
                <div className="absolute -top-[15px] -left-[15px] z-0 h-[15px] w-[15px] border-t-2 border-l-2 border-sc-amber" />
                <div className="absolute -right-[15px] -bottom-[15px] z-0 h-[15px] w-[15px] border-r-2 border-b-2 border-sc-amber" />

                <div className="relative z-[1] h-full w-full overflow-hidden">
                  <Image
                    alt={car.title}
                    className="object-cover"
                    fill
                    src={car.image}
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(10,10,11,0.5)]" />
                </div>
              </div>

              <div className={cn(car.index % 2 !== 0 && "md:order-1")}>
                <div
                  className={cn(
                    "border border-sc-border bg-[rgba(18,18,20,0.5)] p-10 backdrop-blur-md border-l-4",
                    car.status === "ACTIVE"
                      ? "border-l-sc-red"
                      : "border-l-sc-grey-dim",
                  )}
                >
                  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <h2 className="sc-heading m-0 text-4xl">{car.title}</h2>
                    <div
                      className={cn(
                        "sc-mono rounded-sm px-2.5 py-1 text-sm font-semibold",
                        car.status === "ACTIVE"
                          ? "bg-sc-red/20 text-sc-red"
                          : "bg-white/5 text-sc-grey-light",
                      )}
                    >
                      STATUS: {car.status}
                    </div>
                  </div>

                  <div className="sc-mono mb-8 flex gap-8 text-sm text-sc-amber">
                    <div>
                      <div className="mb-1 text-xs text-sc-grey-dim">CLASS</div>
                      {car.carClass}
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-sc-grey-dim">
                        MODEL_ID
                      </div>
                      SC-{6 - car.index}
                    </div>
                  </div>

                  <p className="m-0 text-lg leading-relaxed text-sc-grey-light">
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
