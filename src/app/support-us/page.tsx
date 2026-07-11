import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/support-us/backsplash.jpeg";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata = {
  title: "Support Us | Calgary Solar Car",
  description: "Support the University of Calgary Solar Car Team.",
};

const SupportUs = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg text-sc-white">
        <section className="relative flex min-h-[500px] h-[70vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Support Us Background"
              className="object-cover object-center brightness-[0.3] saturate-50"
              fill
              priority
              src={backsplash}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(200,16,46,0.2)_0%,transparent_60%),linear-gradient(to_bottom,transparent_0%,var(--sc-bg)_100%)]" />
          </div>

          <div className="relative z-10 px-5 text-center">
            <div className="sc-label mb-4 text-sc-red">SUPPORT OUR TEAM</div>
            <h1 className="sc-heading m-0 text-[clamp(3rem,6vw,5rem)]">
              Invest in Innovation.
            </h1>
            <p className="mx-auto mt-6 mb-12 max-w-[700px] text-xl leading-relaxed text-sc-grey-light">
              The University of Calgary Solar Car Team builds and operates our
              car and program through kind support from generous sponsors. You
              can support us through sponsoring, donating and helping us through
              in-kind donations.
            </p>

            <div className="flex justify-center">
              <MagneticButton className="border-none bg-sc-amber px-12 py-4 font-sans text-lg font-semibold tracking-wide text-sc-bg uppercase">
                <Link
                  className="text-inherit no-underline"
                  href="mailto:sponsorship@calgarysolarcar.ca"
                >
                  Sponsor, Contribute and Donate
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-[1000px] px-5 py-16 pb-32">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 border border-sc-border border-l-4 border-l-sc-red bg-[rgba(18,18,20,0.5)] p-16 backdrop-blur-md">
            <div>
              <div className="sc-mono mb-4 text-sc-amber">
                {"// WHY SUPPORT US?"}
              </div>
              <p className="m-0 leading-relaxed text-sc-grey-light">
                Your contributions directly fund the materials, logistics, and
                research required to build world-class solar vehicles. You are
                investing in the next generation of engineers, business leaders,
                and innovators.
              </p>
            </div>
            <div>
              <div className="sc-mono mb-4 text-sc-amber">
                {"// IN-KIND DONATIONS"}
              </div>
              <p className="m-0 leading-relaxed text-sc-grey-light">
                We also gladly accept in-kind donations such as tools, software
                licenses, manufacturing services, and raw materials. Every
                contribution helps us get closer to the finish line.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SupportUs;
