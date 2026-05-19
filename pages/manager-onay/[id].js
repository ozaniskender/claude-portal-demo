import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233B4A6B' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`;

const ROLE_CAPABILITIES = {
  Chat: ["Chat", "Projects", "File Upload", "Artifacts"],
  "Chat + Code": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access"],
  "Chat + Code + Cowork": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access", "Cowork"],
};

const TIER_OPTIONS = ["Entry", "Medium", "High", "Very High"];
const ROLE_OPTIONS = ["Chat", "Chat + Code", "Chat + Code + Cowork"];

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

function CapPill({ label, blue }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full ${
      blue ? "bg-brand-light-blue text-brand-primary" : "bg-[#EAF3DE] text-state-success"
    }`}>
      <span className="text-[10px]">✓</span>
      {label}
    </span>
  );
}

function ProfileCard({ req }) {
  const requestDate = new Date(req.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }) + ", " + new Date(req.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-surface-muted rounded-xl border border-surface-bordered px-[18px] py-4 mb-6">
      <div className="flex items-center gap-1.5 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7894" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider">Profil bilgileri · Azure AD</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-5">
        {[
          ["Ad Soyad", burcak.name],
          ["Email", burcak.email],
          ["Capability / Departman", "BA & CE"],
          ["Job Title", "Consultant"],
          ["Manager", zeynep.email],
          ["Talep tarihi", requestDate],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] text-content-tertiary uppercase tracking-wider mb-0.5 font-semibold">{label}</p>
            <p className="text-[14px] text-content-primary break-all">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoBar({ req }) {
  return (
    <div className="bg-brand-light-blue px-6 py-3 flex items-center justify-between border-b border-surface-bordered">
      <div className="flex items-center gap-2">
        <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-brand-light-blue text-brand-primary border border-brand-primary/20">
          Onay bekliyor
        </span>
        <span className="text-[13px] text-brand-primary">Direct report: {req.requester}</span>
      </div>
      <span className="text-[12px] text-brand-primary font-mono">Talep #{req.id}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[13px] font-semibold text-content-primary mb-3.5 pb-2 border-b border-surface-bordered">{children}</p>
  );
}

function GerekceCard({ text }) {
  return (
    <div className="bg-surface-muted rounded-xl border border-surface-bordered px-4 py-3.5 text-[13px] text-content-primary leading-relaxed">
      {text}
    </div>
  );
}

function Footer({ onReject, onApprove, approveDisabled }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center pt-5 mt-3 border-t border-surface-bordered">
      <div className="flex items-center gap-1.5 text-[12px] text-content-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Onay sonrası provisioning için iletilir</span>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={onReject}
          className="flex-1 md:flex-none px-4 py-2.5 text-[13px] font-medium rounded-lg bg-state-danger text-white hover:bg-[#7d2415] transition-colors"
        >
          Reddet
        </button>
        <button
          onClick={onApprove}
          disabled={approveDisabled}
          className="flex-1 md:flex-none px-4 py-2.5 text-[13px] font-medium rounded-lg bg-state-success text-white hover:bg-[#4a6824] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Onayla ve gönder
        </button>
      </div>
    </div>
  );
}

/* ── New License view ── */
function NewLicenseView({ req, toolYetkisi, setToolYetkisi, note, setNote, onReject, onApprove }) {
  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-semibold text-[17px] text-content-primary mb-0.5">Yeni lisans talebi — onay</p>
        <p className="text-[13px] text-content-secondary mb-6">
          {req.requester} için yeni Claude lisansı talep edildi. İncelemenizi rica ederiz.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Talep edilen ayarlar (düzenleyebilirsiniz)</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Capability", req.data.capability || "BA & CE"],
              ["Account", req.data.account || "İş Bankası"],
              ["Level of Practise", req.data.level || "Consultant"],
            ].map(([label, value]) => (
              <div key={label}>
                <label className="block text-[13px] font-medium text-content-primary mb-1.5">{label}</label>
                <div className="px-3 py-2 text-sm bg-surface-muted border border-surface-bordered rounded-lg text-content-primary">
                  {value}
                </div>
              </div>
            ))}
            <div>
              <label className="block text-[13px] font-medium text-content-primary mb-1.5">Tool yetkisi</label>
              <StyledSelect
                value={toolYetkisi}
                onChange={(e) => setToolYetkisi(e.target.value)}
                options={["Chat", "Chat + Code", "Chat + Code + Cowork"]}
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <SectionTitle>Burçak&apos;ın gerekçesi</SectionTitle>
          <GerekceCard text={req.data.gerekce || "—"} />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-content-primary mb-1.5">Onay notu (opsiyonel)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Onay veya öneriniz hakkında not ekleyebilirsiniz..."
            className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <Footer onReject={onReject} onApprove={onApprove} approveDisabled={false} />
      </div>
    </>
  );
}

/* ── Spend Upgrade view ── */
function SpendView({ req, approvedTier, setApprovedTier, note, setNote, onReject, onApprove }) {
  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-semibold text-[17px] text-content-primary mb-0.5">Spend kademesi değişikliği — onay</p>
        <p className="text-[13px] text-content-secondary mb-6">
          {req.requester} spend kademesi değişikliği talep ediyor.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Talep detayı</SectionTitle>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              ["Mevcut kademe", req.data.currentTier],
              ["Talep edilen kademe", req.data.requestedTier],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] text-content-tertiary uppercase tracking-wider mb-0.5 font-semibold">{label}</p>
                <p className="text-[14px] font-semibold text-content-primary">{value}</p>
              </div>
            ))}
          </div>
          <GerekceCard text={req.data.gerekce || "—"} />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-content-primary mb-1.5">Onayladığınız kademe</label>
          <StyledSelect
            value={approvedTier}
            onChange={(e) => setApprovedTier(e.target.value)}
            options={TIER_OPTIONS}
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-content-primary mb-1.5">
            Onay gerekçesi<span className="text-state-danger ml-0.5">*</span>
          </label>
          <p className="text-[12px] text-content-secondary mb-1.5">Bütçe kararının kayıt altına alınması için gerekli.</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn: Kullanım pattern'i mevcut kademeyi aşıyor, proje yoğunluğu Q3 sonuna kadar devam edecek..."
            className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <Footer onReject={onReject} onApprove={onApprove} approveDisabled={note.trim().length === 0} />
      </div>
    </>
  );
}

/* ── Role Change view ── */
function RoleView({ req, approvedRole, setApprovedRole, note, setNote, onReject, onApprove }) {
  const currentCaps = ROLE_CAPABILITIES[req.data.currentRole] || [];
  const requestedCaps = ROLE_CAPABILITIES[req.data.requestedRole] || [];

  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-semibold text-[17px] text-content-primary mb-0.5">Custom role değişikliği — onay</p>
        <p className="text-[13px] text-content-secondary mb-6">
          {req.requester} mevcut tool yetkisinin değiştirilmesini talep ediyor.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Talep edilen değişiklik</SectionTitle>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            <div className="bg-surface-muted rounded-xl border border-surface-bordered px-4 py-3">
              <p className="text-[11px] text-content-tertiary uppercase tracking-wider mb-2 font-semibold">
                Mevcut role: {req.data.currentRole}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentCaps.map((cap) => <CapPill key={cap} label={cap} blue={false} />)}
              </div>
            </div>
            <div className="flex items-center justify-center pt-8">
              <svg className="w-5 h-5 text-content-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="bg-brand-light-blue rounded-xl border border-brand-primary/20 px-4 py-3">
              <p className="text-[11px] text-brand-primary uppercase tracking-wider mb-2 font-semibold">
                Talep edilen: {req.data.requestedRole}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {requestedCaps.map((cap) => <CapPill key={cap} label={cap} blue={true} />)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <SectionTitle>Talep detayı</SectionTitle>
          <GerekceCard text={req.data.gerekce || "—"} />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-content-primary mb-1.5">Onayladığınız Custom Role</label>
          <StyledSelect
            value={approvedRole}
            onChange={(e) => setApprovedRole(e.target.value)}
            options={ROLE_OPTIONS}
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-content-primary mb-1.5">Onay notu (opsiyonel)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Onay veya öneriniz hakkında not ekleyebilirsiniz..."
            className="w-full px-3 py-2 text-sm border border-surface-bordered rounded-lg bg-surface text-content-primary resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <Footer onReject={onReject} onApprove={onApprove} approveDisabled={false} />
      </div>
    </>
  );
}

/* ── Main page ── */
export default function ManagerOnay() {
  const router = useRouter();
  const { id } = router.query;

  const [persona, setPersona] = useState(null);
  const [request, setRequest] = useState(null);
  const [toolYetkisi, setToolYetkisi] = useState("Chat");
  const [approvedTier, setApprovedTier] = useState("High");
  const [approvedRole, setApprovedRole] = useState("Chat + Code");
  const [note, setNote] = useState("");

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
  }, []);

  useEffect(() => {
    if (!id) return;
    const all = JSON.parse(localStorage.getItem("requests") || "[]");
    const req = all.find((r) => r.id === id);
    if (req) {
      setRequest(req);
      if (req.type === "new_license") setToolYetkisi(req.data.tool || "Chat");
      if (req.type === "spend_upgrade") setApprovedTier(req.data.requestedTier || "High");
      if (req.type === "role_change") setApprovedRole(req.data.requestedRole || "Chat + Code");
    }
  }, [id]);

  function handleDecision(approved) {
    const all = JSON.parse(localStorage.getItem("requests") || "[]");
    const updated = all.map((r) => {
      if (r.id !== id) return r;
      const approval = {
        by: zeynep.name,
        at: new Date().toISOString(),
        note,
        ...(approved && r.type === "new_license" ? { approvedTool: toolYetkisi } : {}),
        ...(approved && r.type === "spend_upgrade" ? { approvedTier } : {}),
        ...(approved && r.type === "role_change" ? { approvedRole } : {}),
      };
      return {
        ...r,
        state: approved ? "pending_provisioning" : "rejected_by_manager",
        managerApproval: approval,
      };
    });
    localStorage.setItem("requests", JSON.stringify(updated));
    localStorage.setItem(
      "lastManagerAction",
      JSON.stringify({ result: approved ? "approved" : "rejected", reqId: id, requester: request.requester })
    );
    router.push("/manager-onay-tamam");
  }

  if (persona === null) return null;

  if (persona !== "Zeynep") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Bu sayfayı sadece manager görebilir.</p>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Talep bulunamadı veya yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  const viewProps = {
    req: request,
    note,
    setNote,
    onReject: () => handleDecision(false),
    onApprove: () => handleDecision(true),
  };

  return (
    <Layout>
      <Head><title>Onay Bekleniyor · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <InfoBar req={request} />

          {request.type === "new_license" && (
            <NewLicenseView {...viewProps} toolYetkisi={toolYetkisi} setToolYetkisi={setToolYetkisi} />
          )}
          {request.type === "spend_upgrade" && (
            <SpendView {...viewProps} approvedTier={approvedTier} setApprovedTier={setApprovedTier} />
          )}
          {request.type === "role_change" && (
            <RoleView {...viewProps} approvedRole={approvedRole} setApprovedRole={setApprovedRole} />
          )}

          <div className="px-6 pb-6" />
        </div>
      </div>
    </Layout>
  );
}
