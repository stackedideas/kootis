import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Heart, MapPin, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/the-body-shop/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Account Details", href: "/account/details", icon: User },
];

export default function AccountSidebar() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const firstName = (user?.user_metadata?.first_name as string) ?? "";
  const lastName = (user?.user_metadata?.last_name as string) ?? "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || user?.email?.split("@")[0] || "My Account";
  const email = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div
      className="flex flex-col gap-5 bg-white rounded-lg shrink-0"
      style={{ width: "300px", padding: "24px", border: "1px solid #C9A96E" }}
    >
      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className="w-[60px] h-[60px] rounded-full bg-bodyshop-blush flex items-center justify-center shrink-0">
          <span className="font-sans font-bold text-white" style={{ fontSize: "20px" }}>
            {initial}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "16px" }}>
            {displayName}
          </span>
          <span className="font-sans text-[#888]" style={{ fontSize: "13px" }}>
            {email}
          </span>
        </div>
      </div>

      <div className="h-px bg-[#E0D5D5]" />

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-3 rounded transition"
              style={{
                padding: "12px 16px",
                background: active ? "#FDF6F6" : "transparent",
                color: active ? "#333333" : "#555555",
                borderLeft: active ? "3px solid #E8A0A0" : "3px solid transparent",
              }}
            >
              <Icon size={18} style={{ color: active ? "#E8A0A0" : "#999999" }} />
              <span className="font-sans" style={{ fontSize: "14px", fontWeight: active ? 500 : 400 }}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded transition w-full text-left hover:bg-red-50"
          style={{
            padding: "12px 16px",
            color: "#555555",
            borderLeft: "3px solid transparent",
          }}
        >
          <LogOut size={18} style={{ color: "#999999" }} />
          <span className="font-sans" style={{ fontSize: "14px" }}>Logout</span>
        </button>
      </nav>
    </div>
  );
}
