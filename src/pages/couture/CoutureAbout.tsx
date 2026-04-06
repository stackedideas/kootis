import { Link } from "react-router-dom";
import { Gem, ShieldCheck, Crown, Sparkles } from "lucide-react";

const VALUES = [
  {
    icon: Gem,
    heading: "CURATED EXCELLENCE",
    desc: "Every gown in our collection is hand-selected from the world's most prestigious bridal designers.",
  },
  {
    icon: ShieldCheck,
    heading: "QUALITY ASSURANCE",
    desc: "We guarantee the authenticity and quality of every designer piece, ensuring each gown meets the highest standards.",
  },
  {
    icon: Crown,
    heading: "OCCASION EXPERTISE",
    desc: "Our stylists bring years of bridal expertise, helping you navigate every detail from fabric to fit.",
  },
  {
    icon: Sparkles,
    heading: "THE KOOTIS EXPERIENCE",
    desc: "From private appointments to personalised styling, we create an intimate and unforgettable bridal experience.",
  },
];

export default function CoutureAbout() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "560px" }}>
        <img
          src="https://images.unsplash.com/photo-1735712954543-67a25a6998c8?auto=format&fit=crop&w=1600&q=80"
          alt="About Kootis Couture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.06) 40%, rgba(0,0,0,0) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h1
            className="font-serif font-light text-white tracking-[0.75em]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            ABOUT US
          </h1>
          <div className="w-[60px] h-px bg-couture-gold" />
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="flex flex-col items-center gap-10 px-6 md:px-[120px] py-[80px]">
        {/* Drop cap intro */}
        <div className="flex items-start justify-center gap-3 max-w-[750px]">
          <span
            className="font-serif font-semibold text-couture-gold leading-none shrink-0"
            style={{ fontSize: "80px", lineHeight: "0.85" }}
          >
            L
          </span>
          <p
            className="font-serif font-medium text-couture-charcoal tracking-[0.15em] leading-relaxed pt-2"
            style={{ fontSize: "20px", lineHeight: 1.8 }}
          >
            OCATED IN COUVA, CENTRAL TRINIDAD, KOOTIS HAS THE LARGEST SELECTION OF HIGH-END DESIGNER GOWNS IN THE COUNTRY.
          </p>
        </div>

        <p
          className="font-serif font-normal text-shared-grey-text text-center leading-relaxed"
          style={{ fontSize: "16px", maxWidth: "700px", lineHeight: 1.9 }}
        >
          Founded with a passion for bridal excellence, Kootis Couture has grown to become the Caribbean's premier destination for designer wedding gowns. Our carefully curated collection features the finest international designers, each piece selected for its exceptional craftsmanship, luxurious fabrics, and timeless elegance.
        </p>

        <p
          className="font-serif font-normal text-shared-grey-text text-center leading-relaxed"
          style={{ fontSize: "16px", maxWidth: "700px", lineHeight: 1.9 }}
        >
          Every bride who walks through our doors is treated to a personalised experience, guided by our expert stylists who understand that finding the perfect gown is about more than fashion — it's about capturing a feeling. From the moment you arrive, our team is dedicated to ensuring your journey to the aisle is as unforgettable as the day itself.
        </p>
      </section>

      {/* ── Pull Quote Section ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 w-full" style={{ minHeight: "500px" }}>
        {/* Gold quote panel */}
        <div className="bg-couture-gold flex flex-col justify-center gap-6 px-[60px] py-[80px]">
          <span
            className="font-serif font-normal text-white/27 leading-none"
            style={{ fontSize: "80px", lineHeight: "0.5" }}
          >
            "
          </span>
          <p
            className="font-serif italic font-normal text-white leading-relaxed"
            style={{ fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.7 }}
          >
            At Kootis Couture, we believe that every bride deserves to feel extraordinary. Our commitment goes beyond beautiful gowns — we create moments of pure magic that last a lifetime.
          </p>
          <span
            className="font-sans font-medium text-white/67 tracking-[0.25em]"
            style={{ fontSize: "11px" }}
          >
            — THE KOOTIS COUTURE TEAM
          </span>
        </div>

        {/* Photo */}
        <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
          <img
            src="https://images.unsplash.com/photo-1705643923958-30b5641ed101?auto=format&fit=crop&w=900&q=80"
            alt="Kootis Couture atelier"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Values Pillars ── */}
      <section className="flex flex-col items-center gap-12 px-[80px] py-[80px]">
        <h2
          className="font-serif italic font-normal text-couture-gold-dark"
          style={{ fontSize: "38px" }}
        >
          Our Promise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-full">
          {VALUES.map((v) => (
            <div key={v.heading} className="flex flex-col items-center gap-4 text-center">
              {/* Icon circle */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-couture-gold bg-couture-gold/10" />
                <v.icon size={28} className="text-couture-gold relative" />
              </div>
              <span
                className="font-sans font-semibold text-couture-charcoal tracking-[0.15em]"
                style={{ fontSize: "12px" }}
              >
                {v.heading}
              </span>
              <p
                className="font-serif font-normal text-shared-grey-text leading-relaxed"
                style={{ fontSize: "15px", lineHeight: 1.7 }}
              >
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center gap-6 bg-couture-cream px-6 py-12">
        <p className="font-serif italic text-couture-charcoal text-center" style={{ fontSize: "22px" }}>
          Ready to find your perfect gown?
        </p>
        <Link
          to="/kootis-couture/book"
          className="inline-flex items-center justify-center bg-couture-gold text-white font-sans font-semibold tracking-[0.2em] hover:bg-couture-gold-dark transition"
          style={{ fontSize: "11px", padding: "14px 40px" }}
        >
          BOOK AN APPOINTMENT
        </Link>
      </section>
    </div>
  );
}
