import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { label: "Dashboard", href: "/kg-admin", icon: LayoutDashboard },
  { label: "Products", href: "/kg-admin/products", icon: Package },
  { label: "Orders", href: "/kg-admin/orders", icon: ShoppingBag },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate("/kg-admin/login", { replace: true }); return; }
      // Check admin role via user metadata
      const role = data.session.user.user_metadata?.role;
      if (role !== "admin") { navigate("/kg-admin/login", { replace: true }); return; }
      setChecking(false);
    });
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/kg-admin/login", { replace: true });
  }

  if (checking) return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-[#C9A96E] tracking-[0.2em]" style={{ fontSize: "12px" }}>
              KOOTIS GROUP
            </span>
            <span className="font-sans text-white/40" style={{ fontSize: "10px" }}>Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = href === "/kg-admin" ? pathname === "/kg-admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg font-sans transition"
                style={{
                  fontSize: "13px",
                  background: active ? "rgba(201,169,110,0.15)" : "transparent",
                  color: active ? "#C9A96E" : "rgba(255,255,255,0.6)",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg font-sans text-white/40 hover:text-white/80 hover:bg-white/5 transition w-full"
            style={{ fontSize: "13px" }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-[#1A1A1A] border-b border-white/10 flex items-center px-4 lg:px-8 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="font-sans text-white/40 ml-auto" style={{ fontSize: "12px" }}>
            Kootis Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
