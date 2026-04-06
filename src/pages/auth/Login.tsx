import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// TopBar (blush) — minimal since it's a shared auth page
function AuthTopBar() {
  return (
    <div
      className="flex items-center justify-between bg-bodyshop-blush text-white"
      style={{ height: "36px", padding: "0 60px" }}
    >
      <div className="flex items-center gap-6 font-sans" style={{ fontSize: "11px" }}>
        <a href="tel:+18686792025" className="hover:opacity-80 transition">+1 (868) 679-2025</a>
        <a href="mailto:info@kootiscouture.com" className="hover:opacity-80 transition">info@kootiscouture.com</a>
      </div>
      <div className="flex items-center gap-1 font-sans" style={{ fontSize: "11px" }}>
        <span>📍</span>
        <span>Couva, Trinidad &amp; Tobago</span>
      </div>
    </div>
  );
}

function PasswordField({ name, placeholder, label }: { name: string; placeholder: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          required
          className="w-full h-12 px-4 pr-12 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CCC] hover:text-bodyshop-blush transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [newsletter, setNewsletter] = useState(true);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to Supabase auth
    navigate("/account");
  }

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to Supabase auth
    navigate("/account");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthTopBar />

      {/* Header */}
      <div
        className="flex flex-col items-center border-b border-[#E0D5D5] bg-white"
        style={{ padding: "20px 0" }}
      >
        <Link to="/the-body-shop" className="flex flex-col items-center gap-0.5">
          <span className="font-serif text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "24px" }}>
            THE BODY SHOP
          </span>
          <span className="font-sans text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "11px" }}>
            by Kootis
          </span>
        </Link>
      </div>

      {/* Page heading */}
      <div className="flex flex-col items-center" style={{ padding: "40px 0 0" }}>
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>
          MY ACCOUNT
        </h1>
      </div>

      {/* Two-column form */}
      <div
        className="flex flex-col lg:flex-row gap-0 flex-1"
        style={{ padding: "40px 100px 60px" }}
      >
        {/* ── Left: Login ── */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 flex-1"
          style={{ paddingRight: "48px" }}
        >
          <div>
            <p className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "14px" }}>
              RETURNING CUSTOMER
            </p>
            <p className="font-sans text-[#888] mt-1" style={{ fontSize: "14px" }}>
              Sign in to your account.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
            />
          </div>

          <PasswordField name="password" placeholder="••••••••" label="Password" />

          <p className="font-sans text-bodyshop-blush text-right cursor-pointer hover:text-bodyshop-blush-dark transition" style={{ fontSize: "13px" }}>
            Forgot your password?
          </p>

          {loginError && (
            <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "13px" }}
          >
            SIGN IN
          </button>

          <div className="h-px bg-[#E0D5D5]" />
          <p className="font-sans text-[#888] text-center" style={{ fontSize: "13px" }}>Or sign in with:</p>

          {/* Social buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 h-11 border border-[#E0D5D5] rounded font-sans font-semibold text-[#444] hover:border-bodyshop-blush hover:text-bodyshop-blush transition"
              style={{ fontSize: "13px" }}
            >
              Google
            </button>
            <button
              type="button"
              className="flex-1 h-11 border border-[#E0D5D5] rounded font-sans font-semibold text-[#444] hover:border-bodyshop-blush hover:text-bodyshop-blush transition"
              style={{ fontSize: "13px" }}
            >
              Facebook
            </button>
          </div>
        </form>

        {/* Gold divider */}
        <div className="hidden lg:block w-px bg-couture-gold mx-4 self-stretch" />
        <div className="lg:hidden h-px bg-[#E0D5D5] my-8" />

        {/* ── Right: Register ── */}
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-5 flex-1"
          style={{ paddingLeft: "48px" }}
        >
          <div>
            <p className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "14px" }}>
              NEW CUSTOMER
            </p>
            <p className="font-sans text-[#888] mt-1" style={{ fontSize: "14px" }}>
              Create an account for faster checkout, order tracking, and exclusive offers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>First Name</label>
              <input
                type="text"
                placeholder="Sarah"
                required
                className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Last Name</label>
              <input
                type="text"
                placeholder="Thompson"
                required
                className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
            />
          </div>

          <PasswordField name="reg-password" placeholder="Min. 8 characters" label="Password" />
          <PasswordField name="reg-confirm" placeholder="Repeat password" label="Confirm Password" />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-0.5 accent-bodyshop-blush"
            />
            <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>
              Subscribe to our newsletter for style guides, new arrivals, and exclusive offers.
            </span>
          </label>

          <button
            type="submit"
            className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "13px" }}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-[#333333]" style={{ padding: "24px 80px" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Refund Policy", "Contact Us"].map((l) => (
              <a key={l} href="#" className="font-sans text-white/50 hover:text-white/80 transition" style={{ fontSize: "12px" }}>
                {l}
              </a>
            ))}
          </div>
          <span className="font-sans text-[#777]" style={{ fontSize: "11px" }}>
            © 2026 The Body Shop by Kootis. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
