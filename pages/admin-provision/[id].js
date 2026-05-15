import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import users from "@/data/users.json";

const burcak = users.find((u) => u.id === "burcak");
const zeynep = users.find((u) => u.id === "zeynep");
const hakan = users.find((u) => u.id === "hakan");

const ROLE_CAPABILITIES = {
  Chat: ["Chat", "Projects", "File Upload", "Artifacts"],
  "Chat + Code": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access"],
  "Chat + Code + Cowork": ["Chat", "Projects", "File Upload", "Artifacts", "Claude Code", "Web Search", "API Access", "Cowork"],
};

/* ── Shared UI ── */

function InfoBar({ req }) {
  return (
    <div className="bg-[#eaf3de] px-6 py-3 flex items-center justify-between border-b border-black/10">
      <div className="flex items-center gap-2">
        <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-lg bg-[#eaf3de] text-[#27500a] border border-[#639922]/40">
          Provisioning bekliyor
        </span>
        <span className="text-[13px] text-[#27500a]">
          Manager onayı: {req.managerApproval?.by || zeynep.name} ✓
        </span>
      </div>
      <span className="text-[12px] text-[#27500a]">Talep #{req.id}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <p className="text-[13px] font-medium text-[#1c1c1a] mb-3.5 pb-2 border-b border-black/10">{children}</p>;
}

function ProfileCard({ req }) {
  const requestDate = new Date(req.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  }) + ", " + new Date(req.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return (
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
          ["Capability / Departman", "BA & CE"],
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
  );
}

function ApprovalChain({ req }) {
  const createdAt = new Date(req.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) +
    ", " + new Date(req.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  const approvedAt = req.managerApproval?.at
    ? new Date(req.managerApproval.at).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }) +
      ", " + new Date(req.managerApproval.at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="bg-[#f4f3ef] rounded-lg divide-y divide-black/10 mb-5">
      <div className="flex justify-between items-center px-4 py-2.5 text-[13px]">
        <span className="text-[#5f5e5a]">Talep oluşturuldu</span>
        <span className="font-medium text-[#1c1c1a]">{createdAt} — {req.requester}</span>
      </div>
      <div className="flex justify-between items-center px-4 py-2.5 text-[13px]">
        <span className="text-[#5f5e5a]">Manager onayı</span>
        <span className="font-medium text-[#1c1c1a]">{approvedAt} — {req.managerApproval?.by || zeynep.name} ✓</span>
      </div>
      {req.managerApproval?.note && (
        <div className="flex justify-between items-start px-4 py-2.5 text-[13px]">
          <span className="text-[#5f5e5a] shrink-0">Manager onay gerekçesi</span>
          <span className="text-[#1c1c1a] text-right max-w-xs">{req.managerApproval.note}</span>
        </div>
      )}
    </div>
  );
}


function CapPill({ label, blue }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-full ${blue ? "bg-[#e6f1fb] text-[#0c447c]" : "bg-[#eaf3de] text-[#27500a]"}`}>
      <span className="text-[10px]">✓</span>{label}
    </span>
  );
}

function ProvisionFooter({ onBack, onProvision, loading }) {
  return (
    <div className="flex justify-between items-center pt-5 mt-3 border-t border-black/10">
      <div className="flex items-center gap-1.5 text-[12px] text-[#5f5e5a]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Provisioning tamamlandığında Burçak&apos;a bilgilendirme maili gider</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 text-[13px] font-medium border border-black/20 rounded-lg bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Geri dön
        </button>
        <button
          onClick={onProvision}
          disabled={loading}
          className="min-w-[120px] px-4 py-2 text-[13px] font-medium rounded-lg bg-[#3b6d11] text-white border border-[#3b6d11] hover:bg-[#2f5a0e] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Gönderiliyor...
            </>
          ) : "Provision"}
        </button>
      </div>
    </div>
  );
}

/* ── Type views ── */

function NewLicenseView({ req, limitOverride, setLimitOverride, internalNote, setInternalNote, loading, onBack, onProvision }) {
  const tool = req.managerApproval?.approvedTool || req.data?.tool || "Chat";

  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Provisioning — yeni lisans</p>
        <p className="text-[13px] text-[#5f5e5a] mb-6">
          {req.requester} için Anthropic Admin API çağrıları hazır. Provision butonu ile tetiklenecek.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Atanacak gruplar</SectionTitle>
          <div className="bg-[#f4f3ef] rounded-lg divide-y divide-black/10">
            {[
              ["Capability", req.data?.capability || "BA & CE"],
              ["Account", req.data?.account || "İş Bankası"],
              ["Seniority", req.data?.level || "Consultant"],
              ["Tool yetkisi (Custom Role)", tool],
              ["Spend kademesi", "Medium (default)"],
              ["Panel rolü", "Custom roles"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center px-4 py-2.5 text-[13px]">
                <span className="text-[#5f5e5a]">{label}</span>
                <span className="font-medium text-[#1c1c1a]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Bireysel limit override (opsiyonel)</label>
          <p className="text-[12px] text-[#5f5e5a] mb-1.5">Spend kademesi default limit&apos;inden farklı kalıcı bir limit atamak istiyorsanız.</p>
          <input
            type="text"
            value={limitOverride}
            onChange={(e) => setLimitOverride(e.target.value)}
            placeholder="Boş bırakın, grup limit'i geçerli olur"
            className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Internal not (kullanıcı görmez)</label>
          <textarea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Provisioning hakkında dahili not..."
            className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <ProvisionFooter onBack={onBack} onProvision={onProvision} loading={loading} />
      </div>
    </>
  );
}

function SpendView({ req, limitOverride, setLimitOverride, loading, onBack, onProvision }) {
  const currentTier = req.data?.currentTier || "Medium";
  const newTier = req.managerApproval?.approvedTier || req.data?.requestedTier || "High";

  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Provisioning — spend kademesi değişikliği</p>
        <p className="text-[13px] text-[#5f5e5a] mb-6">
          {req.requester}&apos;in spend kademesi {currentTier}&apos;dan {newTier}&apos;a değiştirilecek.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Yapılacak değişiklik</SectionTitle>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="bg-[#f4f3ef] rounded-lg px-4 py-5 text-center">
              <p className="text-[11px] text-[#888780] uppercase tracking-wider mb-2">Mevcut kademe</p>
              <p className="text-[20px] font-medium text-[#1c1c1a]">{currentTier}</p>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-[#5f5e5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="bg-[#e6f1fb] rounded-lg px-4 py-5 text-center">
              <p className="text-[11px] text-[#0c447c] uppercase tracking-wider mb-2">Yeni kademe</p>
              <p className="text-[20px] font-medium text-[#0c447c]">{newTier}</p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <SectionTitle>Onay zinciri</SectionTitle>
          <ApprovalChain req={req} />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Bireysel limit override (opsiyonel)</label>
          <p className="text-[12px] text-[#5f5e5a] mb-1.5">{newTier} kademe default limit&apos;inden farklı kalıcı bir limit atamak istiyorsanız.</p>
          <input
            type="text"
            value={limitOverride}
            onChange={(e) => setLimitOverride(e.target.value)}
            placeholder={`Boş bırakın, ${newTier} grup limit'i geçerli olur`}
            className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-2.5 bg-[#faeeda] border-l-[3px] border-[#ba7517] rounded-lg px-4 py-3 mb-5 text-[13px] text-[#854f0b] leading-relaxed">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>Kademe değişikliği kalıcıdır. Otomatik geri dönüş yoktur; eski kademeye dönmek için yeni bir talep oluşturulmalıdır.</span>
        </div>

        <ProvisionFooter onBack={onBack} onProvision={onProvision} loading={loading} />
      </div>
    </>
  );
}

function RoleView({ req, internalNote, setInternalNote, loading, onBack, onProvision }) {
  const currentRole = req.data?.currentRole || "Chat";
  const newRole = req.managerApproval?.approvedRole || req.data?.requestedRole || "Chat + Code";
  const currentCaps = ROLE_CAPABILITIES[currentRole] || [];
  const newCaps = ROLE_CAPABILITIES[newRole] || [];

  return (
    <>
      <div className="px-6 pt-5 pb-1">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Provisioning — custom role değişikliği</p>
        <p className="text-[13px] text-[#5f5e5a] mb-6">
          {req.requester}&apos;in tool yetkisi {currentRole}&apos;dan {newRole}&apos;a değiştirilecek.
        </p>
      </div>
      <div className="px-6">
        <ProfileCard req={req} />

        <div className="mb-5">
          <SectionTitle>Yapılacak değişiklik</SectionTitle>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
            <div className="bg-[#f4f3ef] rounded-lg px-4 py-3">
              <p className="text-[11px] text-[#888780] uppercase tracking-wider mb-2">Mevcut role: {currentRole}</p>
              <div className="flex flex-wrap gap-1.5">
                {currentCaps.map((cap) => <CapPill key={cap} label={cap} blue={false} />)}
              </div>
            </div>
            <div className="flex items-center justify-center pt-8">
              <svg className="w-5 h-5 text-[#5f5e5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className="bg-[#e6f1fb] rounded-lg px-4 py-3">
              <p className="text-[11px] text-[#0c447c] uppercase tracking-wider mb-2">Yeni role: {newRole}</p>
              <div className="flex flex-wrap gap-1.5">
                {newCaps.map((cap) => <CapPill key={cap} label={cap} blue={true} />)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <SectionTitle>Onay zinciri</SectionTitle>
          <ApprovalChain req={req} />
        </div>

        <div className="flex gap-2.5 bg-[#e6f1fb] border-l-[3px] border-[#185fa5] rounded-lg px-4 py-3 mb-5 text-[13px] text-[#0c447c] leading-relaxed">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Bu değişiklik kullanıcının spend pattern&apos;ini etkileyebilir. Claude Code erişimi ek tüketim anlamına gelebilir.</span>
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-medium text-[#1c1c1a] mb-1.5">Internal not (kullanıcı görmez)</label>
          <textarea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Provisioning hakkında dahili not..."
            className="w-full px-3 py-2 text-sm border border-black/20 rounded-lg bg-white text-[#1c1c1a] resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <ProvisionFooter onBack={onBack} onProvision={onProvision} loading={loading} />
      </div>
    </>
  );
}

/* ── Main ── */
export default function AdminProvision() {
  const router = useRouter();
  const { id } = router.query;

  const [persona, setPersona] = useState(null);
  const [request, setRequest] = useState(null);
  const [limitOverride, setLimitOverride] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
  }, []);

  useEffect(() => {
    if (!id) return;
    const all = JSON.parse(localStorage.getItem("requests") || "[]");
    const req = all.find((r) => r.id === id);
    if (req) setRequest(req);
  }, [id]);

  function handleBack() {
    router.push("/admin-queue");
  }

  function handleProvision() {
    setLoading(true);
    setTimeout(() => {
      const all = JSON.parse(localStorage.getItem("requests") || "[]");
      const updated = all.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          state: "completed",
          provisioning: {
            by: hakan.name,
            at: new Date().toISOString(),
            internalNote,
            limitOverride: limitOverride || null,
          },
        };
      });
      localStorage.setItem("requests", JSON.stringify(updated));
      localStorage.setItem("lastProvisionReqId", id);
      router.push("/admin-provision-tamam");
    }, 2000);
  }

  if (persona === null) return null;

  if (persona !== "Hakan") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#5f5e5a] text-sm">Bu sayfayı sadece License Admin görebilir.</p>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#5f5e5a] text-sm">Talep bulunamadı veya yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  const sharedProps = { req: request, loading, onBack: handleBack, onProvision: handleProvision };

  return (
    <Layout>
      <Head><title>Provisioning · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <InfoBar req={request} />

          {request.type === "new_license" && (
            <NewLicenseView {...sharedProps} limitOverride={limitOverride} setLimitOverride={setLimitOverride} internalNote={internalNote} setInternalNote={setInternalNote} />
          )}
          {request.type === "spend_upgrade" && (
            <SpendView {...sharedProps} limitOverride={limitOverride} setLimitOverride={setLimitOverride} />
          )}
          {request.type === "role_change" && (
            <RoleView {...sharedProps} internalNote={internalNote} setInternalNote={setInternalNote} />
          )}

          <div className="px-6 pb-6" />
        </div>
      </div>
    </Layout>
  );
}
