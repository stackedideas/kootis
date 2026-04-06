import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Facebook, Instagram } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Drawer — slides in from the right */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[390px] bg-[#2A2A2A] flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ padding: "48px 40px 40px" }}
      >
        {/* Close button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white hover:text-couture-gold transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* Kootis Couture section */}
        <div className="flex flex-col gap-3 mb-6">
          <span
            className="font-display font-semibold tracking-[0.2em] text-couture-gold"
            style={{ fontSize: "14px" }}
          >
            KOOTIS COUTURE
          </span>
          <nav className="flex flex-col gap-0.5">
            {[
              { label: "About", href: "/kootis-couture/about" },
              { label: "Brands", href: "/kootis-couture/brands" },
              { label: "Media", href: "/kootis-couture/media" },
              { label: "Book an Appointment", href: "/kootis-couture/book" },
              { label: "Contact", href: "/kootis-couture/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="font-sans font-light text-white hover:text-couture-gold transition"
                style={{ fontSize: "22px", lineHeight: "1.8" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Gold divider */}
        <div className="w-full h-px bg-couture-gold my-2 opacity-60" />

        {/* The Body Shop section */}
        <div className="flex flex-col gap-3 my-6">
          <span
            className="font-sans font-semibold tracking-[0.2em] text-bodyshop-blush"
            style={{ fontSize: "14px" }}
          >
            THE BODY SHOP
          </span>
          <nav className="flex flex-col gap-0.5">
            {[
              { label: "New", href: "/the-body-shop/new" },
              { label: "Shoes", href: "/the-body-shop/shoes" },
              { label: "Handbags", href: "/the-body-shop/handbags" },
              { label: "Watches", href: "/the-body-shop/watches" },
              { label: "Accessories", href: "/the-body-shop/accessories" },
              { label: "Sale", href: "/the-body-shop/sale" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="font-sans font-light text-white hover:text-bodyshop-blush transition"
                style={{ fontSize: "22px", lineHeight: "1.8" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Gold divider */}
        <div className="w-full h-px bg-couture-gold my-2 opacity-60" />

        {/* Registry section */}
        <div className="flex flex-col gap-3 mt-6">
          <span
            className="font-serif italic text-[#F7F5F0]"
            style={{ fontSize: "16px" }}
          >
            The Registry
          </span>
          <nav className="flex flex-col gap-0.5">
            {[
              { label: "Browse Registry", href: "https://registrytt.com/" },
              { label: "Create Registry", href: "https://registrytt.com/" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="font-sans font-light text-white hover:text-couture-gold transition"
                style={{ fontSize: "22px", lineHeight: "1.8" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Spacer pushes socials to bottom */}
        <div className="flex-1" />

        {/* Social icons */}
        <div className="flex items-center justify-center gap-7">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-couture-gold hover:opacity-70 transition"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-couture-gold hover:opacity-70 transition"
          >
            <Instagram size={24} />
          </a>
          {/* WhatsApp */}
          <a
            href="https://wa.me/18686792025"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-couture-gold hover:opacity-70 transition"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
