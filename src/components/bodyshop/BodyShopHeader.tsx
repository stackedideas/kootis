"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";

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
  const { user, signOut } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountOpen]);
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

          {/* Account */}
          <div className="relative" ref={accountRef}>
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-bodyshop-blush text-white font-sans font-bold hover:bg-bodyshop-blush-dark transition cursor-pointer"
                  style={{ fontSize: "13px" }}
                  aria-label="Account"
                >
                  {(user.user_metadata?.first_name as string)?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U"}
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#E0D5D5] shadow-lg z-50 min-w-[180px] rounded">
                    <div className="px-4 py-3 border-b border-[#F0F0F0]">
                      <p className="font-sans font-semibold text-bodyshop-charcoal truncate" style={{ fontSize: "13px" }}>
                        {(user.user_metadata?.first_name as string) ?? user.email?.split("@")[0]}
                      </p>
                      <p className="font-sans text-[#999] truncate" style={{ fontSize: "11px" }}>{user.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 font-sans text-[13px] text-[#555] hover:bg-[#FDF6F6] hover:text-bodyshop-blush transition">
                      <User size={14} /> My Account
                    </Link>
                    <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-3 font-sans text-[13px] text-[#555] hover:bg-[#FDF6F6] hover:text-bodyshop-blush transition">
                      My Orders
                    </Link>
                    <button
                      onClick={async () => { setAccountOpen(false); await signOut(); navigate("/login"); }}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 font-sans text-[13px] text-[#555] hover:bg-red-50 hover:text-red-400 transition border-t border-[#F0F0F0]"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-bodyshop-charcoal hover:text-bodyshop-blush transition cursor-pointer"
                aria-label="Sign in"
              >
                <User size={20} />
              </button>
            )}
          </div>

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

          {/* SALE link */}
          <Link
            to="/the-body-shop/sale"
            onClick={closeDrawer}
            className="block text-lg py-4 border-b border-shared-grey-light text-bodyshop-blush font-bold font-sans"
          >
            SALE
          </Link>

          {/* Account section */}
          {user ? (
            <>
              <Link to="/account" onClick={closeDrawer} className="block text-lg py-4 border-b border-shared-grey-light font-sans text-bodyshop-charcoal hover:text-bodyshop-blush transition">
                My Account
              </Link>
              <Link to="/account/orders" onClick={closeDrawer} className="block text-lg py-4 border-b border-shared-grey-light font-sans text-bodyshop-charcoal hover:text-bodyshop-blush transition">
                My Orders
              </Link>
              <button
                onClick={async () => { closeDrawer(); await signOut(); navigate("/login"); }}
                className="block w-full text-left text-lg py-4 font-sans text-red-400 hover:text-red-500 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeDrawer} className="block text-lg py-4 font-sans font-semibold text-bodyshop-blush hover:text-bodyshop-blush-dark transition">
              Sign In / Register
            </Link>
          )}
        </nav>

        {/* Mobile cart + search row */}
        <div className="flex items-center gap-6 px-4 py-4 border-t border-shared-grey-light">
          <button
            type="button"
            onClick={() => { closeDrawer(); navigate("/the-body-shop/search"); }}
            className="flex items-center gap-2 font-sans text-bodyshop-charcoal"
            style={{ fontSize: "14px" }}
          >
            <Search size={18} /> Search
          </button>
          <button
            type="button"
            onClick={() => { closeDrawer(); navigate("/the-body-shop/cart"); }}
            className="flex items-center gap-2 font-sans text-bodyshop-charcoal relative"
            style={{ fontSize: "14px" }}
          >
            <ShoppingBag size={18} /> Cart
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-bodyshop-blush text-white text-[10px] font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
