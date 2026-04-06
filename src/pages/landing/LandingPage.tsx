import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

// ── Panel data ────────────────────────────────────────────────────────────────

const PANELS = [
  {
    id: "couture",
    // Weights at rest: 50 / 30 / 20. Expanded: 60 / 22 / 18.
    restFlex: 50,
    expandedFlex: 60,
    photo:
      "https://images.unsplash.com/photo-1582094080778-e1033f19dbed?auto=format&fit=crop&w=1600&q=80",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.67) 0%, rgba(0,0,0,0.27) 40%, rgba(0,0,0,0.53) 100%)",
    brand: "KOOTIS COUTURE",
    brandFont: "font-serif",
    brandColor: "#C9A96E",
    tagline: "Hand-picked gowns that fall on the silhouette of your body.",
    ctaLabel: "Enter Couture",
    ctaStyle: "border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-black",
    arrowColor: "#C9A96E",
    href: "/kootis-couture",
    external: false,
  },
  {
    id: "bodyshop",
    restFlex: 30,
    expandedFlex: 55,
    photo:
      "https://images.unsplash.com/photo-1593178226351-7ffb9d73632a?auto=format&fit=crop&w=1200&q=80",
    overlayColor: "rgba(232,196,184,0.8)",
    overlay: "linear-gradient(to bottom, rgba(232,196,184,0.80) 0%, rgba(232,196,184,0.40) 30%, rgba(232,196,184,0.73) 100%)",
    brand: null, // rendered as logo lockup
    brandFont: "font-sans",
    brandColor: "#1A1A1A",
    tagline: "Luxury accessories for the modern woman.",
    ctaLabel: "Shop Accessories",
    ctaStyle: "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white",
    arrowColor: "#1A1A1A",
    href: "/the-body-shop",
    external: false,
  },
  {
    id: "registry",
    restFlex: 20,
    expandedFlex: 45,
    photo:
      "https://images.unsplash.com/photo-1613128517270-f3983564ed8d?auto=format&fit=crop&w=1000&q=80",
    overlay: "linear-gradient(to bottom, rgba(245,240,232,0.67) 0%, rgba(245,240,232,0.33) 35%, rgba(245,240,232,0.73) 100%)",
    brand: "The Registry",
    brandFont: "font-serif",
    brandColor: "#8B7240",
    tagline: "Curate your perfect wedding wishlist.",
    ctaLabel: "Visit Registry",
    ctaStyle: "border border-[#8B7240] text-[#8B7240] hover:bg-[#8B7240] hover:text-white",
    arrowColor: "#8B7240",
    href: "https://registrytt.com/",
    external: true,
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Compute flex value for each panel
  function getFlex(panelId: string) {
    if (!hovered) return PANELS.find((p) => p.id === panelId)!.restFlex;
    const panel = PANELS.find((p) => p.id === panelId)!;
    if (panelId === hovered) return panel.expandedFlex;
    // Distribute remaining flex among non-hovered panels
    const hoveredPanel = PANELS.find((p) => p.id === hovered)!;
    const taken = hoveredPanel.expandedFlex;
    const remaining = 100 - taken;
    const others = PANELS.filter((p) => p.id !== hovered);
    const totalOtherRest = others.reduce((s, p) => s + p.restFlex, 0);
    return Math.round((panel.restFlex / totalOtherRest) * remaining);
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] overflow-hidden">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-center h-14 shrink-0 z-10">
        <span
          className="font-sans font-semibold tracking-[0.35em] text-[11px]"
          style={{ color: "#C9A96E" }}
        >
          KOOTIS GROUP
        </span>
      </div>

      {/* ── Desktop: horizontal accordion ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {PANELS.map((panel) => {
          const flex = getFlex(panel.id);
          const isHovered = hovered === panel.id;

          const content = (
            <div
              className="relative h-full overflow-hidden cursor-pointer select-none"
              style={{
                flex: flex,
                transition: "flex 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={() => setHovered(panel.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Background photo */}
              <img
                src={panel.photo}
                alt={panel.id}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transform: isHovered ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ background: panel.overlay }}
              />

              {/* Content — bottom anchored */}
              <div className="absolute inset-0 flex flex-col justify-end pb-20 px-10 gap-7 overflow-hidden">
                {/* Brand name / logo */}
                {panel.id === "bodyshop" ? (
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-sans font-semibold tracking-[0.25em] leading-tight whitespace-nowrap"
                      style={{ color: "#111111", fontSize: "22px" }}
                    >
                      THE BODY SHOP
                    </span>
                    <span
                      className="font-serif italic font-normal"
                      style={{ color: "#1A1A1A", fontSize: "16px" }}
                    >
                      by Kootis
                    </span>
                  </div>
                ) : panel.id === "registry" ? (
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-serif italic font-medium"
                      style={{ color: "#8B7240", fontSize: "32px" }}
                    >
                      The Registry
                    </span>
                    <span
                      className="font-serif italic font-normal"
                      style={{ color: "#8B7240", fontSize: "14px" }}
                    >
                      by Kootis
                    </span>
                  </div>
                ) : (
                  <span
                    className="font-serif font-semibold tracking-[0.12em] whitespace-nowrap"
                    style={{ color: "#C9A96E", fontSize: "48px" }}
                  >
                    KOOTIS COUTURE
                  </span>
                )}

                {/* Divider for registry */}
                {panel.id === "registry" && (
                  <div className="w-8 h-px bg-[#8B7240]" />
                )}

                {/* Tagline */}
                <p
                  className="font-serif italic font-normal leading-relaxed"
                  style={{
                    color:
                      panel.id === "couture"
                        ? "rgba(255,255,255,0.80)"
                        : panel.id === "bodyshop"
                        ? "rgba(26,26,26,0.73)"
                        : "rgba(74,74,74,0.73)",
                    fontSize: panel.id === "couture" ? "20px" : panel.id === "bodyshop" ? "17px" : "14px",
                    maxWidth: "380px",
                    opacity: isHovered ? 1 : 0.85,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  {panel.tagline}
                </p>

                {/* CTA button */}
                <div
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(6px)",
                    opacity: isHovered ? 1 : 0.75,
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                  }}
                >
                  <span
                    className={`inline-flex items-center gap-3 text-[12px] font-sans font-medium tracking-[0.12em] uppercase transition-colors duration-200 ${panel.ctaStyle}`}
                    style={{ padding: "14px 36px" }}
                  >
                    {panel.ctaLabel}
                    {panel.external ? (
                      <ArrowUpRight size={14} style={{ color: panel.arrowColor }} />
                    ) : (
                      <ArrowRight size={14} style={{ color: panel.arrowColor }} />
                    )}
                  </span>
                </div>

                {/* Route hint */}
                <span
                  className="font-sans font-normal tracking-[0.08em] text-[10px]"
                  style={{
                    color:
                      panel.id === "couture"
                        ? "rgba(255,255,255,0.20)"
                        : "rgba(26,26,26,0.20)",
                  }}
                >
                  {panel.external ? "registrytt.com" : panel.href}
                </span>
              </div>
            </div>
          );

          // Registry opens external tab, others use React Router Link
          if (panel.external) {
            return (
              <a
                key={panel.id}
                href={panel.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: flex, display: "flex", transition: "flex 0.55s cubic-bezier(0.4, 0, 0.2, 1)" }}
              >
                {content}
              </a>
            );
          }
          return (
            <Link
              key={panel.id}
              to={panel.href}
              style={{ flex: flex, display: "flex", transition: "flex 0.55s cubic-bezier(0.4, 0, 0.2, 1)" }}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* ── Mobile: stacked cards ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        {PANELS.map((panel) => {
          const cardContent = (
            <div
              key={panel.id}
              className="relative flex-1 overflow-hidden"
            >
              {/* Background photo */}
              <img
                src={panel.photo}
                alt={panel.id}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ background: panel.overlay }}
              />

              {/* Content — centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                {/* Brand */}
                {panel.id === "bodyshop" ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className="font-sans font-semibold tracking-[0.2em]"
                      style={{ color: "#111111", fontSize: "18px" }}
                    >
                      THE BODY SHOP
                    </span>
                    <span
                      className="font-serif italic"
                      style={{ color: "#1A1A1A", fontSize: "14px" }}
                    >
                      by Kootis
                    </span>
                  </div>
                ) : panel.id === "registry" ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className="font-serif italic font-medium"
                      style={{ color: "#8B7240", fontSize: "26px" }}
                    >
                      The Registry
                    </span>
                    <span
                      className="font-serif italic"
                      style={{ color: "#8B7240", fontSize: "12px" }}
                    >
                      by Kootis
                    </span>
                  </div>
                ) : (
                  <span
                    className="font-serif font-semibold tracking-[0.1em]"
                    style={{ color: "#C9A96E", fontSize: "28px" }}
                  >
                    KOOTIS COUTURE
                  </span>
                )}

                {/* Tagline */}
                <p
                  className="font-serif italic leading-relaxed text-sm"
                  style={{
                    color:
                      panel.id === "couture"
                        ? "rgba(255,255,255,0.80)"
                        : panel.id === "bodyshop"
                        ? "rgba(26,26,26,0.73)"
                        : "rgba(74,74,74,0.73)",
                    maxWidth: "260px",
                  }}
                >
                  {panel.tagline}
                </p>

                {/* CTA */}
                <span
                  className={`inline-flex items-center gap-2 text-[11px] font-sans font-medium tracking-[0.1em] uppercase ${panel.ctaStyle}`}
                  style={{ padding: "12px 28px" }}
                >
                  {panel.ctaLabel}
                  {panel.external ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowRight size={12} />
                  )}
                </span>
              </div>
            </div>
          );

          if (panel.external) {
            return (
              <a
                key={panel.id}
                href={panel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col"
              >
                {cardContent}
              </a>
            );
          }
          return (
            <Link
              key={panel.id}
              to={panel.href}
              className="flex-1 flex flex-col"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
