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
          <p className="text-[#5f5e5a] text-sm">Bu sayfayı sadece License Admin görebilir.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>Provisioning Queue · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
            <div>
              <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Provisioning Kuyruğu</p>
              <p className="text-[13px] text-[#5f5e5a]">Manager onayı tamamlanmış, provisioning bekleyen talepler.</p>
            </div>
            {requests.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#eaf3de] text-[#27500a] text-[12px] font-semibold">
                {requests.length}
              </span>
            )}
          </div>

          <div className="divide-y divide-black/10">
            {requests.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <svg className="w-8 h-8 text-[#c8c7c0] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#5f5e5a] text-[13px]">Bekleyen provisioning talebi yok.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#faf9f7] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[12px] text-[#27500a] font-medium">{req.id}</span>
                      <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#eaf3de] text-[#27500a]">
                        Provisioning bekliyor
                      </span>
                      <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#f4f3ef] text-[#5f5e5a]">
                        {TYPE_LABELS[req.type] || req.type}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-[#1c1c1a] mb-0.5">{req.requester}</p>
                    <p className="text-[12px] text-[#5f5e5a]">
                      Manager onayı: {req.managerApproval?.by || "—"}
                      {req.managerApproval?.at && (
                        <> · {new Date(req.managerApproval.at).toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}</>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/admin-provision/${req.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border border-[#639922]/50 rounded-lg bg-[#eaf3de] text-[#27500a] hover:bg-[#dff0cc] transition-colors"
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
