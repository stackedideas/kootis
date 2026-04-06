import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageSquare, HelpCircle, FileText, Shield, Phone, Mail, MapPin } from "lucide-react";

const REASONS = [
  "General Enquiry",
  "Appointment Request",
  "Bridal Consultation",
  "Returns & Exchanges",
  "Other",
];

const SIDEBAR_LINKS = [
  { icon: Calendar, label: "Book an Appointment", href: "/kootis-couture/book", active: false },
  { icon: MessageSquare, label: "Contact Us", href: "/kootis-couture/contact", active: true },
  { icon: HelpCircle, label: "FAQ", href: "#", active: false },
  { icon: FileText, label: "Terms & Conditions", href: "#", active: false },
  { icon: Shield, label: "Privacy Policy", href: "#", active: false },
];

export default function CoutureContact() {
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
      {/* ── Page body — sidebar + form ── */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <div
          className="flex flex-col gap-8 px-10 py-12 border-l-[3px] border-couture-gold shrink-0"
          style={{ width: "100%", maxWidth: "360px" }}
        >
          <span
            className="font-sans font-semibold text-shared-grey-text tracking-[0.3em]"
            style={{ fontSize: "10px" }}
          >
            NAVIGATION
          </span>
          <nav className="flex flex-col gap-6">
            {SIDEBAR_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 font-sans transition ${
                  item.active
                    ? "text-couture-gold font-bold"
                    : "text-couture-charcoal hover:text-couture-gold"
                }`}
                style={{ fontSize: "14px" }}
              >
                <item.icon size={18} className="text-couture-gold shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Form */}
        <div className="flex-1 px-[60px] py-12">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <h2 className="font-serif italic text-couture-gold-dark" style={{ fontSize: "32px" }}>
                Message Sent
              </h2>
              <p className="font-sans text-shared-grey-text" style={{ fontSize: "15px" }}>
                Thank you for reaching out. Our team will respond within 24 hours.
              </p>
              <Link
                to="/kootis-couture"
                className="mt-4 font-sans font-semibold text-couture-gold tracking-[0.15em] border border-couture-gold hover:bg-couture-gold hover:text-white transition"
                style={{ fontSize: "11px", padding: "12px 32px" }}
              >
                BACK TO HOME
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[700px]">
              <div>
                <span
                  className="font-sans font-semibold text-couture-gold tracking-[0.3em]"
                  style={{ fontSize: "14px" }}
                >
                  CONTACT US
                </span>
                <p
                  className="font-serif font-normal text-shared-grey-text mt-2 leading-relaxed"
                  style={{ fontSize: "16px", lineHeight: 1.7 }}
                >
                  We'd love to hear from you. Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {/* Row 1: Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-medium text-couture-charcoal tracking-[0.08em]" style={{ fontSize: "11px" }}>
                    Name *
                  </label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="h-11 px-[14px] bg-[#F8F8F6] border border-shared-grey-light font-sans text-[13px] text-couture-charcoal focus:outline-none focus:border-couture-gold transition"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-medium text-couture-charcoal tracking-[0.08em]" style={{ fontSize: "11px" }}>
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="h-11 px-[14px] bg-[#F8F8F6] border border-shared-grey-light font-sans text-[13px] text-couture-charcoal focus:outline-none focus:border-couture-gold transition"
                  />
                </div>
              </div>

              {/* Row 2: Reason + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-medium text-couture-charcoal tracking-[0.08em]" style={{ fontSize: "11px" }}>
                    Reason for Contacting
                  </label>
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="h-11 px-[14px] bg-[#F8F8F6] border border-shared-grey-light font-sans text-[13px] text-couture-charcoal focus:outline-none focus:border-couture-gold transition appearance-none"
                  >
                    <option value="">Select a reason</option>
                    {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans font-medium text-couture-charcoal tracking-[0.08em]" style={{ fontSize: "11px" }}>
                    Phone Number (optional)
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="h-11 px-[14px] bg-[#F8F8F6] border border-shared-grey-light font-sans text-[13px] text-couture-charcoal focus:outline-none focus:border-couture-gold transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="font-sans font-medium text-couture-charcoal tracking-[0.08em]" style={{ fontSize: "11px" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="px-[14px] py-3 bg-[#F8F8F6] border border-shared-grey-light font-sans text-[13px] text-couture-charcoal placeholder:text-shared-grey-text focus:outline-none focus:border-couture-gold transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-couture-gold text-white font-sans font-semibold tracking-[0.25em] hover:bg-couture-gold-dark transition"
                style={{ fontSize: "12px" }}
              >
                SUBMIT
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Contact Info Strip ── */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-couture-ivory px-[80px] py-10">
        <div className="flex items-center gap-3">
          <Phone size={20} className="text-couture-gold shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-sans font-semibold text-shared-grey-text tracking-[0.2em]" style={{ fontSize: "10px" }}>PHONE</span>
            <a href="tel:+18686792025" className="font-sans text-couture-charcoal hover:text-couture-gold transition" style={{ fontSize: "14px" }}>
              +1 (868) 679-2025
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-couture-gold shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-sans font-semibold text-shared-grey-text tracking-[0.2em]" style={{ fontSize: "10px" }}>EMAIL</span>
            <a href="mailto:info@kootiscouture.com" className="font-sans text-couture-charcoal hover:text-couture-gold transition" style={{ fontSize: "14px" }}>
              info@kootiscouture.com
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-couture-gold shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-sans font-semibold text-shared-grey-text tracking-[0.2em]" style={{ fontSize: "10px" }}>ADDRESS</span>
            <span className="font-sans text-couture-charcoal" style={{ fontSize: "14px" }}>
              Corner of Charlotte St. & Southern Main Road, Couva
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
