import { useState } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import { ChevronDown, ChevronRight } from "lucide-react";

const ORDERS = [
  {
    id: "TBS-2026-04817", date: "April 1, 2026", total: "$590.00", status: "Delivered",
    items: [
      { name: "Athena Strappy Heel", sku: "Size 38 · Nude Gold", price: "$295.00", image: "https://images.unsplash.com/photo-1709282028322-35c1fb068ef8?w=80&h=80&fit=crop" },
      { name: "Riviera Satchel", sku: "Tan", price: "$295.00", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: "TBS-2026-03521", date: "March 18, 2026", total: "$295.00", status: "Processing",
    items: [
      { name: "Rosé Platform Heel", sku: "Size 37 · Blush", price: "$295.00", image: "https://images.unsplash.com/photo-1629242783674-ef9f65a2324c?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: "TBS-2026-02104", date: "February 28, 2026", total: "$1,250.00", status: "Delivered",
    items: [
      { name: "Corsica Watch", sku: "One Size · Gold", price: "$1,250.00", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" },
    ],
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Delivered: { bg: "#E8F5E9", text: "#4CAF50" },
  Processing: { bg: "#FFF8E1", text: "#FF9800" },
  Cancelled: { bg: "#FFEBEE", text: "#C0392B" },
};

export default function AccountOrders() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ padding: "40px 80px 40px" }}>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>MY ACCOUNT</h1>
        <p className="font-sans text-[#888]" style={{ fontSize: "14px" }}>Welcome back, Sarah</p>
      </div>

      <div className="flex gap-8 items-start">
        <AccountSidebar />

        <div className="flex flex-col gap-4 flex-1">
          <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
            MY ORDERS
          </span>

          {ORDERS.map((order) => {
            const c = STATUS_COLORS[order.status] ?? { bg: "#F5F5F5", text: "#666" };
            const open = expanded === order.id;
            return (
              <div key={order.id} className="bg-white border border-[#E0D5D5] rounded-lg overflow-hidden">
                {/* Order header */}
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-[#FAFAFA] transition"
                  onClick={() => setExpanded(open ? null : order.id)}
                >
                  <div className="flex items-center gap-8 text-left">
                    <div className="flex flex-col">
                      <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                        #{order.id}
                      </span>
                      <span className="font-sans text-[#999]" style={{ fontSize: "12px" }}>{order.date}</span>
                    </div>
                    <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "14px" }}>
                      {order.total}
                    </span>
                    <span
                      className="font-sans font-semibold rounded-pill px-3 py-1"
                      style={{ fontSize: "11px", background: c.bg, color: c.text }}
                    >
                      {order.status}
                    </span>
                  </div>
                  {open ? <ChevronDown size={16} className="text-[#999]" /> : <ChevronRight size={16} className="text-[#999]" />}
                </button>

                {/* Expanded items */}
                {open && (
                  <div className="border-t border-[#E0D5D5]">
                    {order.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-4 p-4 border-b border-[#F5F5F5] last:border-0">
                        <div className="w-16 h-16 overflow-hidden rounded shrink-0 bg-[#F8F8F8]">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <span className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "13px" }}>{item.name}</span>
                          <span className="font-sans text-[#999]" style={{ fontSize: "12px" }}>{item.sku}</span>
                        </div>
                        <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
