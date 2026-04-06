import { Link } from "react-router-dom";

const COLS = [
  {
    title: "SHOP",
    links: [
      { label: "New Arrivals", href: "/the-body-shop/new" },
      { label: "Shoes", href: "/the-body-shop/shoes" },
      { label: "Handbags", href: "/the-body-shop/handbags" },
      { label: "Watches", href: "/the-body-shop/watches" },
      { label: "Accessories", href: "/the-body-shop/accessories" },
    ],
  },
  {
    title: "CUSTOMER CARE",
    links: [
      { label: "Shipping & Returns", href: "#" },
      { label: "Size Guide", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Contact Us", href: "/the-body-shop/contact" },
    ],
  },
  {
    title: "THE BRAND",
    links: [
      { label: "Our Story", href: "/kootis-couture/about" },
      { label: "Kootis Couture", href: "/kootis-couture" },
      { label: "The Registry", href: "https://registrytt.com/", external: true },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "Pinterest", href: "https://pinterest.com", external: true },
      { label: "TikTok", href: "https://tiktok.com", external: true },
    ],
  },
] as const;

export default function BodyShopFooter() {
  return (
    <footer className="bg-[#333333] w-full">
      <div className="px-4 md:px-[60px] pt-12 pb-8 flex flex-col gap-9">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span
                className="font-sans font-semibold text-bodyshop-blush tracking-[0.2em]"
                style={{ fontSize: "10px" }}
              >
                {col.title}
              </span>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) =>
                  "external" in link && link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-[13px] text-white/60 hover:text-white transition"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="font-sans text-[13px] text-white/60 hover:text-white transition"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10" />

        {/* Copyright */}
        <div className="flex justify-center">
          <span
            className="font-sans text-white tracking-[0.08em]"
            style={{ fontSize: "11px" }}
          >
            © 2026 The Body Shop by Kootis. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
