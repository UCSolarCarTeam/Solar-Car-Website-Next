import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-sc-bg px-5 pt-[120px] pb-20 text-sc-grey-light">
        <div className="mx-auto max-w-[800px]">
          <div className="sc-label mb-4 text-sc-amber">LEGAL</div>
          <h1 className="sc-heading mb-12 text-[clamp(2.5rem,5vw,4rem)] text-sc-white">
            Privacy Policy
          </h1>

          <div className="flex flex-col gap-8 text-lg leading-relaxed">
            <section>
              <h2 className="sc-heading mb-4 text-2xl text-sc-white">
                1. Information We Collect
              </h2>
              <p>
                The University of Calgary Solar Car Team collects information
                that you voluntarily provide to us when you express an interest
                in obtaining information about us or our products and services,
                when you participate in activities on the website, or otherwise
                when you contact us.
              </p>
            </section>

            <section>
              <h2 className="sc-heading mb-4 text-2xl text-sc-white">
                2. How We Use Your Information
              </h2>
              <p>
                We use personal information collected via our website for a
                variety of business purposes described below. We process your
                personal information for these purposes in reliance on our
                legitimate business interests, in order to enter into or perform
                a contract with you, with your consent, and/or for compliance
                with our legal obligations.
              </p>
            </section>

            <section>
              <h2 className="sc-heading mb-4 text-2xl text-sc-white">
                3. Analytics & Cookies
              </h2>
              <p>
                We may use cookies and similar tracking technologies (like web
                beacons and pixels) to access or store information. We also use
                analytics tools (such as Vercel Speed Insights and Web
                Analytics) to help us measure traffic and usage trends for the
                service.
              </p>
            </section>

            <section>
              <h2 className="sc-heading mb-4 text-2xl text-sc-white">
                4. Contact Us
              </h2>
              <p>
                If you have questions or comments about this notice, you may
                email us at communications@calgarysolarcar.ca or by post to:
              </p>
              <address className="sc-mono mt-4 not-italic text-sc-grey-dim">
                University of Calgary Solar Car Team
                <br />
                ENC 36, Schulich School of Engineering
                <br />
                2500 University Dr NW
                <br />
                Calgary, AB T2N 1N4
                <br />
                Canada
              </address>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
