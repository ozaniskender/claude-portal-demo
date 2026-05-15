import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235f5e5a' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

function StyledSelect({ value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-[#f4f3ef] disabled:text-[#888780]"
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
          <p className="text-[#5f5e5a] text-sm">Bu sayfayı sadece kullanıcı görebilir.</p>
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
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-black/10">
            <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Yeni talep oluştur</p>
            <p className="text-[13px] text-[#5f5e5a]">
              Mevcut harcama kademenizi değiştirmek için aşağıdaki formu doldurun.
            </p>
          </div>

          <div className="px-6 py-6">
            {/* Talep Tipi */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Talep tipi</label>
              <StyledSelect
                value="Spend Kademesi Değişikliği"
                onChange={handleTalepTipiChange}
                options={["Spend Kademesi Değişikliği", "Yeni Lisans Talebi", "Custom Role Değişikliği"]}
              />
            </div>

            {/* Profil Kartı */}
            <div className="bg-[#f4f3ef] rounded-lg px-[18px] py-4 mb-6">
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f5e5a" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider">Profil bilgileri · Azure AD</span>
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
                    <p className="text-[10px] text-[#888780] uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-[14px] text-[#1c1c1a]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Talep Edilen Kademe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">
                Talep edilen kademe<span className="text-[#791f1f] ml-0.5">*</span>
              </label>
              <StyledSelect
                value={requestedTier}
                onChange={(e) => setRequestedTier(e.target.value)}
                options={["Entry", "Medium", "High", "Very High"]}
              />
            </div>

            {/* Gerekçe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">
                Gerekçe<span className="text-[#791f1f] ml-0.5">*</span>
              </label>
              <p className="text-[12px] text-[#5f5e5a] mb-1.5">
                Neden değişiklik talep ediyorsunuz? Yeni iş yükünüz veya kullanım pattern&apos;iniz nedir?
              </p>
              <textarea
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                placeholder="Örn: İş Bankası PYS projesinin yeni fazında günlük olarak büyük döküman analizleri ve müşteri profil raporları oluşturuyorum. Son iki ay Medium limit'i sürekli aştı..."
                className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className={`text-[11px] mt-1 text-right ${gerekce.length >= 50 ? "text-[#27500a]" : "text-[#888780]"}`}>
                {gerekce.length} / 50 karakter
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 mt-3 border-t border-black/10">
              <div className="flex items-center gap-1.5 text-[12px] text-[#5f5e5a]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Manager onayı ve provisioning ile tamamlanır</span>
              </div>
              <div className="flex gap-2">
                <Link href="/" className="px-4 py-2 text-[13px] font-medium border border-black/20 rounded-lg bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors">
                  İptal
                </Link>
                <button
                  onClick={handleSubmit}
                  disabled={!isSubmittable}
                  className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#0c447c] text-white border border-[#0c447c] hover:bg-[#093660] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
