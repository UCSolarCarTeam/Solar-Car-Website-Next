import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          background: "var(--sc-bg)",
          padding: "120px 20px 80px",
          color: "var(--sc-grey-light)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            className="sc-label"
            style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
          >
            LEGAL
          </div>
          <h1
            className="sc-heading"
            style={{
              color: "var(--sc-white)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              marginBottom: "3rem",
            }}
          >
            Privacy Policy
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            <section>
              <h2
                className="sc-heading"
                style={{
                  color: "var(--sc-white)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
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
              <h2
                className="sc-heading"
                style={{
                  color: "var(--sc-white)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
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
              <h2
                className="sc-heading"
                style={{
                  color: "var(--sc-white)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
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
              <h2
                className="sc-heading"
                style={{
                  color: "var(--sc-white)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                4. Contact Us
              </h2>
              <p>
                If you have questions or comments about this notice, you may
                email us at communications@calgarysolarcar.ca or by post to:
              </p>
              <address
                className="sc-mono"
                style={{
                  fontStyle: "normal",
                  marginTop: "1rem",
                  color: "var(--sc-grey-dim)",
                }}
              >
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
