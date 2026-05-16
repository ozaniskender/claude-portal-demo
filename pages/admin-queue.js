import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

const TYPE_LABELS = {
  new_license: "Yeni Lisans Talebi",
  spend_upgrade: "Spend Kademesi Değişikliği",
  role_change: "Custom Role Değişikliği",
};

export default function AdminQueue() {
  const [persona, setPersona] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
    if (p === "Hakan") {
      const all = JSON.parse(localStorage.getItem("requests") || "[]");
      setRequests(all.filter((r) => r.state === "pending_provisioning"));
    }
  }, []);

  if (persona === null) return null;

  if (persona !== "Hakan") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Bu sayfayı sadece License Admin görebilir.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>Provisioning Queue · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-bordered flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-1 h-5 rounded-full bg-brand-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-[17px] text-content-primary mb-0.5">Provisioning Kuyruğu</p>
                <p className="text-[13px] text-content-secondary">Manager onayı tamamlanmış, provisioning bekleyen talepler.</p>
              </div>
            </div>
            {requests.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EAF3DE] text-state-success border border-[#C6E09A] text-[12px] font-semibold">
                {requests.length}
              </span>
            )}
          </div>

          <div className="divide-y divide-surface-bordered">
            {requests.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <svg className="w-8 h-8 text-surface-bordered mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-content-secondary text-[13px]">Bekleyen provisioning talebi yok.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-muted transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[12px] text-state-success font-medium">{req.id}</span>
                      <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-brand-light-blue text-[#09206E] border border-brand-primary/30">
                        Provisioning bekliyor
                      </span>
                      <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-surface-subtle text-content-secondary border border-surface-bordered">
                        {TYPE_LABELS[req.type] || req.type}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-content-primary mb-0.5">{req.requester}</p>
                    <p className="text-[12px] text-content-secondary">
                      Manager onayı: {req.managerApproval?.by || "—"}
                      {req.managerApproval?.at && (
                        <> · {new Date(req.managerApproval.at).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/admin-provision/${req.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-[#C6E09A] rounded-lg bg-[#EAF3DE] text-state-success hover:bg-[#D7EDBB] transition-colors"
                  >
                    Provision
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
