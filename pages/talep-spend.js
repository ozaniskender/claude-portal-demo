import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233B4A6B' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

function StyledSelect({ value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:bg-surface-subtle disabled:text-content-tertiary"
      style={{ backgroundImage: SELECT_ARROW, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px" }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function TalepSpend() {
  const router = useRouter();
  const [persona, setPersona] = useState(null);
  const [requestedTier, setRequestedTier] = useState("High");
  const [gerekce, setGerekce] = useState("");

  useEffect(() => {
    setPersona(localStorage.getItem("currentPersona") || "Burçak");
  }, []);

  function handleTalepTipiChange(e) {
    const val = e.target.value;
    if (val === "Yeni Lisans Talebi") router.push("/talep");
    else if (val === "Custom Role Değişikliği") router.push("/talep-role");
  }

  function handleSubmit() {
    const reqId = `REQ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const request = {
      id: reqId,
      type: "spend_upgrade",
      requester: burcak.name,
      manager: zeynep.name,
      state: "pending_manager_approval",
      data: { currentTier: "Medium", requestedTier, gerekce },
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("requests") || "[]");
    localStorage.setItem("requests", JSON.stringify([...existing, request]));
    localStorage.setItem("lastRequestId", reqId);
    router.push("/onay-bekleniyor");
  }

  if (persona === null) return null;

  if (persona !== "Burçak") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Bu sayfayı sadece kullanıcı görebilir.</p>
        </div>
      </Layout>
    );
  }

  const requestDate = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) +
    ", " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const isSubmittable = gerekce.length >= 50;

  return (
    <Layout>
      <Head><title>Spend Kademesi Değişikliği · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-bordered flex items-start gap-3">
            <div className="w-1 h-5 rounded-full bg-brand-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[17px] text-content-primary mb-0.5">Yeni talep oluştur</p>
              <p className="text-[13px] text-content-secondary">
                Mevcut harcama kademenizi değiştirmek için aşağıdaki formu doldurun.
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Talep Tipi */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">Talep tipi</label>
              <StyledSelect
                value="Spend Kademesi Değişikliği"
                onChange={handleTalepTipiChange}
                options={["Spend Kademesi Değişikliği", "Yeni Lisans Talebi", "Custom Role Değişikliği"]}
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
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-5">
                {[
                  ["Ad Soyad", burcak.name],
                  ["Email", burcak.email],
                  ["Capability", "BA & CE"],
                  ["Job Title", "Consultant"],
                  ["Manager", zeynep.email],
                  ["Talep tarihi", requestDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-content-tertiary uppercase tracking-wider mb-0.5 font-semibold">{label}</p>
                    <p className="text-[14px] text-content-primary">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Talep Edilen Kademe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                Talep edilen kademe<span className="text-state-danger ml-0.5">*</span>
              </label>
              <StyledSelect
                value={requestedTier}
                onChange={(e) => setRequestedTier(e.target.value)}
                options={["Entry", "Medium", "High", "Very High"]}
              />
            </div>

            {/* Gerekçe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                Gerekçe<span className="text-state-danger ml-0.5">*</span>
              </label>
              <p className="text-[12px] text-content-secondary mb-1.5">
                Neden değişiklik talep ediyorsunuz? Yeni iş yükünüz veya kullanım pattern&apos;iniz nedir?
              </p>
              <textarea
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                placeholder="Örn: İş Bankası PYS projesinin yeni fazında günlük olarak büyük döküman analizleri ve müşteri profil raporları oluşturuyorum. Son iki ay Medium limit'i sürekli aştı..."
                className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
              <div className="flex justify-between items-end mt-2">
                <p className="text-[11px] text-content-tertiary">En az 50 karakter</p>
                <p className={`text-[11px] ${gerekce.length >= 50 ? "text-state-success" : "text-content-tertiary"}`}>
                  {gerekce.length} / 50 karakter
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 mt-3 border-t border-surface-bordered">
              <div className="flex items-center gap-1.5 text-[12px] text-content-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Manager onayı ve provisioning ile tamamlanır</span>
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