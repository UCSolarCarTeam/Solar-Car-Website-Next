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
    <main style={{ height: "auto" }}>
      <div className={styles.snapContainer}>
        <Pagebullets defaultCurrentId="Helios" pageIds={Object.keys(pageIds)} />
        {Object.entries(pageIds).map(([id, value], index) => (
          <CarScreenView
            className={styles.snapItem}
            content={value.content}
            footerEnabled={index === Object.keys(pageIds).length - 1}
            id={id}
            image={value.image}
            key={id}
            navbarEnabled={index === 0}
            position={value.position as "left" | "right"}
            title={value.title}
          />
        ))}
      </div>
    </main>
  );
};

export default Cars;
