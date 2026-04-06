import { useState } from "react";
import { Link } from "react-router-dom";

// ── Collections data ──────────────────────────────────────────────────────────
const COLLECTIONS = [
  {
    name: "Enchanted Romance",
    photo: "https://images.unsplash.com/photo-1584341745248-a93067c42e7c?auto=format&fit=crop&w=900&q=80",
    href: "/kootis-couture",
  },
  {
    name: "Celestial Grace",
    photo: "https://images.unsplash.com/photo-1710587385535-c406510a1c22?auto=format&fit=crop&w=900&q=80",
    href: "/kootis-couture",
  },
];

const REAL_BRIDES = [
  "https://images.unsplash.com/photo-1741900461083-46d7cf24a9fe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1643697706170-d2a1892155d1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1515647433590-bd29995561a4?auto=format&fit=crop&w=600&q=80",
];

// ── Newsletter form ───────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="w-full bg-couture-cream flex flex-col md:flex-row items-center justify-center gap-10 px-[80px] py-8">
      <span className="font-serif italic text-couture-charcoal" style={{ fontSize: "22px" }}>
        Join the Kootis Couture World
      </span>
      {submitted ? (
        <span className="font-sans text-couture-charcoal text-sm">Thank you for subscribing.</span>
      ) : (
        <form
          className="flex"
          onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-4 font-sans text-[13px] text-couture-charcoal placeholder:text-shared-grey-text border border-shared-grey-mid focus:outline-none focus:border-couture-gold bg-white"
            style={{ width: "280px" }}
          />
          <button
            type="submit"
            className="h-11 px-6 bg-couture-gold text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-couture-gold-dark transition"
          >
            SUBSCRIBE
          </button>
        </form>
      )}
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CoutureHome() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "720px" }}>
        <img
          src="https://images.unsplash.com/photo-1761569064977-f7bc70980478?auto=format&fit=crop&w=1600&q=80"
          alt="Kootis Couture hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.13) 50%, rgba(0,0,0,0.27) 100%)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p
            className="font-serif italic font-normal text-white text-center leading-relaxed"
            style={{ fontSize: "clamp(22px, 3vw, 36px)", maxWidth: "700px", lineHeight: 1.6 }}
          >
            We Believe There's A Difference Between Designing A Dress For Your Wedding And For Your Marriage.
          </p>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="flex flex-col items-center gap-12 px-[80px] pb-[80px] pt-0">
        <h2
          className="font-serif italic font-normal text-couture-gold-dark"
          style={{ fontSize: "38px" }}
        >
          Our Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {COLLECTIONS.map((col) => (
            <div key={col.name} className="flex flex-col items-center gap-5">
              <div className="w-full overflow-hidden" style={{ height: "680px" }}>
                <img
                  src={col.photo}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <span
                className="font-serif italic font-normal text-couture-gold"
                style={{ fontSize: "24px" }}
              >
                {col.name}
              </span>
              <Link
                to={col.href}
                className="inline-flex items-center justify-center font-sans font-medium text-couture-gold tracking-[0.2em] border border-couture-gold hover:bg-couture-gold hover:text-white transition"
                style={{ fontSize: "10px", padding: "12px 28px" }}
              >
                SEE ALL STYLES
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Real Brides ── */}
      <section className="flex flex-col items-center gap-10 bg-couture-cream px-[80px] py-[80px]">
        <h2
          className="font-serif italic font-normal text-couture-gold-dark tracking-wide"
          style={{ fontSize: "38px" }}
        >
          Real Brides
        </h2>
        <p
          className="font-sans font-normal text-shared-grey-text text-center leading-relaxed"
          style={{ fontSize: "15px", maxWidth: "600px", lineHeight: 1.7 }}
        >
          Our brides share their unforgettable moments wearing Kootis Couture on the most important day of their lives.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {REAL_BRIDES.map((src, i) => (
            <div key={i} className="w-full overflow-hidden rounded-sm" style={{ height: "480px" }}>
              <img
                src={src}
                alt={`Real bride ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "400px" }}>
        <img
          src="https://images.unsplash.com/photo-1681337150861-717596b6ffd4?auto=format&fit=crop&w=1600&q=80"
          alt="Book an appointment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(26,26,26,0.80) 0%, rgba(26,26,26,0.60) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <h2
            className="font-serif italic font-normal text-white"
            style={{ fontSize: "clamp(26px, 3.5vw, 42px)" }}
          >
            Your Dream Dress Awaits
          </h2>
          <p
            className="font-sans font-normal text-white/80 leading-relaxed"
            style={{ fontSize: "15px", maxWidth: "550px", lineHeight: 1.7 }}
          >
            Book a private appointment at our atelier and experience the Kootis Couture difference.
          </p>
          <Link
            to="/kootis-couture/book"
            className="inline-flex items-center justify-center bg-couture-gold text-white font-sans font-semibold tracking-[0.23em] hover:bg-couture-gold-dark transition"
            style={{ fontSize: "11px", padding: "14px 40px" }}
          >
            BOOK AN APPOINTMENT
          </Link>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <Newsletter />
    </div>
  );
}
