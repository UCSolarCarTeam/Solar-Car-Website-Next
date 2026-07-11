import { cars } from "@/lib/cars";
import { cn } from "@/lib/utils";
import CarFleetCard from "./CarFleetCard";
import CarFleetEntry from "./CarFleetEntry";
import CarFleetImage from "./CarFleetImage";

export default function CarsFleetList() {
  return (
    <>
      {cars.map((car, index) => (
        <CarFleetEntry id={car.id} key={car.id}>
          <div
            className={cn(
              "flex min-h-0",
              index % 2 !== 0 && "md:order-2",
            )}
          >
            <CarFleetImage car={car} stretch />
          </div>
          <div
            className={cn(
              "flex min-h-0",
              index % 2 !== 0 && "md:order-1",
            )}
          >
            <CarFleetCard car={car} className="h-full w-full" />
          </div>
        </CarFleetEntry>
      ))}
    </>
  );
}
