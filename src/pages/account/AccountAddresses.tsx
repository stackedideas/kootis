import { useState } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1", label: "Home", name: "Sarah Johnson",
    line1: "123 Main Street", city: "Port of Spain", postcode: "", country: "Trinidad & Tobago",
    phone: "+1 (868) 555-0001", isDefault: true,
  },
  {
    id: "2", label: "Work", name: "Sarah Johnson",
    line1: "45 Business Park Drive", city: "San Fernando", postcode: "", country: "Trinidad & Tobago",
    phone: "+1 (868) 555-0002", isDefault: false,
  },
];

function AddressModal({
  address,
  onSave,
  onClose,
}: {
  address?: Address;
  onSave: (addr: Omit<Address, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Address, "id">>({
    label: address?.label ?? "",
    name: address?.name ?? "",
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    postcode: address?.postcode ?? "",
    country: address?.country ?? "Trinidad & Tobago",
    phone: address?.phone ?? "",
    isDefault: address?.isDefault ?? false,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[560px] flex flex-col gap-5 relative" style={{ padding: "32px" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#999] hover:text-bodyshop-blush transition">
          <X size={20} />
        </button>
        <h2 className="font-serif text-bodyshop-charcoal" style={{ fontSize: "22px" }}>
          {address ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="flex flex-col gap-4">
          {[
            { name: "label", label: "Address Label", placeholder: "Home, Work..." },
            { name: "name", label: "Full Name", placeholder: "Sarah Johnson" },
            { name: "line1", label: "Address Line 1", placeholder: "123 Main Street" },
            { name: "line2", label: "Address Line 2 (optional)", placeholder: "Apt, suite..." },
            { name: "city", label: "City", placeholder: "Port of Spain" },
            { name: "postcode", label: "Postcode (optional)", placeholder: "" },
            { name: "phone", label: "Phone", placeholder: "+1 (868) 555-0000" },
          ].map(({ name, label, placeholder }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>{label}</label>
              <input
                name={name}
                value={(form as unknown as Record<string, string>)[name] ?? ""}
                onChange={handleChange}
                placeholder={placeholder}
                className="h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
              />
            </div>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="accent-bodyshop-blush" />
            <span className="font-sans text-[#666]" style={{ fontSize: "13px" }}>Set as default address</span>
          </label>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSave(form)}
            className="flex-1 h-11 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded"
            style={{ fontSize: "12px" }}
          >
            SAVE ADDRESS
          </button>
          <button
            onClick={onClose}
            className="h-11 px-6 border border-[#E0D5D5] font-sans text-[#666] hover:border-bodyshop-blush hover:text-bodyshop-blush transition rounded"
            style={{ fontSize: "12px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [modal, setModal] = useState<{ open: boolean; address?: Address }>({ open: false });

  function handleSave(data: Omit<Address, "id">) {
    if (modal.address) {
      setAddresses((prev) => prev.map((a) => a.id === modal.address!.id ? { ...data, id: a.id } : a));
    } else {
      setAddresses((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    }
    setModal({ open: false });
  }

  function handleDelete(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div style={{ padding: "40px 80px 40px" }}>
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>MY ACCOUNT</h1>
        <p className="font-sans text-[#888]" style={{ fontSize: "14px" }}>Welcome back, Sarah</p>
      </div>

      <div className="flex gap-8 items-start">
        <AccountSidebar />

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]" style={{ fontSize: "13px" }}>
              SAVED ADDRESSES
            </span>
            <button
              onClick={() => setModal({ open: true })}
              className="flex items-center gap-2 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.1em] hover:bg-bodyshop-blush-dark transition rounded"
              style={{ fontSize: "12px", padding: "10px 20px" }}
            >
              <Plus size={14} />
              Add Address
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex flex-col gap-3 bg-white rounded-lg border border-[#E0D5D5]"
                style={{ padding: "20px" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-semibold text-bodyshop-charcoal" style={{ fontSize: "13px" }}>
                    {addr.label}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal({ open: true, address: addr })}
                      className="text-[#CCC] hover:text-bodyshop-blush transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="text-[#CCC] hover:text-red-400 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {addr.isDefault && (
                  <span
                    className="font-sans self-start border border-bodyshop-blush text-bodyshop-blush rounded-pill px-2 py-0.5"
                    style={{ fontSize: "10px" }}
                  >
                    Default
                  </span>
                )}
                <div className="flex flex-col gap-0.5 font-sans text-[#666]" style={{ fontSize: "13px" }}>
                  <span>{addr.name}</span>
                  <span>{addr.line1}</span>
                  {addr.line2 && <span>{addr.line2}</span>}
                  <span>{addr.city}{addr.postcode ? `, ${addr.postcode}` : ""}</span>
                  <span>{addr.country}</span>
                  <span>{addr.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal.open && (
        <AddressModal
          address={modal.address}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
