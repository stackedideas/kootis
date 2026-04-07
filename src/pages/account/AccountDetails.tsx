import { useState } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-medium text-bodyshop-charcoal" style={{ fontSize: "11px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 px-4 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
    />
  );
}

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 pr-12 font-sans text-[13px] border border-[#E0D5D5] rounded focus:outline-none focus:border-bodyshop-blush bg-white placeholder:text-[#BBB] transition"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CCC] hover:text-bodyshop-blush transition"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export default function AccountDetails() {
  const { user } = useAuth();

  // Profile state
  const [firstName, setFirstName] = useState((user?.user_metadata?.first_name as string) ?? "");
  const [lastName, setLastName] = useState((user?.user_metadata?.last_name as string) ?? "");
  const [phone, setPhone] = useState((user?.user_metadata?.phone as string) ?? "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Email state
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);
    setProfileLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName, phone },
    });
    setProfileLoading(false);
    if (error) setProfileError(error.message);
    else setProfileSaved(true);
  }

  async function handleEmailSave(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailSaved(false);
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailLoading(false);
    if (error) setEmailError(error.message);
    else setEmailSaved(true);
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    // Re-authenticate then update
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: currentPassword,
    });
    if (signInError) {
      setPasswordLoading(false);
      setPasswordError("Current password is incorrect.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) setPasswordError(error.message);
    else {
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const sectionClass = "flex flex-col gap-5 bg-white rounded-lg border border-[#E0D5D5] p-6";
  const headingClass = "font-sans font-bold text-bodyshop-charcoal tracking-[0.2em]";

  return (
    <div className="px-4 py-10 md:px-[80px]">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-serif text-bodyshop-charcoal tracking-[0.1em]" style={{ fontSize: "32px" }}>MY ACCOUNT</h1>
        <p className="font-sans text-[#888]" style={{ fontSize: "14px" }}>Manage your personal details and security.</p>
      </div>

      <div className="flex gap-8 items-start">
        <AccountSidebar />

        <div className="flex flex-col gap-6 flex-1">

          {/* ── Profile ── */}
          <form onSubmit={handleProfileSave} className={sectionClass}>
            <span className={headingClass} style={{ fontSize: "13px" }}>PERSONAL INFORMATION</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name">
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Sarah" />
              </Field>
              <Field label="Last Name">
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Thompson" />
              </Field>
              <Field label="Phone (optional)">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (868) 555-0000" />
              </Field>
            </div>
            {profileError && <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{profileError}</p>}
            {profileSaved && (
              <div className="flex items-center gap-2 text-[#4CAF50]">
                <CheckCircle size={16} />
                <span className="font-sans" style={{ fontSize: "13px" }}>Changes saved.</span>
              </div>
            )}
            <div className="flex">
              <button
                type="submit"
                disabled={profileLoading}
                className="h-11 px-8 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded disabled:opacity-60"
                style={{ fontSize: "12px" }}
              >
                {profileLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </form>

          {/* ── Email ── */}
          <form onSubmit={handleEmailSave} className={sectionClass}>
            <span className={headingClass} style={{ fontSize: "13px" }}>EMAIL ADDRESS</span>
            <Field label="Email">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            {emailError && <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{emailError}</p>}
            {emailSaved && (
              <div className="flex items-center gap-2 text-[#4CAF50]">
                <CheckCircle size={16} />
                <span className="font-sans" style={{ fontSize: "13px" }}>Check your new email for a confirmation link.</span>
              </div>
            )}
            <div className="flex">
              <button
                type="submit"
                disabled={emailLoading || newEmail === user?.email}
                className="h-11 px-8 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded disabled:opacity-60"
                style={{ fontSize: "12px" }}
              >
                {emailLoading ? "SAVING..." : "UPDATE EMAIL"}
              </button>
            </div>
          </form>

          {/* ── Password ── */}
          <form onSubmit={handlePasswordSave} className={sectionClass}>
            <span className={headingClass} style={{ fontSize: "13px" }}>CHANGE PASSWORD</span>
            <div className="flex flex-col gap-4">
              <Field label="Current Password">
                <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
              </Field>
              <Field label="New Password">
                <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="Min. 8 characters" />
              </Field>
              <Field label="Confirm New Password">
                <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat new password" />
              </Field>
            </div>
            {passwordError && <p className="font-sans text-red-500" style={{ fontSize: "13px" }}>{passwordError}</p>}
            {passwordSaved && (
              <div className="flex items-center gap-2 text-[#4CAF50]">
                <CheckCircle size={16} />
                <span className="font-sans" style={{ fontSize: "13px" }}>Password updated successfully.</span>
              </div>
            )}
            <div className="flex">
              <button
                type="submit"
                disabled={passwordLoading}
                className="h-11 px-8 bg-bodyshop-blush text-white font-sans font-semibold tracking-[0.15em] hover:bg-bodyshop-blush-dark transition rounded disabled:opacity-60"
                style={{ fontSize: "12px" }}
              >
                {passwordLoading ? "SAVING..." : "UPDATE PASSWORD"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
