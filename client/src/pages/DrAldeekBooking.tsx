/* =============================================================================
   /dr-aldeek-booking — Dr. Al-Deek's Dedicated Booking Page
   Displays doctor name, credentials, and embedded GHL calendar widget.
   ============================================================================= */
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const BOOKING_WIDGET_URL =
  "https://link.sendmeapro.com/widget/booking/Ew0Y6y4FVcwaZeb9Y826";
const FORM_EMBED_SCRIPT =
  "https://link.sendmeapro.com/js/form_embed.js";

export default function DrAldeekBooking() {
  // Load the GHL form_embed.js script once on mount
  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src="${FORM_EMBED_SCRIPT}"]`
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = FORM_EMBED_SCRIPT;
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "Montserrat, sans-serif", background: "#FAFAFA" }}
    >
      <Helmet>
        <title>Book with Dr. Jumana Al-Deek, DO | MedMethod Direct</title>
        <meta
          name="description"
          content="Schedule your appointment with Dr. Jumana Al-Deek, DO — Board-Certified Physician specializing in hormone therapy, menopause care, and medical weight loss. 100% virtual."
        />
        <meta property="og:title" content="Book with Dr. Jumana Al-Deek, DO | MedMethod Direct" />
        <meta property="og:description" content="Schedule your virtual appointment with Dr. Jumana Al-Deek, DO — Board-Certified Physician specializing in hormone therapy, menopause care, and medical weight loss." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medmethoddirect.com/dr-aldeek-booking" />
        <meta property="og:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg" />
        <meta property="og:site_name" content="MedMethod Direct" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book with Dr. Jumana Al-Deek, DO | MedMethod Direct" />
        <meta name="twitter:description" content="Schedule your virtual appointment with Dr. Jumana Al-Deek, DO — Board-Certified Physician specializing in hormone therapy, menopause care, and medical weight loss." />
        <meta name="twitter:image" content="https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/telehealth-hero-single-face-v1_ad2544a9.jpg" />
      </Helmet>

      {/* Header */}
      <header
        className="w-full py-4 px-6"
        style={{
          background: "linear-gradient(135deg, #7A1E7E 0%, #E8339E 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-white font-bold text-lg tracking-tight">
            Med<span style={{ color: "#FFD6EC" }}>Method</span> Direct
          </a>
          <a
            href="tel:+18883627011"
            className="text-white/80 text-sm hover:text-white transition"
          >
            (888) 362-7011
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Doctor Info Section */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: "#1A1A2E" }}
          >
            Book Your Appointment
          </h1>
          <h2
            className="text-xl sm:text-2xl font-semibold mb-3"
            style={{ color: "#7A1E7E" }}
          >
            Dr. Jumana Al-Deek, DO
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Board-Certified Physician &bull; Menopause Specialist &bull;
            Metabolism &amp; Medical Weight Loss
          </p>
          <p className="text-xs text-gray-400 mt-2">
            100% Virtual &bull; Same Doctor, Every Visit
          </p>
        </div>

        {/* Calendar Embed */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          <div
            className="px-6 py-4 border-b border-gray-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(122,30,126,0.03) 0%, rgba(232,51,158,0.03) 100%)",
            }}
          >
            <p className="text-sm font-semibold text-gray-700">
              Select a date &amp; time below
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              All appointments are conducted via secure video call
            </p>
          </div>
          <iframe
            src={BOOKING_WIDGET_URL}
            style={{
              width: "100%",
              border: "none",
              overflow: "hidden",
              minHeight: "700px",
            }}
            scrolling="no"
            title="Book with Dr. Al-Deek"
            id="Ew0Y6y4FVcwaZeb9Y826_booking"
          />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          MedMethod Direct &bull; Physician-led virtual care &bull; Licensed in
          17 states
        </p>
      </main>
    </div>
  );
}
