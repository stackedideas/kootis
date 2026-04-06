import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const TABS = ["ALL", "RUNWAY@0519", "OTHER"] as const;
type Tab = typeof TABS[number];

// All 12 photos from the artboard masonry grid
const ALL_PHOTOS = [
  "https://images.unsplash.com/photo-1649079829858-ebdd7191930a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1765229277936-b793f97b2963?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584402563973-3d5ded2689fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1638446397249-04d5af941698?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1666979303152-d1678dc0eefa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1536567307162-551e460b7fc2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558114383-24c50765cd44?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1770757685369-70a7d5b32e76?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1736597791026-19b35f1588bd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1744322372396-10bdb9538f45?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1630376974304-ef225164ee34?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1652185775737-db32138f6966?auto=format&fit=crop&w=800&q=80",
];

// Tag each photo to a category for filtering
const PHOTO_CATEGORIES: Tab[] = [
  "RUNWAY@0519", "RUNWAY@0519", "OTHER",
  "RUNWAY@0519", "RUNWAY@0519", "OTHER",
  "RUNWAY@0519", "OTHER", "RUNWAY@0519",
  "OTHER", "RUNWAY@0519", "OTHER",
];

// Heights for the 4-column masonry layout (cycles per column)
const COL_HEIGHTS = [
  [480, 320, 420],
  [360, 500, 360],
  [440, 340, 440],
  [380, 460, 380],
];

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/93 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 text-white hover:opacity-70 transition z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/27 flex items-center justify-center text-white hover:bg-white/10 transition z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Photo */}
      <img
        src={photos[index]}
        alt={`Media ${index + 1}`}
        className="max-h-[85vh] max-w-[600px] w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/27 flex items-center justify-center text-white hover:bg-white/10 transition z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>

      {/* Counter */}
      <span
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-white/53 tracking-[0.15em]"
        style={{ fontSize: "13px" }}
      >
        {index + 1} / {photos.length}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CoutureMedia() {
  const [activeTab, setActiveTab] = useState<Tab>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredPhotos = activeTab === "ALL"
    ? ALL_PHOTOS
    : ALL_PHOTOS.filter((_, i) => PHOTO_CATEGORIES[i] === activeTab);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  // Distribute photos into 4 columns
  const columns: string[][] = [[], [], [], []];
  visiblePhotos.forEach((p, i) => columns[i % 4].push(p));

  function openLightbox(photo: string) {
    const idx = filteredPhotos.indexOf(photo);
    if (idx !== -1) setLightboxIndex(idx);
  }

  function closeLightbox() { setLightboxIndex(null); }
  function prev() { setLightboxIndex((i) => i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length); }
  function next() { setLightboxIndex((i) => i === null ? null : (i + 1) % filteredPhotos.length); }

  return (
    <div className="flex flex-col">
      {/* ── Filter tabs ── */}
      <section className="flex items-center justify-center gap-12 pt-8 pb-0 px-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setVisibleCount(12); }}
            className={`flex flex-col items-center gap-2 font-sans font-semibold tracking-[0.23em] transition
              ${activeTab === tab ? "text-couture-charcoal" : "text-shared-grey-text hover:text-couture-charcoal"}`}
            style={{ fontSize: "12px" }}
          >
            {tab}
            {activeTab === tab && (
              <div className="w-6 h-0.5 bg-couture-gold" />
            )}
          </button>
        ))}
      </section>

      {/* ── Masonry grid (4 columns desktop, 2 mobile) ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-8">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col">
            {col.map((src, ri) => {
              const h = COL_HEIGHTS[ci][ri % COL_HEIGHTS[ci].length];
              return (
                <div
                  key={src}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ height: `${h}px` }}
                  onClick={() => openLightbox(src)}
                >
                  <img
                    src={src}
                    alt="Kootis Couture media"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white font-serif text-5xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      +
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      {/* ── Load more ── */}
      {visibleCount < filteredPhotos.length && (
        <div className="flex justify-center py-12">
          <button
            onClick={() => setVisibleCount((n) => n + 8)}
            className="inline-flex items-center justify-center font-sans font-semibold text-couture-gold tracking-[0.23em] border border-couture-gold hover:bg-couture-gold hover:text-white transition"
            style={{ fontSize: "11px", padding: "14px 44px" }}
          >
            LOAD MORE
          </button>
        </div>
      )}

      {/* ── Newsletter ── */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 bg-couture-cream px-[80px] py-8">
        <span className="font-serif italic text-couture-charcoal" style={{ fontSize: "22px" }}>
          Join the Kootis Couture World
        </span>
        <form className="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-11 px-4 font-sans text-[13px] border border-shared-grey-mid focus:outline-none focus:border-couture-gold bg-white"
            style={{ width: "280px" }}
          />
          <button
            type="submit"
            className="h-11 px-6 bg-couture-gold text-white font-sans font-semibold tracking-[0.15em] text-[11px] hover:bg-couture-gold-dark transition"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}
