import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AuthTopBar() {
  return (
    <div className="flex items-center justify-between bg-bodyshop-blush text-white px-4 md:px-[60px]" style={{ height: "36px" }}>
      <div className="flex items-center gap-4 md:gap-6 font-sans" style={{ fontSize: "11px" }}>
        <a href="tel:+18686792025" className="hover:opacity-80 transition">+1 (868) 679-2025</a>
        <a href="mailto:info@kootisgroup.com" className="hidden md:inline hover:opacity-80 transition">info@kootisgroup.com</a>
      </div>
      <div className="flex items-center gap-1 font-sans" style={{ fontSize: "11px" }}>
        <span>📍</span>
        <span>Couva, Trinidad &amp; Tobago</span>
      </div>
    </div>
  );
}

function PasswordField({
  name,
  placeholder,
  label,
  value,
  onChange,
}: {
  name: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  const location = useLocation();
  // Redirect back to wherever the user came from, or /account
  const from = (location.state as { from?: string })?.from ?? "/account";

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    } else {
      navigate(from, { replace: true });
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${from}` },
    });
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }
    setRegLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: { first_name: firstName, last_name: lastName, newsletter },
      },
    });
    setRegLoading(false);
    if (error) {
      setRegError(error.message);
    } else {
      setRegSuccess(true);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    setForgotSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AuthTopBar />

      {/* Header */}
      <div className="flex flex-col items-center border-b border-[#E0D5D5] bg-white py-5">
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
      <div className="flex flex-col items-center pt-10">
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>
          MY ACCOUNT
        </h1>
      </div>

      {/* Two-column form */}
      <div className="flex flex-col lg:flex-row flex-1 px-4 py-10 md:px-[100px]">

        {/* ── Left: Login ── */}
        <div className="flex flex-col gap-5 flex-1 lg:pr-12">
          <div>
            <p className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "14px" }}>
              RETURNING CUSTOMER
            </p>
            <p className="font-sans text-[#888] mt-1" style={{ fontSize: "14px" }}>
              Sign in to your account.
            </p>
          </div>

          {/* Forgot password mode */}
          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              {forgotSent ? (
                <p className="font-sans text-[#4CAF50]" style={{ fontSize: "13px" }}>
                  Check your email for a reset link.
                </p>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded"
                    style={{ fontSize: "13px" }}
                  >
                    SEND RESET LINK
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition text-left"
                style={{ fontSize: "13px" }}
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                />
              </div>

              <PasswordField
                name="password"
                placeholder="••••••••"
                label="Password"
                value={loginPassword}
                onChange={setLoginPassword}
              />

              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="font-sans text-bodyshop-blush text-right hover:text-bodyshop-blush-dark transition"
                style={{ fontSize: "13px" }}
              >
                Forgot your password?
              </button>

              {loginError && (
                <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded disabled:opacity-60"
                style={{ fontSize: "13px" }}
              >
                {loginLoading ? "SIGNING IN..." : "SIGN IN"}
              </button>

              <div className="h-px bg-[#E0D5D5]" />
              <p className="font-sans text-[#888] text-center" style={{ fontSize: "13px" }}>Or sign in with:</p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-11 border border-[#E0D5D5] rounded font-sans font-semibold text-[#444] hover:border-bodyshop-blush hover:text-bodyshop-blush transition flex items-center justify-center gap-3"
                style={{ fontSize: "13px" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>
          )}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-couture-gold opacity-30 mx-4 self-stretch" />
        <div className="lg:hidden h-px bg-[#E0D5D5] my-8" />

        {/* ── Right: Register ── */}
        <div className="flex flex-col gap-5 flex-1 lg:pl-12">
          <div>
            <p className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "14px" }}>
              NEW CUSTOMER
            </p>
            <p className="font-sans text-[#888] mt-1" style={{ fontSize: "14px" }}>
              Create an account for faster checkout, order tracking, and exclusive offers.
            </p>
          </div>

          {regSuccess ? (
            <div className="flex flex-col gap-4">
              <div className="bg-[#F0FBF0] border border-[#4CAF50] rounded p-5 flex flex-col gap-2">
                <p className="font-sans font-semibold text-[#2E7D32]" style={{ fontSize: "14px" }}>
                  Account created!
                </p>
                <p className="font-sans text-[#555]" style={{ fontSize: "13px" }}>
                  We sent a confirmation email to <strong>{regEmail}</strong>. Please verify your email to activate your account.
                </p>
              </div>
              <button
                onClick={() => { setRegSuccess(false); setRegEmail(""); setRegPassword(""); setRegConfirm(""); }}
                className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
                style={{ fontSize: "13px" }}
              >
                ← Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    required
                    className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
                />
              </div>

              <PasswordField name="reg-password" placeholder="Min. 8 characters" label="Password" value={regPassword} onChange={setRegPassword} />
              <PasswordField name="reg-confirm" placeholder="Repeat password" label="Confirm Password" value={regConfirm} onChange={setRegConfirm} />

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

              {regError && (
                <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{regError}</p>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full h-12 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded disabled:opacity-60"
                style={{ fontSize: "13px" }}
              >
                {regLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#333333] px-4 py-6 md:px-[80px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {["Privacy Policy", "Terms of Service", "Refund Policy", "Contact Us"].map((l) => (
              <a key={l} href="#" className="font-sans text-white/50 hover:text-white/80 transition" style={{ fontSize: "12px" }}>
                {l}
              </a>
            ))}
          </div>
          <span className="font-sans text-white/40" style={{ fontSize: "11px" }}>
            © 2026 The Body Shop by Kootis.
          </span>
        </div>
      </div>
    </div>
  );
}
