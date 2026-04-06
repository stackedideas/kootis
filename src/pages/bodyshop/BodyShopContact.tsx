import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const REASONS = ["General Enquiry", "Order Support", "Returns & Exchanges", "Sizing Help", "Press & Media", "Other"];

export default function BodyShopContact() {
  const [form, setForm] = useState({ name: "", email: "", reason: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to /api/send-contact-reply
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center gap-3"
        style={{
          height: "250px",
          background: "linear-gradient(180deg, #E8A0A0 0%, rgba(212,137,137,0.5) 100%)",
        }}
      >
        <h1 className="font-serif italic text-white text-center" style={{ fontSize: "42px" }}>
          Get In Touch
        </h1>
        <nav className="flex items-center gap-2 font-sans text-white/80 text-center" style={{ fontSize: "13px" }}>
          <Link to="/the-body-shop" className="hover:text-white transition">Home</Link>
          <span>&gt;</span>
          <span>Contact</span>
        </nav>
      </section>

      {/* Two-col content */}
      <div
        className="flex flex-col lg:flex-row gap-12 items-start"
        style={{ padding: "60px 80px" }}
      >
        {/* Left: contact info */}
        <div className="flex flex-col gap-8 flex-1">
          <div>
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
              CONTACT INFORMATION
            </span>
            <p className="font-sans text-[#666] mt-3 leading-[1.7]" style={{ fontSize: "15px" }}>
              We'd love to hear from you. Whether you have a question about sizing, an order, or anything else — our team is ready to help.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { icon: Phone, label: "PHONE", value: "+1 (868) 679-2025", href: "tel:+18686792025" },
              { icon: Mail, label: "EMAIL", value: "info@kootiscouture.com", href: "mailto:info@kootiscouture.com" },
              { icon: MapPin, label: "ADDRESS", value: "Corner of Charlotte St. & Southern Main Road, Couva", href: null },
              { icon: Clock, label: "HOURS", value: "Mon–Sat: 9 AM – 6 PM | Sun: Closed", href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-bodyshop-blush/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-bodyshop-blush" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans font-semibold text-[#999] tracking-[0.2em]" style={{ fontSize: "10px" }}>{label}</span>
                  {href ? (
                    <a href={href} className="font-sans text-bodyshop-charcoal hover:text-bodyshop-blush transition" style={{ fontSize: "14px" }}>{value}</a>
                  ) : (
                    <span className="font-sans text-bodyshop-charcoal" style={{ fontSize: "14px" }}>{value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div
          className="flex flex-col gap-6 bg-white rounded-lg"
          style={{ width: "100%", maxWidth: "460px", padding: "32px", border: "1px solid #C9A96E" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <h2 className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "28px" }}>Message Sent!</h2>
              <p className="font-sans text-[#888]" style={{ fontSize: "14px" }}>
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-sans text-bodyshop-blush underline"
                style={{ fontSize: "13px" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
                SEND A MESSAGE
              </span>

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "name", placeholder: "Your name", label: "Name *", required: true },
                  { name: "email", placeholder: "your@email.com", label: "Email *", required: true, type: "email" },
                ].map(({ name, placeholder, label, required, type }) => (
                  <div key={name} className="flex flex-col gap-1.5">
                    <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>{label}</label>
                    <input
                      name={name}
                      type={type ?? "text"}
                      required={required}
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[name]}
                      onChange={handleChange}
                      className="h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                    />
                  </div>
                ))}
              </div>

              {/* Reason + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Reason</label>
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white appearance-none"
                  >
                    <option value="">Select...</option>
                    {REASONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Phone (optional)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (868) 555-0000"
                    className="h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Message *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="px-4 py-3 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] resize-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.2em] hover:bg-bodyshop-blush-dark transition"
                style={{ fontSize: "12px" }}
              >
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ padding: "0 80px 40px" }}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "12px" }}>
            FIND US
          </span>
        </div>
        <div
          className="w-full rounded-lg border border-[#E0D5D5] overflow-hidden bg-[#F0EDE8] flex items-center justify-center"
          style={{ height: "350px" }}
        >
          <div className="flex flex-col items-center gap-3 text-[#AAA]">
            <MapPin size={32} strokeWidth={1} />
            <span className="font-sans" style={{ fontSize: "14px" }}>
              Corner of Charlotte St. &amp; Southern Main Road, Couva, Trinidad
            </span>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section
        className="flex flex-col md:flex-row items-center justify-center gap-8 bg-[#FDF6F6]"
        style={{ padding: "40px 60px" }}
      >
        <span className="font-serif italic text-bodyshop-charcoal" style={{ fontSize: "22px" }}>
          Subscribe to our newsletter
        </span>
        <form className="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-[42px] px-4 font-sans text-[13px] border border-[#E0D5D5] focus:outline-none focus:border-bodyshop-blush bg-white"
            style={{ width: "280px" }}
          />
          <button
            type="submit"
            className="h-[42px] px-6 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-bodyshop-blush-dark transition"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>
    </div>
  );
}
