import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  guest_email: string | null;
  shipping_address: Record<string, string> | null;
  items: OrderItem[];
}

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  processing: { bg: "#FF980020", text: "#FF9800" },
  shipped:    { bg: "#2196F320", text: "#2196F3" },
  delivered:  { bg: "#4CAF5020", text: "#4CAF50" },
  cancelled:  { bg: "#F4433620", text: "#F44336" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: "#99999920", text: "#999" };
  return (
    <span
      className="font-sans font-semibold px-2 py-1 rounded capitalize"
      style={{ fontSize: "11px", background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      await adminFetch("/api/admin/orders", {
        method: "PUT",
        body: JSON.stringify({ id: orderId, status }),
      });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-white" style={{ fontSize: "28px" }}>Orders</h1>
        <p className="font-sans text-white/40 mt-1" style={{ fontSize: "13px" }}>
          {loading ? "Loading..." : `${orders.length} orders total`}
        </p>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-sans text-white/30" style={{ fontSize: "14px" }}>No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Order", "Customer", "Total", "Status", "Date", ""].map((h, i) => (
                    <th key={i} className="text-left px-5 py-3 font-sans text-white/30 font-medium" style={{ fontSize: "11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-5 py-4 font-sans font-medium text-white" style={{ fontSize: "13px" }}>
                        #{order.order_number}
                      </td>
                      <td className="px-5 py-4 font-sans text-white/50" style={{ fontSize: "13px" }}>
                        {order.guest_email ?? "—"}
                      </td>
                      <td className="px-5 py-4 font-sans font-medium text-white" style={{ fontSize: "13px" }}>
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 font-sans text-white/40" style={{ fontSize: "12px" }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <ChevronDown
                          size={16}
                          className="text-white/30 transition-transform"
                          style={{ transform: expanded === order.id ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded === order.id && (
                      <tr key={`${order.id}-expanded`} className="border-b border-white/5 bg-white/[0.02]">
                        <td colSpan={6} className="px-5 py-5">
                          <div className="flex flex-col gap-4">
                            {/* Items */}
                            <div>
                              <p className="font-sans text-white/40 mb-2" style={{ fontSize: "11px" }}>ORDER ITEMS</p>
                              <div className="flex flex-col gap-1.5">
                                {(order.items ?? []).map((item, i) => (
                                  <div key={i} className="flex items-center justify-between">
                                    <span className="font-sans text-white/70" style={{ fontSize: "13px" }}>
                                      {item.name} <span className="text-white/30">× {item.qty}</span>
                                    </span>
                                    <span className="font-sans text-white/60" style={{ fontSize: "13px" }}>
                                      ${Number(item.price).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping address */}
                            {order.shipping_address && (
                              <div>
                                <p className="font-sans text-white/40 mb-1" style={{ fontSize: "11px" }}>SHIP TO</p>
                                <p className="font-sans text-white/60" style={{ fontSize: "13px" }}>
                                  {[
                                    order.shipping_address.name,
                                    order.shipping_address.address,
                                    order.shipping_address.city,
                                    order.shipping_address.country,
                                  ].filter(Boolean).join(", ")}
                                </p>
                              </div>
                            )}

                            {/* Status update */}
                            <div className="flex items-center gap-3">
                              <p className="font-sans text-white/40" style={{ fontSize: "11px" }}>UPDATE STATUS</p>
                              <div className="flex gap-2 flex-wrap">
                                {STATUS_OPTIONS.map((s) => {
                                  const active = order.status === s;
                                  const c = STATUS_COLORS[s];
                                  return (
                                    <button
                                      key={s}
                                      disabled={active || updating === order.id}
                                      onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                                      className="px-3 py-1.5 rounded font-sans font-semibold capitalize transition disabled:opacity-50"
                                      style={{
                                        fontSize: "11px",
                                        background: active ? c.bg : "rgba(255,255,255,0.05)",
                                        color: active ? c.text : "rgba(255,255,255,0.4)",
                                        border: active ? `1px solid ${c.text}40` : "1px solid rgba(255,255,255,0.1)",
                                      }}
                                    >
                                      {s}
                                    </button>
                                  );
                                })}
                              </div>
                              {updating === order.id && (
                                <div className="w-4 h-4 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
