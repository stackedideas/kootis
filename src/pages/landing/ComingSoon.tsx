import { useState, useEffect } from "react";

const PANELS = [
  {
    id: "couture",
    photo: "https://images.unsplash.com/photo-1582094080778-e1033f19dbed?auto=format&fit=crop&w=1600&q=80",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.67) 0%, rgba(0,0,0,0.27) 40%, rgba(0,0,0,0.53) 100%)",
    restFlex: 50,
  },
  {
    id: "bodyshop",
    photo: "https://images.unsplash.com/photo-1593178226351-7ffb9d73632a?auto=format&fit=crop&w=1200&q=80",
    overlay: "linear-gradient(to bottom, rgba(232,196,184,0.80) 0%, rgba(232,196,184,0.40) 30%, rgba(232,196,184,0.73) 100%)",
    restFlex: 30,
  },
  {
    id: "registry",
    photo: "https://images.unsplash.com/photo-1613128517270-f3983564ed8d?auto=format&fit=crop&w=1000&q=80",
    overlay: "linear-gradient(to bottom, rgba(245,240,232,0.67) 0%, rgba(245,240,232,0.33) 35%, rgba(245,240,232,0.73) 100%)",
    restFlex: 20,
  },
] as const;

// 20 days from the date this was deployed — update LAUNCH_DATE when ready
const LAUNCH_DATE = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-serif font-semibold text-white tabular-nums"
        style={{ fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1 }}
      >
        {pad(value)}
      </span>
      <span
        className="font-sans font-medium tracking-[0.2em] text-white/50 uppercase"
        style={{ fontSize: "10px" }}
      >
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span
      className="font-serif text-white/30 self-start"
      style={{ fontSize: "clamp(24px, 4vw, 44px)", lineHeight: 1, marginTop: "2px" }}
    >
      :
    </span>
  );
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function tick() {
      const diff = LAUNCH_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col h-screen bg-[#0A0A0A] overflow-hidden">
      {/* Background panels — desktop horizontal / mobile stacked */}
      <div className="absolute inset-0 hidden md:flex">
        {PANELS.map((panel) => (
          <div
            key={panel.id}
            className="relative h-full overflow-hidden"
            style={{ flex: panel.restFlex }}
          >
            <img
              src={panel.photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: panel.overlay }} />
            {/* Extra dark overlay to push background back */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Mobile background — just the couture photo */}
      <div className="absolute inset-0 md:hidden">
        <img
          src={PANELS[0].photo}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col h-full items-center justify-between py-10 px-4">

        {/* Top: wordmark */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="font-sans font-semibold tracking-[0.35em]"
            style={{ color: "#C9A96E", fontSize: "11px" }}
          >
            KOOTIS GROUP
          </span>
          <div className="w-8 h-px bg-[#C9A96E] opacity-50" />
        </div>

        {/* Center: main message */}
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <h1
              className="font-serif font-semibold text-white leading-[1.1]"
              style={{ fontSize: "clamp(36px, 8vw, 72px)", letterSpacing: "0.15em" }}
            >
              COMING SOON
            </h1>
            <p
              className="font-serif italic text-white/60 leading-relaxed"
              style={{ fontSize: "clamp(14px, 2.5vw, 20px)", maxWidth: "480px" }}
            >
              Something beautiful is on its way. Kootis Couture &amp; The Body Shop by Kootis — launching shortly.
            </p>
          </div>

          {/* Gold divider */}
          <div className="w-16 h-px bg-[#C9A96E] opacity-60" />

          {/* Countdown */}
          <div className="flex items-center gap-3 md:gap-5">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <Separator />
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <Separator />
            <CountdownUnit value={timeLeft.mins} label="Mins" />
            <Separator />
            <CountdownUnit value={timeLeft.secs} label="Secs" />
          </div>
        </div>

        {/* Bottom: brand names */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 md:gap-8">
            <span
              className="font-serif font-semibold tracking-[0.12em] text-white/40"
              style={{ fontSize: "clamp(11px, 1.8vw, 15px)" }}
            >
              KOOTIS COUTURE
            </span>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex flex-col items-center">
              <span
                className="font-sans font-semibold tracking-[0.18em] text-white/40"
                style={{ fontSize: "clamp(10px, 1.6vw, 13px)" }}
              >
                THE BODY SHOP
              </span>
              <span
                className="font-serif italic text-white/25"
                style={{ fontSize: "clamp(9px, 1.2vw, 11px)" }}
              >
                by Kootis
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span
              className="font-serif italic text-white/40"
              style={{ fontSize: "clamp(11px, 1.8vw, 15px)" }}
            >
              The Registry
            </span>
          </div>
          <span
            className="font-sans text-white/20 tracking-[0.1em]"
            style={{ fontSize: "10px" }}
          >
            kootisgroup.com
          </span>
        </div>

      </div>
    </div>
  );
}
