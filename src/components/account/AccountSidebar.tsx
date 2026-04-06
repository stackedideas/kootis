import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Heart, MapPin, User, LogOut } from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/the-body-shop/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Account Details", href: "/account", icon: User },
  { label: "Logout", href: "/login", icon: LogOut },
];

interface AccountSidebarProps {
  name?: string;
  email?: string;
}

export default function AccountSidebar({
  name = "Sarah Johnson",
  email = "sarah@example.com",
}: AccountSidebarProps) {
  const { pathname } = useLocation();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <div
      className="flex flex-col gap-5 bg-white rounded-lg shrink-0"
      style={{ width: "300px", padding: "24px", border: "1px solid #C9A96E" }}
    >
      {/* Profile */}
      <div className="flex items-center gap-3">
        <div
          className="w-[60px] h-[60px] rounded-full bg-bodyshop-blush flex items-center justify-center shrink-0"
        >
          <span className="font-sans font-bold text-white" style={{ fontSize: "20px" }}>
            {name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-bold text-bodyshop-charcoal" style={{ fontSize: "16px" }}>
            {name}
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
          const active = isActive(href) && label !== "Account Details" && label !== "Logout";
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
      </nav>
    </div>
  );
}
