import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function ManagerOnayTamam() {
  const [action, setAction] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("lastManagerAction");
    if (raw) setAction(JSON.parse(raw));
  }, []);

  const approved = action?.result === "approved";

  return (
    <Layout>
      <Head><title>Onay Tamamlandı · Definex</title></Head>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className={`px-6 py-8 text-center border-b ${approved ? "bg-[#EAF3DE] border-[#C6E09A]" : "bg-[#FCEBEB] border-[#F0AEAE]"}`}>
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${approved ? "bg-state-success/10" : "bg-state-danger/10"}`}>
              {approved ? (
                <svg className="w-7 h-7 text-state-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-state-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h1 className={`text-[18px] font-semibold mb-1 ${approved ? "text-state-success" : "text-state-danger"}`}>
              {approved ? "Talep onaylandı" : "Talep reddedildi"}
            </h1>
            <p className={`text-[13px] ${approved ? "text-[#4a6824]" : "text-state-danger/80"}`}>
              {approved
                ? "Hakan Kormanlı'ya provisioning için iletildi"
                : "Talep sahibi bilgilendirilecektir"}
            </p>
          </div>

          <div className="px-6 py-6 text-center">
            {action?.reqId && (
              <>
                <p className="text-[12px] text-content-tertiary uppercase tracking-wider mb-1 font-semibold">Talep No</p>
                <p className="text-[20px] font-semibold text-content-primary mb-1 font-mono">{action.reqId}</p>
                {action.requester && (
                  <p className="text-[13px] text-content-secondary mb-6">{action.requester}</p>
                )}
              </>
            )}

            <Link
              href="/manager-inbox"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-lg border border-surface-bordered bg-surface text-content-primary hover:bg-surface-muted transition-colors shadow-card"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Inbox&apos;a dön
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
