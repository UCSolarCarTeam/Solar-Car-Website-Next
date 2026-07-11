import JoinCTAButton from "./JoinCTAButton";

export default function JoinCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-sc-bg px-5 py-40">
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(200,16,46,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-[800px] text-center">
        <div className="sc-label mb-4 text-sc-amber">JOIN THE TEAM</div>
        <h2 className="sc-heading mb-8 text-[clamp(3rem,6vw,5rem)] leading-tight">
          Build the Future of Transportation.
        </h2>
        <p className="mx-auto mb-12 max-w-[600px] text-xl leading-relaxed text-sc-grey-light">
          Whether you are an engineer, designer, or business student, there is a
          place for you on the team. Gain real-world experience and push the
          limits of solar technology.
        </p>

        <div className="flex justify-center">
          <JoinCTAButton />
        </div>
      </div>
    </section>
  );
}
