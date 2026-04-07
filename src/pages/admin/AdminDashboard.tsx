import { useState, useEffect } from "react";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    guest_email: string | null;
  }[];
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Package; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-4 bg-[#1A1A1A] rounded-xl p-6 border border-white/10">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex flex-col">
        <span className="font-sans text-white/40" style={{ fontSize: "12px" }}>{label}</span>
        <span className="font-sans font-bold text-white" style={{ fontSize: "24px" }}>{value}</span>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  processing: "#FF9800",
  shipped: "#2196F3",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, recentOrders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-white" style={{ fontSize: "28px" }}>Dashboard</h1>
        <p className="font-sans text-white/40 mt-1" style={{ fontSize: "13px" }}>Welcome back to Kootis Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={loading ? "—" : String(stats.totalProducts)} color="#C9A96E" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={loading ? "—" : String(stats.totalOrders)} color="#E8A0A0" />
        <StatCard icon={DollarSign} label="Total Revenue" value={loading ? "—" : `$${stats.totalRevenue.toLocaleString()}`} color="#4CAF50" />
        <StatCard icon={TrendingUp} label="This Month" value="—" color="#2196F3" />
      </div>

      {/* Recent Orders */}
      <div className="flex flex-col gap-4 bg-[#1A1A1A] rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <span className="font-sans font-bold text-white tracking-[0.1em]" style={{ fontSize: "13px" }}>RECENT ORDERS</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-sans text-white/30" style={{ fontSize: "14px" }}>No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Order", "Email", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 font-sans text-white/30 font-medium" style={{ fontSize: "11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-sans font-medium text-white" style={{ fontSize: "13px" }}>#{order.order_number}</td>
                    <td className="px-6 py-4 font-sans text-white/50" style={{ fontSize: "13px" }}>{order.guest_email ?? "—"}</td>
                    <td className="px-6 py-4 font-sans font-medium text-white" style={{ fontSize: "13px" }}>${Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className="font-sans font-semibold px-2 py-1 rounded"
                        style={{
                          fontSize: "11px",
                          background: `${STATUS_COLORS[order.status] ?? "#999"}20`,
                          color: STATUS_COLORS[order.status] ?? "#999",
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-sans text-white/40" style={{ fontSize: "12px" }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
