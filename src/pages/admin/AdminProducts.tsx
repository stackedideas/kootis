import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { adminFetch } from "@/lib/adminFetch";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  sale_price: number | null;
  original_price: number | null;
  images: string[];
  badge: string | null;
  discount_pct: number | null;
  in_stock: boolean;
  featured: boolean;
}

const EMPTY_FORM = {
  name: "", slug: "", category: "", price: "", sale_price: "", original_price: "",
  badge: "", discount_pct: "", in_stock: true, featured: false,
};

const CATEGORIES = [
  "Heels", "Flats", "Boots", "Sandals", "Sneakers",
  "Totes", "Clutches", "Crossbody", "Satchels",
  "Luxury", "Sport", "Casual",
  "Scarves", "Belts", "Jewellery", "Eyewear",
];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-white/50" style={{ fontSize: "11px" }}>{label}</label>
      {children}
    </div>
  );
}

const inputClass = "h-10 px-3 bg-white/5 border border-white/10 rounded-lg font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E] transition text-[13px]";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({
      name: p.name, slug: p.slug, category: p.category,
      price: String(p.price), sale_price: p.sale_price ? String(p.sale_price) : "",
      original_price: p.original_price ? String(p.original_price) : "",
      badge: p.badge ?? "", discount_pct: p.discount_pct ? String(p.discount_pct) : "",
      in_stock: p.in_stock, featured: p.featured,
    });
    setImagePreview(p.images?.[0] ?? "");
    setImageFile(null);
    setModalOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const body = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        badge: form.badge || null,
        discount_pct: form.discount_pct ? parseInt(form.discount_pct) : null,
        in_stock: form.in_stock,
        featured: form.featured,
        image: imageUrl,
        id: editProduct?.id,
      };

      await adminFetch("/api/admin/products", {
        method: editProduct ? "PUT" : "POST",
        body: JSON.stringify(body),
      });

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await adminFetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  }

  async function toggleStock(p: Product) {
    await adminFetch("/api/admin/products", {
      method: "PUT",
      body: JSON.stringify({ id: p.id, in_stock: !p.in_stock }),
    });
    fetchProducts();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-white" style={{ fontSize: "28px" }}>Products</h1>
          <p className="font-sans text-white/40 mt-1" style={{ fontSize: "13px" }}>{products.length} products total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#C9A96E] text-black font-sans font-bold px-4 py-2.5 rounded-lg hover:bg-[#B8972E] transition"
          style={{ fontSize: "12px" }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["Image", "Name", "Category", "Price", "Badge", "Stock", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans text-white/30 font-medium" style={{ fontSize: "11px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-white/10 shrink-0">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans font-medium text-white" style={{ fontSize: "13px" }}>{p.name}</p>
                      <p className="font-sans text-white/30" style={{ fontSize: "11px" }}>{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 font-sans text-white/60" style={{ fontSize: "13px" }}>{p.category}</td>
                    <td className="px-4 py-3">
                      {p.sale_price ? (
                        <div className="flex flex-col">
                          <span className="font-sans font-medium text-[#E8A0A0]" style={{ fontSize: "13px" }}>${Number(p.sale_price).toFixed(2)}</span>
                          <span className="font-sans text-white/30 line-through" style={{ fontSize: "11px" }}>${Number(p.price).toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-sans font-medium text-white" style={{ fontSize: "13px" }}>${Number(p.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.badge && (
                        <span
                          className="font-sans font-bold px-2 py-1 rounded text-white"
                          style={{ fontSize: "10px", background: p.badge === "SALE" ? "#E8A0A0" : "#C9A96E" }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStock(p)} className="transition">
                        {p.in_stock
                          ? <ToggleRight size={24} className="text-[#4CAF50]" />
                          : <ToggleLeft size={24} className="text-white/30" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="text-white/40 hover:text-[#C9A96E] transition">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="text-white/40 hover:text-red-400 transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 w-full max-w-[640px] my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="font-serif text-white" style={{ fontSize: "20px" }}>
                {editProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5 p-6">
              {/* Image upload */}
              <Field label="Product Image">
                <div
                  className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#C9A96E] transition overflow-hidden"
                  style={{ height: "180px" }}
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/30">
                      <Upload size={28} />
                      <span className="font-sans" style={{ fontSize: "13px" }}>Click to upload image</span>
                      <span className="font-sans" style={{ fontSize: "11px" }}>PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 size={28} className="text-[#C9A96E] animate-spin" />
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </Field>

              {/* Name + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Product Name *">
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    placeholder="Milano Crossbody"
                    required
                  />
                </Field>
                <Field label="Slug *">
                  <input
                    className={inputClass}
                    value={form.slug}
                    onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="milano-crossbody"
                    required
                  />
                </Field>
              </div>

              {/* Category */}
              <Field label="Category *">
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  required
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              {/* Prices */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price (TTD) *">
                  <input className={inputClass} type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="495.00" required />
                </Field>
                <Field label="Sale Price">
                  <input className={inputClass} type="number" step="0.01" value={form.sale_price} onChange={(e) => setForm(f => ({ ...f, sale_price: e.target.value }))} placeholder="371.00" />
                </Field>
                <Field label="Original Price">
                  <input className={inputClass} type="number" step="0.01" value={form.original_price} onChange={(e) => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="495.00" />
                </Field>
              </div>

              {/* Badge + Discount */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge">
                  <select className={inputClass} value={form.badge} onChange={(e) => setForm(f => ({ ...f, badge: e.target.value }))} style={{ background: "rgba(255,255,255,0.05)" }}>
                    <option value="">None</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                  </select>
                </Field>
                <Field label="Discount %">
                  <input className={inputClass} type="number" value={form.discount_pct} onChange={(e) => setForm(f => ({ ...f, discount_pct: e.target.value }))} placeholder="25" />
                </Field>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="accent-[#C9A96E] w-4 h-4" />
                  <span className="font-sans text-white/60" style={{ fontSize: "13px" }}>In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#C9A96E] w-4 h-4" />
                  <span className="font-sans text-white/60" style={{ fontSize: "13px" }}>Featured</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-11 bg-[#C9A96E] text-black font-sans font-bold tracking-[0.1em] rounded-lg hover:bg-[#B8972E] transition disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ fontSize: "12px" }}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "SAVING..." : editProduct ? "SAVE CHANGES" : "ADD PRODUCT"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="h-11 px-6 border border-white/20 text-white/60 font-sans rounded-lg hover:border-white/40 transition" style={{ fontSize: "13px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-8 max-w-[380px] w-full flex flex-col gap-5">
            <h2 className="font-serif text-white" style={{ fontSize: "20px" }}>Delete Product?</h2>
            <p className="font-sans text-white/50" style={{ fontSize: "14px" }}>This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-11 bg-red-500 text-white font-sans font-bold rounded-lg hover:bg-red-600 transition" style={{ fontSize: "13px" }}>
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 h-11 border border-white/20 text-white/60 font-sans rounded-lg hover:border-white/40 transition" style={{ fontSize: "13px" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
