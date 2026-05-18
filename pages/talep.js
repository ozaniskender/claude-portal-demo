import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import users from "@/data/users.json";
import Link from "next/link";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");

const CAPABILITY_OPTIONS = ["BA & CE", "Tech Consulting", "AI & Analytics", "Marketing"];
const ACCOUNT_OPTIONS = ["İş Bankası", "Garanti", "Türk Telekom", "N/A"];
const LEVEL_OPTIONS = ["Consultant", "Lead Developer", "Principal", "Expert"];
const TOOL_OPTIONS = ["Chat", "Chat + Code", "Chat + Code + Cowork"];

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233B4A6B' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

function Field({ label, required, children }) {
  return (
    <div className="mb-5">
      <label className="block text-[13px] font-medium text-content-primary mb-1.5">
        {label}{required && <span className="text-state-danger ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function StyledSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
      style={{
        backgroundImage: SELECT_ARROW,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "32px",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export default function Talep() {
  const router = useRouter();
  const [persona, setPersona] = useState(null);

  const [capability, setCapability] = useState("BA & CE");
  const [account, setAccount] = useState("İş Bankası");
  const [level, setLevel] = useState("Consultant");
  const [tool, setTool] = useState("Chat");
  const [gerekce, setGerekce] = useState("");
  const [aup, setAup] = useState(false);
  const [veri, setVeri] = useState(false);
  const [egitim, setEgitim] = useState(false);

  useEffect(() => {
    setPersona(localStorage.getItem("currentPersona") || "Burçak");
  }, []);

  function handleTalepTipiChange(e) {
    const val = e.target.value;
    if (val === "Spend Kademesi Değişikliği") router.push("/talep-spend");
    else if (val === "Custom Role Değişikliği") router.push("/talep-role");
  }

  function handleSubmit() {
    const reqId = `REQ-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const request = {
      id: reqId,
      type: "new_license",
      requester: burcak.name,
      manager: zeynep.name,
      state: "pending_manager_approval",
      data: { capability, account, level, tool, gerekce },
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

  const isSubmittable = aup && veri && egitim && gerekce.trim().length > 0;

  const requestDate = new Date().toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }) + ", " + new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Layout>
      <Head><title>Yeni Talep · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-bordered flex items-start gap-3">
            <div className="w-1 h-5 rounded-full bg-brand-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[17px] text-content-primary mb-0.5">Yeni talep oluştur</p>
              <p className="text-[13px] text-content-secondary">
                Lütfen aşağıdaki alanları doldurun. Yöneticinize otomatik olarak iletilecektir.
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Talep Tipi */}
            <Field label="Talep tipi">
              <StyledSelect
                value="Yeni Lisans Talebi"
                onChange={handleTalepTipiChange}
                options={["Yeni Lisans Talebi", "Spend Kademesi Değişikliği", "Custom Role Değişikliği"]}
              />
            </Field>

            {/* Profil Kartı */}
            <div className="bg-surface-muted rounded-xl border border-surface-bordered px-[18px] py-4 mb-6">
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7894" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider">
                  Profil bilgileri · Azure AD
                </span>
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

            {/* Grup Atamaları */}
            <div className="mb-5">
              <p className="text-[13px] font-semibold text-content-primary mb-3.5 pb-2 border-b border-surface-bordered">
                Grup atamaları
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                    Capability<span className="text-state-danger ml-0.5">*</span>
                  </label>
                  <StyledSelect value={capability} onChange={(e) => setCapability(e.target.value)} options={CAPABILITY_OPTIONS} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                    Account<span className="text-state-danger ml-0.5">*</span>
                  </label>
                  <StyledSelect value={account} onChange={(e) => setAccount(e.target.value)} options={ACCOUNT_OPTIONS} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                    Level of Practise<span className="text-state-danger ml-0.5">*</span>
                  </label>
                  <StyledSelect value={level} onChange={(e) => setLevel(e.target.value)} options={LEVEL_OPTIONS} />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                    Tool yetkisi<span className="text-state-danger ml-0.5">*</span>
                  </label>
                  <StyledSelect value={tool} onChange={(e) => setTool(e.target.value)} options={TOOL_OPTIONS} />
                </div>
              </div>
            </div>

            {/* Gerekçe */}
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">
                Kullanım gerekçesi<span className="text-state-danger ml-0.5">*</span>
              </label>
              <p className="text-[12px] text-content-secondary mb-1.5">
                Claude&apos;u hangi iş akışlarında, ne sıklıkta kullanmayı düşünüyorsunuz?
              </p>
              <textarea
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                placeholder="Örn: İş Bankası PYS projesinde müşteri segmentasyon raporlarının taslaklarını oluşturmak, mevcut Excel modellerini açıklayan dokümantasyon yazmak ve sunum görsellerini revize etmek için günlük olarak kullanmayı planlıyorum..."
                className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[90px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            {/* Onaylar */}
            <div className="mb-5">
              <p className="text-[13px] font-semibold text-content-primary mb-3.5 pb-2 border-b border-surface-bordered">
                Onaylar
              </p>
              {[
                {
                  id: "aup", checked: aup, onChange: setAup,
                  content: (
                    <><span className="font-medium">AUP onayı</span> — Definex Claude Kullanım Politikası&apos;nı okudum ve kabul ediyorum.{" "}
                      <a href="#" className="text-brand-primary hover:underline">Politikayı görüntüle</a></>
                  ),
                },
                {
                  id: "veri", checked: veri, onChange: setVeri,
                  content: (
                    <><span className="font-medium">Veri hassasiyeti onayı</span> — Müşteri verisi, finansal model parametreleri veya kişisel veri girişi yapmayacağımı taahhüt ederim.</>
                  ),
                },
                {
                  id: "egitim", checked: egitim, onChange: setEgitim,
                  content: (
                    <><span className="font-medium">Eğitim modülü teyidi</span> — Definex&apos;in 15 dakikalık Claude best practices eğitimini tamamladım.</>
                  ),
                },
              ].map(({ id, checked, onChange, content }) => (
                <label key={id} className="flex items-start gap-2.5 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-1 cursor-pointer accent-brand-primary"
                  />
                  <span className="text-[13px] leading-relaxed text-content-primary">{content}</span>
                </label>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-5 mt-3 border-t border-surface-bordered">
              <div className="flex items-center gap-1.5 text-[12px] text-content-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Gönderim sonrası Zeynep Şen&apos;e onay maili iletilir</span>
              </div>
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
    </Layout>
  );
}