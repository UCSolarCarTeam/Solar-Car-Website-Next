import Footer from "@/app/_components/Footer";
import CarsFleetList from "@/app/_components/Cars/CarsFleetList";
import CarsHero from "@/app/_components/Cars/CarsHero";
import FleetTimeline from "@/app/_components/Cars/FleetTimeline";
import { FleetHighlightProvider } from "@/app/_components/Cars/FleetHighlight/FleetHighlightProvider";
import Navbar from "@/app/_components/Navbar";

export const metadata = {
  title: "Cars | Calgary Solar Car",
  description:
    "Explore the fleet of solar-powered vehicles engineered by the University of Calgary.",
};

const Cars = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <CarsHero />

        <FleetHighlightProvider>
          <section className="mx-auto flex max-w-[1400px] flex-col gap-32 px-5 py-16 pb-32">
            <CarsFleetList />
            <FleetTimeline />
          </section>
        </FleetHighlightProvider>
      </main>
      <Footer />
    </>
  );
};

export default Cars;
