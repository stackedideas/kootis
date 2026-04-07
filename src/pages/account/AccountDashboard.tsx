import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/context/AuthContext";

const MOCK_ORDERS = [
  { id: "TBS-2026-04817", date: "April 1, 2026", total: "$590.00", status: "Delivered", items: 2 },
  { id: "TBS-2026-03521", date: "March 18, 2026", total: "$295.00", status: "Processing", items: 1 },
  { id: "TBS-2026-02104", date: "February 28, 2026", total: "$1,250.00", status: "Delivered", items: 3 },
];

const MOCK_ADDRESSES = [
  { label: "Home", name: "Sarah Johnson", line1: "123 Main Street", city: "Port of Spain", country: "Trinidad & Tobago", isDefault: true },
  { label: "Work", name: "Sarah Johnson", line1: "45 Business Park Drive", city: "San Fernando", country: "Trinidad & Tobago", isDefault: false },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Delivered: { bg: "#E8F5E9", text: "#4CAF50" },
    Processing: { bg: "#FFF8E1", text: "#FF9800" },
    Cancelled: { bg: "#FFEBEE", text: "#C0392B" },
  };
  const c = colors[status] ?? { bg: "#F5F5F5", text: "#666" };
  return (
    <span
      className="font-sans font-semibold rounded-pill px-3 py-1"
      style={{ fontSize: "11px", background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

export default function AccountDashboard() {
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.first_name as string) ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="px-4 py-10 md:px-[80px]">
      {/* Heading */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>
          MY ACCOUNT
        </h1>
        <p className="font-sans text-[#888]" style={{ fontSize: "14px" }}>Welcome back, {firstName}</p>
      </div>

      {/* Two columns */}
      <div className="flex gap-8 items-start">
        <AccountSidebar />

        <div className="flex flex-col gap-10 flex-1">
          {/* Recent Orders */}
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
              RECENT ORDERS
            </span>
            <div className="overflow-hidden rounded-lg border border-[#E0D5D5] bg-white">
              {/* Header row */}
              <div
                className="grid font-sans font-semibold text-[#666] bg-[#FAFAFA]"
                style={{ fontSize: "12px", padding: "12px 16px", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px" }}
              >
                <span>Order</span>
                <span>Date</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              {MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="grid items-center border-t border-[#E0D5D5]"
                  style={{ fontSize: "13px", padding: "14px 16px", gridTemplateColumns: "2fr 1fr 1fr 1fr 100px" }}
                >
                  <span className="font-sans font-medium text-bodyshop-charcoal">#{order.id}</span>
                  <span className="font-sans text-[#666]">{order.date}</span>
                  <span className="font-sans text-[#666]">{order.items}</span>
                  <span className="font-sans font-semibold text-bodyshop-charcoal">{order.total}</span>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Link
                to="/account/orders"
                className="font-sans text-bodyshop-blush hover:text-bodyshop-blush-dark transition"
                style={{ fontSize: "13px" }}
              >
                View All Orders →
              </Link>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="flex flex-col gap-3">
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
              SAVED ADDRESSES
            </span>
            <div className="grid grid-cols-3 gap-5">
              {MOCK_ADDRESSES.map((addr) => (
                <div
                  key={addr.label}
                  className="flex flex-col gap-2 bg-white rounded-lg border border-[#E0D5D5]"
                  style={{ padding: "20px" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>{addr.label}</span>
                    {addr.isDefault && (
                      <span className="font-sans text-bodyshop-blush rounded-pill border border-bodyshop-blush px-2 py-0.5" style={{ fontSize: "10px" }}>
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 font-sans text-[#666]" style={{ fontSize: "13px" }}>
                    <span>{addr.name}</span>
                    <span>{addr.line1}</span>
                    <span>{addr.city}, {addr.country}</span>
                  </div>
                </div>
              ))}
              {/* Add new */}
              <Link
                to="/account/addresses"
                className="flex flex-col items-center justify-center gap-2 bg-white rounded-lg border border-couture-gold text-couture-gold hover:bg-[#FAF8F3] transition"
                style={{ padding: "20px", minHeight: "120px" }}
              >
                <Plus size={20} />
                <span className="font-sans" style={{ fontSize: "13px" }}>Add Address</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
