import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";

const TYPE_LABELS = {
  new_license: "Yeni Lisans Talebi",
  spend_upgrade: "Spend Kademesi Değişikliği",
  role_change: "Custom Role Değişikliği",
};

const STATE_BADGE = {
  pending_manager_approval: { label: "Yönetici onayı bekleniyor", classes: "bg-[#faeeda] text-[#854f0b]" },
  pending_provisioning: { label: "Provisioning bekleniyor", classes: "bg-[#e6f1fb] text-[#0c447c]" },
  completed: { label: "Tamamlandı", classes: "bg-[#eaf3de] text-[#27500a]" },
  rejected_by_manager: { label: "Reddedildi", classes: "bg-[#fcebeb] text-[#791f1f]" },
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] text-[#888780] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[14px] text-[#1c1c1a]">{value}</p>
    </div>
  );
}

function RequestContent({ req }) {
  const { type, data } = req;
  if (!data) return null;

  if (type === "new_license") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <InfoRow label="Capability" value={data.capability} />
        <InfoRow label="Proje / Hesap" value={data.account} />
        <InfoRow label="Seniority" value={data.level} />
        <InfoRow label="Tool Yetkisi" value={data.tool} />
        <div className="col-span-2">
          <InfoRow label="Kullanım Gerekçesi" value={data.gerekce} />
        </div>
      </div>
    );
  }

  if (type === "spend_upgrade") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <InfoRow label="Mevcut Kademe" value={data.currentTier} />
        <InfoRow label="Talep Edilen Kademe" value={data.requestedTier} />
        <div className="col-span-2">
          <InfoRow label="Gerekçe" value={data.gerekce} />
        </div>
      </div>
    );
  }

  if (type === "role_change") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <InfoRow label="Mevcut Role" value={data.currentRole} />
        <InfoRow label="Talep Edilen Role" value={data.requestedRole} />
        <div className="col-span-2">
          <InfoRow label="Gerekçe" value={data.gerekce} />
        </div>
      </div>
    );
  }

  return null;
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TimelineStep({ done, active, last, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          done
            ? "bg-[#eaf3de] border-2 border-[#639922]"
            : active
            ? "bg-[#e6f1fb] border-2 border-[#185fa5]"
            : "bg-[#f4f3ef] border-2 border-[#c8c7c0]"
        }`}>
          {done ? (
            <svg className="w-4 h-4 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-[#185fa5]" : "bg-[#c8c7c0]"}`} />
          )}
        </div>
        {!last && (
          <div className={`w-0.5 flex-1 mt-1 ${done ? "bg-[#639922]/40" : "bg-[#c8c7c0]/50"}`} style={{ minHeight: "24px" }} />
        )}
      </div>
      <div className="pb-6 min-w-0">{children}</div>
    </div>
  );
}

export default function TalepDetay() {
  const router = useRouter();
  const { id } = router.query;
  const [req, setReq] = useState(null);

  useEffect(() => {
    if (!id) return;
    const reqs = JSON.parse(localStorage.getItem("requests") || "[]");
    const found = reqs.find((r) => r.id === id);
    setReq(found || null);
  }, [id]);

  if (!id || req === undefined) return null;

  if (req === null) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[#5f5e5a] text-sm">Talep bulunamadı.</p>
        </div>
      </Layout>
    );
  }

  const badge = STATE_BADGE[req.state] || { label: req.state, classes: "bg-[#f4f3ef] text-[#5f5e5a]" };
  const isCompleted = req.state === "completed";
  const isRejected = req.state === "rejected_by_manager";
  const hasManagerAction = !!req.managerApproval;
  const hasProvisioning = !!req.provisioning;

  return (
    <Layout>
      <Head><title>Talep #{req.id} · Definex</title></Head>
      <div className="max-w-[820px] mx-auto space-y-4">

        {/* Summary Card */}
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[13px] text-[#5f5e5a] font-medium">{req.id}</span>
                <span className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg ${badge.classes}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[16px] font-semibold text-[#1c1c1a] mb-0.5">
                {TYPE_LABELS[req.type] || req.type}
              </p>
              <p className="text-[13px] text-[#5f5e5a]">
                {req.requester} · {formatDate(req.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Request Content Card */}
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-black/10">
            <p className="text-[13px] font-semibold text-[#1c1c1a] uppercase tracking-wider">Talep İçeriği</p>
          </div>
          <div className="px-6 py-5">
            <RequestContent req={req} />
          </div>
        </div>

        {/* Approval Timeline Card */}
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-black/10">
            <p className="text-[13px] font-semibold text-[#1c1c1a] uppercase tracking-wider">Onay Zinciri</p>
          </div>
          <div className="px-6 py-6">

            {/* Step 1: Created */}
            <TimelineStep done={true} active={false} last={!hasManagerAction && !hasProvisioning}>
              <p className="text-[13px] font-medium text-[#1c1c1a] mb-0.5">Talep oluşturuldu</p>
              <p className="text-[12px] text-[#5f5e5a]">
                {formatDate(req.createdAt)} · {req.requester} tarafından
              </p>
            </TimelineStep>

            {/* Step 2: Manager */}
            <TimelineStep
              done={hasManagerAction}
              active={!hasManagerAction && req.state === "pending_manager_approval"}
              last={!hasProvisioning}
            >
              {hasManagerAction ? (
                <>
                  <p className="text-[13px] font-medium text-[#1c1c1a] mb-0.5">
                    {isRejected ? "Yönetici tarafından reddedildi" : "Yönetici tarafından onaylandı"}
                  </p>
                  <p className="text-[12px] text-[#5f5e5a] mb-2">
                    {formatDate(req.managerApproval.at)} · {req.managerApproval.by}
                  </p>
                  {req.managerApproval.note && (
                    <div className="bg-[#f4f3ef] rounded-lg px-3.5 py-2.5">
                      <p className="text-[12px] text-[#5f5e5a] italic">{req.managerApproval.note}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[13px] font-medium text-[#1c1c1a] mb-0.5">Yönetici onayı bekleniyor</p>
                  <p className="text-[12px] text-[#5f5e5a]">{req.manager}</p>
                </>
              )}
            </TimelineStep>

            {/* Step 3: Provisioning */}
            {(hasProvisioning || req.state === "pending_provisioning") && (
              <TimelineStep done={hasProvisioning} active={req.state === "pending_provisioning"} last={true}>
                {hasProvisioning ? (
                  <>
                    <p className="text-[13px] font-medium text-[#1c1c1a] mb-0.5">Provisioning tamamlandı</p>
                    <p className="text-[12px] text-[#5f5e5a] mb-2">
                      {formatDate(req.provisioning.at)} · {req.provisioning.by}
                    </p>
                    {req.provisioning.internalNote && (
                      <div className="bg-[#f4f3ef] rounded-lg px-3.5 py-2.5 mb-2">
                        <p className="text-[12px] text-[#5f5e5a] italic">{req.provisioning.internalNote}</p>
                      </div>
                    )}
                    {req.provisioning.apiCalls?.length > 0 && (
                      <div className="bg-[#1c1c1a] rounded-lg px-3.5 py-2.5 font-mono text-[11px] leading-relaxed flex flex-col gap-0.5">
                        {req.provisioning.apiCalls.map((call, i) => {
                          if (typeof call === "string") {
                            return <span key={i} className="text-[#b5d4f4]">{call}</span>;
                          }
                          return (
                            <div key={i} className="flex gap-2 flex-wrap">
                              <span className={call.method === "DELETE" ? "text-[#f09595] font-medium" : "text-[#97c459] font-medium"}>
                                {call.method}
                              </span>
                              <span className="text-[#b5d4f4]">{call.path}</span>
                              {call.comment && <span className="text-[#888780]">{"# "}{call.comment}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[13px] font-medium text-[#1c1c1a] mb-0.5">Provisioning bekleniyor</p>
                    <p className="text-[12px] text-[#5f5e5a]">Hakan Kormanlı</p>
                  </>
                )}
              </TimelineStep>
            )}
          </div>
        </div>

        {/* Back */}
        <div>
          <Link
            href="/taleplerim"
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium border border-black/20 rounded-lg bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri dön
          </Link>
        </div>
      </div>
    </Layout>
  );
}
