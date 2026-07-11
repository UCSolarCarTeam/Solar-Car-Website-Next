import Image from "next/image";
import backsplash from "public/assets/home/backsplash.jpeg";

export default function CarsHero() {
  return (
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
  );
}
