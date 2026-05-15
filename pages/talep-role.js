import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235f5e5a' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

const ROLE_CAPABILITIES = {
  Chat: ["Chat", "Projects", "File Upload", "Artifacts"],
  "Chat + Code": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access"],
  "Chat + Code + Cowork": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access", "Cowork"],
};

const CURRENT_ROLE = "Chat";
const CURRENT_CAPS = ROLE_CAPABILITIES[CURRENT_ROLE];

function StyledSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        ? "bg-[#eaf3de] text-[#27500a]"
        : "bg-[#f4f3ef] text-[#888780] line-through"
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
    const reqId = `REQ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const request = {
      id: reqId,
      type: "role_change",
      requester: burcak.name,
      manager: zeynep.name,
      state: "pending_manager_approval",
      data: { currentRole: CURRENT_ROLE, requestedRole, gerekce },
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

  const newCaps = ROLE_CAPABILITIES[requestedRole] || [];
  const isCodeRole = requestedRole.includes("Code");
  const isSubmittable = gerekce.length >= 50 && egitim;

  return (
    <Layout>
      <Head><title>Custom Role Değişikliği · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-black/10">
            <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Yeni talep oluştur</p>
            <p className="text-[13px] text-[#5f5e5a]">
              Mevcut tool yetkinizi değiştirmek için aşağıdaki formu doldurun.
            </p>
          </div>

          <div className="px-6 py-6">
            {/* Talep Tipi */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Talep tipi</label>
              <StyledSelect
                value="Custom Role Değişikliği"
                onChange={handleTalepTipiChange}
                options={["Custom Role Değişikliği", "Yeni Lisans Talebi", "Spend Kademesi Değişikliği"]}
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

            {/* Talep Edilen Role */}
            <div className="mb-3">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">
                Talep edilen Custom Role<span className="text-[#791f1f] ml-0.5">*</span>
              </label>
              <StyledSelect
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                options={["Chat + Code", "Chat + Code + Cowork"]}
              />
            </div>

            {/* Yeni Rol Yetenek Önizlemesi */}
            <div className="bg-[#f4f3ef] rounded-lg px-4 py-3 mb-5">
              <p className="text-[11px] text-[#888780] uppercase tracking-wider mb-2">Yeni rolde açılacak yetenekler</p>
              <div className="flex flex-wrap gap-1.5">
                {newCaps.map((cap) => (
                  <CapPill key={cap} label={cap} open={true} />
                ))}
              </div>
            </div>

            {/* Gerekçe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">
                Gerekçe<span className="text-[#791f1f] ml-0.5">*</span>
              </label>
              <p className="text-[12px] text-[#5f5e5a] mb-1.5">
                Yeni Custom Role&apos;ü neden istiyorsunuz? Hangi iş akışları için?
              </p>
              <textarea
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                placeholder="Örn: Yeni başlayacağım Tech Consulting projesinde Python ile data pipeline geliştirmem gerekiyor. Claude Code, mevcut iş yüküm için kritik bir araç olacak..."
                className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className={`text-[11px] mt-1 text-right ${gerekce.length >= 50 ? "text-[#27500a]" : "text-[#888780]"}`}>
                {gerekce.length} / 50 karakter
              </p>
            </div>

            {/* Eğitim Checkbox */}
            <div className="mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={egitim}
                  onChange={(e) => setEgitim(e.target.checked)}
                  className="mt-1 cursor-pointer"
                />
                <span className="text-[13px] leading-relaxed text-[#1c1c1a]">
                  <span className="font-medium">Eğitim teyidi</span>
                  {isCodeRole && <span className="text-[#791f1f] ml-0.5">*</span>}
                  {" "}— Definex Claude Code eğitimini tamamladım.
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 mt-3 border-t border-black/10">
              <div className="flex items-center gap-1.5 text-[12px] text-[#5f5e5a]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Manager onayı + Hakan Kormanlı provisioning ile tamamlanır</span>
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
