"use client";

import { Phone, Mail, MapPin } from "lucide-react";

interface TopBarProps {
  /** Phone number displayed with a phone icon. Wrapped in a tel: link. */
  phone?: string;
  /** Email address displayed with an envelope icon. Wrapped in a mailto: link. */
  email?: string;
  /** Physical address displayed with a map pin icon. */
  address?: string;
}

/**
 * TopBar — The blush information strip at the top of The Body Shop by Kootis pages.
 *
 * Desktop: phone and email on the left, address on the right (space-between layout).
 * Mobile: stacks vertically, centered.
 * Font: Outfit 11px, white, with 12px lucide icons.
 *
 * @param phone - Phone number (default: '+1 (868) 679-2025')
 * @param email - Email address (default: 'info@thebodyshopbykootis.com')
 * @param address - Physical address (default: 'Couva, Trinidad & Tobago')
 */
export default function TopBar({
  phone = "+1 (868) 679-2025",
  email = "info@thebodyshopbykootis.com",
  address = "Couva, Trinidad & Tobago",
}: TopBarProps) {
  return (
    <div className="w-full bg-bodyshop-blush h-9">
      {/* Desktop: phone + email left, address right */}
      <div className="hidden md:flex h-full mx-auto px-[60px] items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phone.replace(/[\s()]/g, "")}`}
            className="flex items-center gap-1.5 text-white hover:text-white/80 transition text-[11px] font-sans"
          >
            <Phone size={12} className="text-white shrink-0" />
            <span>{phone}</span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 text-white hover:text-white/80 transition text-[11px] font-sans"
          >
            <Mail size={12} className="text-white shrink-0" />
            <span>{email}</span>
          </a>
        </div>
        <div className="flex items-center gap-1.5 text-white text-[11px] font-sans">
          <MapPin size={12} className="text-white shrink-0" />
          <span>{address}</span>
        </div>
      </div>

      {/* Mobile: phone + address centered on one line */}
      <div className="flex md:hidden h-full items-center justify-center gap-4 px-4">
        <a
          href={`tel:${phone.replace(/[\s()]/g, "")}`}
          className="flex items-center gap-1.5 text-white text-[11px] font-sans"
        >
          <Phone size={12} className="text-white shrink-0" />
          <span>{phone}</span>
        </a>
        <div className="flex items-center gap-1.5 text-white text-[11px] font-sans">
          <MapPin size={12} className="text-white shrink-0" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
