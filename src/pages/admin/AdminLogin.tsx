import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.session) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    const role = data.session.user.user_metadata?.role;
    if (role !== "admin") {
      await supabase.auth.signOut();
      setError("You do not have admin access.");
      setLoading(false);
      return;
    }

    navigate("/kg-admin", { replace: true });
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/kg-admin` },
    });
    if (oauthError) {
      setError("Google sign-in failed.");
      setGoogleLoading(false);
    }
    // On success the page redirects — no need to setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-sans font-bold text-[#C9A96E] tracking-[0.3em]" style={{ fontSize: "13px" }}>
            KOOTIS GROUP
          </span>
          <span className="font-sans text-white/30" style={{ fontSize: "12px" }}>Admin Panel</span>
        </div>

        {/* Card */}
        <div className="flex flex-col gap-5 bg-[#1A1A1A] rounded-xl p-8 border border-white/10">
          <h1 className="font-serif text-white text-center" style={{ fontSize: "24px" }}>Sign In</h1>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="h-11 flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg font-sans text-white/80 hover:bg-white/10 hover:border-white/20 transition disabled:opacity-60"
            style={{ fontSize: "13px" }}
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-sans text-white/20" style={{ fontSize: "11px" }}>or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-white/50" style={{ fontSize: "11px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kootisgroup.com"
                required
                className="h-11 px-4 bg-white/5 border border-white/10 rounded-lg font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E] transition"
                style={{ fontSize: "13px" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-white/50" style={{ fontSize: "11px" }}>Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-12 bg-white/5 border border-white/10 rounded-lg font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E] transition"
                  style={{ fontSize: "13px" }}
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-sans text-red-400 text-center" style={{ fontSize: "13px" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="h-11 bg-[#C9A96E] text-black font-sans font-bold tracking-[0.15em] rounded-lg hover:bg-[#B8972E] transition disabled:opacity-60"
              style={{ fontSize: "12px" }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
