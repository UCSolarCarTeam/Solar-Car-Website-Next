import MissionDiagram from "./MissionDiagram";

export default function Mission() {
  return (
    <section className="w-full bg-sc-bg px-5 py-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-16">
        <div>
          <div className="sc-label mb-4 text-sc-red">OUR MISSION</div>
          <h2 className="sc-heading mb-6 text-[clamp(2rem,4vw,3rem)]">
            Pushing the Boundaries of Renewable Energy.
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-sc-grey-light">
            The University of Calgary Solar Car Team is a multidisciplinary,
            student-run organization dedicated to designing, building, and
            racing solar-powered vehicles.
          </p>
          <p className="text-lg leading-relaxed text-sc-grey-light">
            We provide students with hands-on engineering and business
            experience while promoting sustainable technology to the broader
            community. Our cars have competed globally, proving that solar power
            is not just viable, but highly competitive.
          </p>
        </div>

        <MissionDiagram />
      </div>
    </section>
  );
}
