import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "ABOUT", href: "/kootis-couture/about" },
  { label: "BRANDS", href: "/kootis-couture/brands" },
  { label: "MEDIA", href: "/kootis-couture/media" },
  { label: "BOOK AN APPOINTMENT", href: "/kootis-couture/book" },
  { label: "CONTACT", href: "/kootis-couture/contact" },
] as const;

export default function CoutureHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-couture-ivory transition-shadow duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        {/* Desktop header */}
        <div className="hidden md:flex flex-col items-center gap-6 pt-10 pb-5 px-[80px]">
          {/* Medallion logo */}
          <Link to="/kootis-couture" className="flex items-center justify-center">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-couture-gold" style={{ borderWidth: "1.5px" }} />
              {/* Inner ring */}
              <div className="absolute rounded-full border border-couture-gold" style={{ inset: "8px", borderWidth: "0.5px" }} />
              {/* Text */}
              <div className="flex flex-col items-center">
                <span
                  className="font-serif font-semibold text-couture-gold tracking-[0.25em]"
                  style={{ fontSize: "16px" }}
                >
                  KOOTIS
                </span>
                <span
                  className="font-serif font-medium text-couture-gold tracking-[0.5em]"
                  style={{ fontSize: "10px" }}
                >
                  COUTURE
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {NAV_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-couture-gold font-sans text-[11px]">|</span>
                )}
                <Link
                  to={link.href}
                  className={`font-sans text-[11px] tracking-[0.23em] transition-colors duration-150 ${
                    pathname === link.href
                      ? "text-couture-gold"
                      : "text-couture-charcoal hover:text-couture-gold"
                  }`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          {/* Bottom divider */}
          <div className="w-full h-px bg-shared-grey-mid opacity-40" />
        </div>

        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between h-16 px-5">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="text-couture-charcoal hover:text-couture-gold transition"
          >
            <Menu size={24} />
          </button>

          {/* Logo — centered */}
          <Link to="/kootis-couture" className="absolute left-1/2 -translate-x-1/2">
            <div className="relative w-[56px] h-[56px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-couture-gold" style={{ borderWidth: "1.5px" }} />
              <div className="absolute rounded-full border border-couture-gold" style={{ inset: "4px", borderWidth: "0.5px" }} />
              <div className="flex flex-col items-center">
                <span className="font-serif font-semibold text-couture-gold tracking-[0.2em]" style={{ fontSize: "8px" }}>
                  KOOTIS
                </span>
                <span className="font-serif font-medium text-couture-gold tracking-[0.3em]" style={{ fontSize: "6px" }}>
                  COUTURE
                </span>
              </div>
            </div>
          </Link>

          {/* Right spacer to balance the hamburger */}
          <div className="w-6" />
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
