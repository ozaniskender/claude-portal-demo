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
  pending_manager_approval: { label: "Yönetici onayı bekleniyor", classes: "bg-[#faeeda] text-[#854f0b] border border-[#d4a87a]" },
  pending_provisioning:     { label: "Provisioning bekleniyor",   classes: "bg-brand-light-blue text-[#09206E] border border-brand-primary/30" },
  completed:                { label: "Tamamlandı",                classes: "bg-[#eaf3de] text-[#27500a] border border-[#8bbf5c]" },
  rejected_by_manager:      { label: "Reddedildi",               classes: "bg-[#fcebeb] text-[#791f1f] border border-[#f0aeae]" },
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] text-content-tertiary uppercase tracking-wider mb-0.5 font-semibold">{label}</p>
      <p className="text-[14px] text-content-primary">{value}</p>
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
        <InfoRow label="Level of Practise" value={data.level} />
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

function TimelineStep({ done, active, rejected, last, children }) {
  const circleClass = done
    ? "bg-state-success border-2 border-state-success"
    : rejected
    ? "bg-state-danger border-2 border-state-danger"
    : active
    ? "bg-brand-primary border-2 border-brand-primary"
    : "bg-surface-muted border-2 border-surface-bordered";

  const lineClass = done ? "bg-state-success/30" : "bg-surface-bordered";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${circleClass}`}>
          {(done || rejected) ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {rejected
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              }
            </svg>
          ) : (
            <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-white" : "bg-surface-subtle"}`} />
          )}
        </div>
        {!last && (
          <div className={`w-0.5 flex-1 mt-1 ${lineClass}`} style={{ minHeight: "24px" }} />
        )}
      </div>
      <div className="pb-6 min-w-0 flex-1">{children}</div>
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
          <p className="text-content-secondary text-sm">Talep bulunamadı.</p>
        </div>
      </Layout>
    );
  }

  const badge = STATE_BADGE[req.state] || { label: req.state, classes: "bg-surface-subtle text-content-secondary border border-surface-bordered" };
  const isCompleted = req.state === "completed";
  const isRejected = req.state === "rejected_by_manager";
  const hasManagerAction = !!req.managerApproval;
  const hasProvisioning = !!req.provisioning;

  return (
    <Layout>
      <Head><title>Talep #{req.id} · Definex</title></Head>
      <div className="max-w-[820px] mx-auto space-y-4">

        {/* Summary Card */}
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card">
          <div className="px-6 py-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-[12px] text-content-tertiary font-medium">{req.id}</span>
                <span className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg ${badge.classes}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[17px] font-semibold text-content-primary mb-0.5">
                {TYPE_LABELS[req.type] || req.type}
              </p>
              <p className="text-[13px] text-content-secondary">
                {req.requester} · {formatDate(req.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Request Content Card */}
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card">
          <div className="px-6 py-4 border-b border-surface-bordered">
            <p className="text-[12px] font-semibold text-content-primary uppercase tracking-wider">Talep İçeriği</p>
          </div>
          <div className="px-6 py-5">
            <RequestContent req={req} />
          </div>
        </div>

        {/* Approval Timeline Card */}
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card">
          <div className="px-6 py-4 border-b border-surface-bordered flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-brand-primary" />
            <p className="text-[12px] font-semibold text-content-primary uppercase tracking-wider">Onay Zinciri</p>
          </div>
          <div className="px-6 py-6">

            {/* Step 1: Created */}
            <TimelineStep done={true} active={false} rejected={false} last={!hasManagerAction && !hasProvisioning}>
              <div className="bg-surface-muted rounded-xl border border-surface-bordered px-4 py-3">
                <p className="text-[13px] font-semibold text-content-primary mb-0.5">Talep oluşturuldu</p>
                <p className="text-[12px] text-content-secondary">
                  {formatDate(req.createdAt)} · {req.requester}
                </p>
              </div>
            </TimelineStep>

            {/* Step 2: Manager */}
            <TimelineStep
              done={hasManagerAction && !isRejected}
              active={!hasManagerAction && req.state === "pending_manager_approval"}
              rejected={isRejected}
              last={!hasProvisioning}
            >
              <div className={`rounded-xl border px-4 py-3 ${
                hasManagerAction
                  ? isRejected
                    ? "bg-[#FCEBEB] border-[#F0AEAE]"
                    : "bg-[#EAF3DE] border-[#C6E09A]"
                  : "bg-surface-muted border-surface-bordered"
              }`}>
                {hasManagerAction ? (
                  <>
                    <p className="text-[13px] font-semibold text-content-primary mb-0.5">
                      {isRejected ? "Yönetici tarafından reddedildi" : "Yönetici tarafından onaylandı"}
                    </p>
                    <p className="text-[12px] text-content-secondary mb-2">
                      {formatDate(req.managerApproval.at)} · {req.managerApproval.by}
                    </p>
                    {req.managerApproval.note && (
                      <p className="text-[12px] text-content-secondary italic">{req.managerApproval.note}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[13px] font-semibold text-content-primary mb-0.5">Yönetici onayı bekleniyor</p>
                    <p className="text-[12px] text-content-secondary">{req.manager}</p>
                  </>
                )}
              </div>
            </TimelineStep>

            {/* Step 3: Provisioning */}
            {(hasProvisioning || req.state === "pending_provisioning") && (
              <TimelineStep done={hasProvisioning} active={req.state === "pending_provisioning"} rejected={false} last={true}>
                <div className={`rounded-xl border px-4 py-3 ${
                  hasProvisioning
                    ? "bg-[#EAF3DE] border-[#C6E09A]"
                    : "bg-surface-muted border-surface-bordered"
                }`}>
                  {hasProvisioning ? (
                    <>
                      <p className="text-[13px] font-semibold text-content-primary mb-0.5">Provisioning tamamlandı</p>
                      <p className="text-[12px] text-content-secondary mb-2">
                        {formatDate(req.provisioning.at)} · {req.provisioning.by}
                      </p>
                      {req.provisioning.internalNote && (
                        <p className="text-[12px] text-content-secondary italic">{req.provisioning.internalNote}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] font-semibold text-content-primary mb-0.5">Provisioning bekleniyor</p>
                      <p className="text-[12px] text-content-secondary">Hakan Kormanlı</p>
                    </>
                  )}
                </div>
              </TimelineStep>
            )}
          </div>
        </div>

        {/* Back */}
        <div>
          <Link
            href="/taleplerim"
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium border border-surface-bordered rounded-lg bg-surface text-content-primary hover:bg-surface-muted transition-colors shadow-card"
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
