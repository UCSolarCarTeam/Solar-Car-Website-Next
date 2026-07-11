import Image from "next/image";
import Link from "next/link";
import { cars } from "@/lib/cars";
import CarCardHover from "./CarCardHover";
import CarShowcaseCardEntrance from "./CarShowcaseCardEntrance";

export default function CarShowcase() {
  return (
    <section className="w-full border-t border-sc-border bg-sc-bg-surface px-5 py-20 sm:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-12">
          <div className="sc-label mb-4 text-sc-red">THE FLEET</div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="sc-heading text-[clamp(2rem,4vw,3rem)]">
              Generations of Innovation.
            </h2>
            <Link
              className="sc-mono w-fit shrink-0 border-b border-sc-red pb-1 text-sm text-sc-white no-underline sm:text-base"
              href="/cars"
            >
              VIEW ALL VEHICLES
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {cars.slice(0, 3).map((car, index) => (
            <CarShowcaseCardEntrance index={index} key={car.id}>
              <Link className="block no-underline" href="/cars">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-sc-border">
                  <CarCardHover>
                    <div className="relative h-full w-full">
                      <Image
                        alt={car.title}
                        className="object-cover"
                        fill
                        src={car.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,11,0.9)] from-0% to-transparent to-60%" />
                    </div>
                  </CarCardHover>

                  <div className="absolute inset-x-5 bottom-5">
                    <div className="sc-mono mb-1 text-xs text-sc-red">
                      {car.status === "ACTIVE"
                        ? "STATUS: ACTIVE"
                        : `STATUS: RETIRED · ${car.retired ?? car.serviceYears}`}
                    </div>
                    <h3 className="sc-heading m-0 text-2xl text-sc-white">
                      {car.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </CarShowcaseCardEntrance>
          ))}
        </div>
      </div>
    </section>
  );
}
