"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const navLinks = [
  { label: "New", href: "/the-body-shop/new", key: "new" },
  { label: "Shoes", href: "/the-body-shop/shoes", key: "shoes" },
  { label: "Handbags", href: "/the-body-shop/handbags", key: "handbags" },
  { label: "Watches", href: "/the-body-shop/watches", key: "watches" },
  {
    label: "Accessories",
    href: "/the-body-shop/accessories",
    key: "accessories",
  },
  { label: "Contact", href: "/the-body-shop/contact", key: "contact" },
] as const;

interface BodyShopHeaderProps {
  /** Which nav link is currently active. */
  activeLink?:
    | "new"
    | "shoes"
    | "handbags"
    | "watches"
    | "accessories"
    | "contact"
    | "sale"
    | null;
  /** Number of items in the cart. Shows a badge when > 0. */
  cartItemCount?: number;
  /** Callback when the search icon is clicked. */
  onSearchClick?: () => void;
  /** Callback when the cart icon is clicked. */
  onCartClick?: () => void;
}

/**
 * BodyShopHeader — Main navigation header for The Body Shop by Kootis.
 *
 * Desktop: Text logo left, centered nav links (Outfit 13px), search/cart/SALE pill right.
 * Mobile: Logo left, SALE pill center, hamburger right with slide-down drawer.
 * Sticky with scroll shadow. Active nav link uses blush text color.
 * Logo is text-based: "THE BODY SHOP" (Cormorant Garamond bold 26px) + "by Kootis" (italic 14px blush).
 */
export default function BodyShopHeader({
  activeLink = null,
  onSearchClick,
}: Omit<BodyShopHeaderProps, "cartItemCount" | "onCartClick">) {
  const cartItemCount = useCartStore((s) => s.totalItems());
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Sticky shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = useCallback(
    (key: string) => activeLink?.toLowerCase() === key.toLowerCase(),
    [activeLink]
  );

  const closeDrawer = () => setDrawerOpen(false);

  const Logo = ({ className = "" }: { className?: string }) => (
    <Link to="/the-body-shop" className={`shrink-0 flex flex-col ${className}`}>
      <span
        className="font-serif font-bold text-bodyshop-charcoal leading-tight"
        style={{ fontSize: "26px", letterSpacing: "4px" }}
      >
        THE BODY SHOP
      </span>
      <span className="font-serif italic text-bodyshop-blush text-sm">
        by Kootis
      </span>
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between h-20 px-[60px]">
        <Logo />

        {/* Center nav */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              className={`text-[13px] font-sans transition ${
                isActive(link.key)
                  ? "text-bodyshop-blush font-medium"
                  : "text-bodyshop-charcoal hover:text-bodyshop-blush"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            type="button"
            onClick={() => {
              if (onSearchClick) onSearchClick();
              else navigate("/the-body-shop/search");
            }}
            className="text-bodyshop-charcoal hover:text-bodyshop-blush transition cursor-pointer"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate("/the-body-shop/cart")}
            className="relative text-bodyshop-charcoal hover:text-bodyshop-blush transition cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-bodyshop-blush text-white text-[10px] font-semibold leading-none">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>

          {/* SALE pill */}
          <Link
            to="/the-body-shop/sale"
            className="inline-flex items-center justify-center rounded-pill bg-bodyshop-blush text-white font-sans font-bold uppercase hover:bg-bodyshop-blush-dark transition"
            style={{ fontSize: "10px", letterSpacing: "2px", padding: "6px 18px" }}
          >
            SALE
          </Link>
        </div>
      </div>

      {/* 1px divider */}
      <div className="hidden md:block h-px w-full bg-shared-grey-light" />

      {/* Mobile header */}
      <div className="flex md:hidden items-center justify-between h-16 px-4">
        <Link to="/the-body-shop" className="shrink-0 flex flex-col">
          <span
            className="font-serif font-bold text-bodyshop-charcoal leading-tight"
            style={{ fontSize: "17px", letterSpacing: "3px" }}
          >
            THE BODY SHOP
          </span>
          <span className="font-serif italic text-bodyshop-blush" style={{ fontSize: "11px" }}>
            by Kootis
          </span>
        </Link>

        {/* SALE pill center */}
        <Link
          to="/the-body-shop/sale"
          className="inline-flex items-center justify-center rounded-pill bg-bodyshop-blush text-white font-sans font-bold uppercase"
          style={{ fontSize: "10px", letterSpacing: "2px", padding: "6px 18px" }}
        >
          SALE
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="text-bodyshop-charcoal cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-shared-grey-light">
          <Link to="/the-body-shop" onClick={closeDrawer} className="shrink-0">
            <span
              className="font-serif font-bold text-bodyshop-charcoal leading-tight"
              style={{ fontSize: "20px", letterSpacing: "3px" }}
            >
              THE BODY SHOP
            </span>
          </Link>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-bodyshop-charcoal cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="px-4">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              onClick={closeDrawer}
              className={`block text-lg py-4 border-b border-shared-grey-light font-sans transition ${
                isActive(link.key)
                  ? "text-bodyshop-blush font-semibold"
                  : "text-bodyshop-charcoal hover:text-bodyshop-blush"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* SALE link at bottom */}
          <Link
            to="/the-body-shop/sale"
            onClick={closeDrawer}
            className="block text-lg py-4 text-bodyshop-blush font-bold font-sans"
          >
            SALE
          </Link>
        </nav>
      </div>
    </header>
  );
}
