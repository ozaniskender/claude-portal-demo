import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233B4A6B' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

const ROLE_CAPABILITIES = {
  Chat: ["Chat", "Projects", "File Upload", "Artifacts"],
  "Chat + Code": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access"],
  "Chat + Code + Cowork": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access", "Cowork"],
};

const CURRENT_ROLE = "Chat";

function StyledSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
      style={{ backgroundImage: SELECT_ARROW, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px" }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CapPill({ label, open }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full ${
      open
        ? "bg-[#EAF3DE] text-state-success"
        : "bg-surface-subtle text-content-tertiary line-through"
    }`}>
      <span className="text-[10px]">{open ? "✓" : "–"}</span>
      {label}
    </span>
  );
}

export default function TalepRole() {
  const router = useRouter();
  const [persona, setPersona] = useState(null);
  const [requestedRole, setRequestedRole] = useState("Chat + Code");
  const [gerekce, setGerekce] = useState("");
  const [egitim, setEgitim] = useState(false);

  useEffect(() => {
    setPersona(localStorage.getItem("currentPersona") || "Burçak");
  }, []);

  function handleTalepTipiChange(e) {
    const val = e.target.value;
    if (val === "Yeni Lisans Talebi") router.push("/talep");
    else if (val === "Spend Kademesi Değişikliği") router.push("/talep-spend");
  }

  function handleSubmit() {
    const activeUser = users.find((u) => u.id === (persona === "Zeynep" ? "zeynep" : "burcak"));
    const managerUser = users.find((u) => u.id === activeUser?.manager);
    const reqId = `REQ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const request = {
      id: reqId,
      type: "role_change",
      requester: activeUser?.name || persona,
      manager: managerUser?.name || "",
      state: "pending_manager_approval",
      data: { currentRole: CURRENT_ROLE, requestedRole, gerekce },
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("requests") || "[]");
    localStorage.setItem("requests", JSON.stringify([...existing, request]));
    localStorage.setItem("lastRequestId", reqId);
    localStorage.setItem("lastRequestManager", managerUser?.name || "");
    router.push("/onay-bekleniyor");
  }

  if (persona === null) return null;

  if (persona === "Hakan") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Bu sayfayı sadece kullanıcı veya manager görebilir.</p>
        </div>
      </Layout>
    );
  }

  const activeUser = users.find((u) => u.id === (persona === "Zeynep" ? "zeynep" : "burcak"));
  const managerUser = users.find((u) => u.id === activeUser?.manager);

  const requestDate = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) +
    ", " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const newCaps = ROLE_CAPABILITIES[requestedRole] || [];
  const isCodeRole = requestedRole.includes("Code");
  const isSubmittable = egitim;

  return (
    <Layout>
      <Head><title>Custom Role Değişikliği · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-bordered flex items-start gap-3">
            <div className="w-1 h-5 rounded-full bg-brand-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[17px] text-content-primary mb-0.5">Yeni talep oluştur</p>
              <p className="text-[13px] text-content-secondary">
                Mevcut tool yetkinizi değiştirmek için aşağıdaki formu doldurun.
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Talep Tipi */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">Talep tipi</label>
              <StyledSelect
                value="Custom Role Değişikliği"
                onChange={handleTalepTipiChange}
                options={["Custom Role Değişikliği", "Yeni Lisans Talebi", "Spend Kademesi Değişikliği"]}
              />
            </div>

            {/* Profil Kartı */}
            <div className="bg-surface-muted rounded-xl border border-surface-bordered px-[18px] py-4 mb-6">
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7894" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider">Profil bilgileri · Azure AD</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-5">
                {[
                  ["Ad Soyad", activeUser?.name || ""],
                  ["Email", activeUser?.email || ""],
                  ["Capability", "BA & CE"],
                  ["Job Title", activeUser?.jobTitle || "Consultant"],
                  ["Manager", managerUser?.email || ""],
                  ["Talep tarihi", requestDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-content-tertiary uppercase tracking-wider mb-0.5 font-semibold">{label}</p>
                    <p className="text-[14px] text-content-primary break-all">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Talep Edilen Role */}
            <div className="mb-3">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                Talep edilen Custom Role<span className="text-state-danger ml-0.5">*</span>
              </label>
              <StyledSelect
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                options={["Chat + Code", "Chat + Code + Cowork"]}
              />
            </div>

            {/* Yeni Rol Yetenek Önizlemesi */}
            <div className="bg-brand-light-blue rounded-xl border border-brand-primary/20 px-4 py-3 mb-5">
              <p className="text-[11px] text-brand-primary uppercase tracking-wider mb-2 font-semibold">Yeni rolde açılacak yetenekler</p>
              <div className="flex flex-wrap gap-1.5">
                {newCaps.map((cap) => (
                  <CapPill key={cap} label={cap} open={true} />
                ))}
              </div>
            </div>

            {/* Gerekçe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                Gerekçe<span className="text-state-danger ml-0.5">*</span>
              </label>
              <p className="text-[12px] text-content-secondary mb-1.5">
                Yeni Custom Role&apos;ü neden istiyorsunuz? Hangi iş akışları için?
              </p>
              <textarea
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                placeholder="Örn: Yeni başlayacağım Tech Consulting projesinde Python ile data pipeline geliştirmem gerekiyor. Claude Code, mevcut iş yüküm için kritik bir araç olacak..."
                className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            {/* Eğitim Checkbox */}
            <div className="mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={egitim}
                  onChange={(e) => setEgitim(e.target.checked)}
                  className="mt-1 cursor-pointer accent-brand-primary"
                />
                <span className="text-[13px] leading-relaxed text-content-primary">
                  <span className="font-medium">Eğitim teyidi</span>
                  {isCodeRole && <span className="text-state-danger ml-0.5">*</span>}
                  {" "}— Definex Claude Code eğitimini tamamladım.
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 mt-3 border-t border-surface-bordered">
              <div className="flex items-center gap-1.5 text-[12px] text-content-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Manager onayı + Hakan Kormanlı provisioning ile tamamlanır</span>
              </div>
              <div className="flex gap-2">
                <Link href="/" className="px-4 py-2 text-[13px] font-medium border border-surface-bordered rounded-lg bg-surface text-content-primary hover:bg-surface-muted transition-colors">
                  İptal
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={!isSubmittable}
                  className="px-4 py-2 text-[13px] font-medium rounded-lg bg-brand-primary text-white hover:bg-brand-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Talebi gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
