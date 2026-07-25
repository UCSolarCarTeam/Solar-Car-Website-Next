import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function JoinCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-sc-bg px-5 py-40">
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(200,16,46,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-200 text-center">
        <div className="sc-label mb-4 text-sc-amber">JOIN THE TEAM</div>
        <h2 className="sc-heading mb-8 text-[clamp(3rem,6vw,5rem)] leading-tight">
          Build the Future of Transportation.
        </h2>
        <p className="mx-auto mb-12 max-w-150 text-xl leading-relaxed text-sc-grey-light">
          Whether you are an engineer, designer, or business student, there is a
          place for you on the team. Gain real-world experience and push the
          limits of solar technology.
        </p>

        <div className="flex justify-center">
          <MagneticButton className="border-none bg-sc-red px-12 py-4 font-sans text-lg font-semibold tracking-widest text-sc-white uppercase">
            <Link className="text-inherit no-underline" href="/recruitment">
              Apply Now
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
