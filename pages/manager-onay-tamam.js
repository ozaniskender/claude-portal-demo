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
        <div className="max-w-md w-full bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
          <div className={`px-6 py-8 text-center border-b ${approved ? "bg-[#eaf3de] border-[#639922]/30" : "bg-[#fcebeb] border-[#791f1f]/20"}`}>
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${approved ? "bg-[#27500a]/10" : "bg-[#791f1f]/10"}`}>
              {approved ? (
                <svg className="w-7 h-7 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-[#791f1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h1 className={`text-[18px] font-semibold mb-1 ${approved ? "text-[#27500a]" : "text-[#791f1f]"}`}>
              {approved ? "Talep onaylandı" : "Talep reddedildi"}
            </h1>
            <p className={`text-[13px] ${approved ? "text-[#3a6b10]" : "text-[#791f1f]/80"}`}>
              {approved
                ? "Hakan Kormanlı'ya provisioning için iletildi"
                : "Talep sahibi bilgilendirilecektir"}
            </p>
          </div>

          <div className="px-6 py-6 text-center">
            {action?.reqId && (
              <>
                <p className="text-[12px] text-[#888780] uppercase tracking-wider mb-1">Talep No</p>
                <p className="text-[20px] font-semibold text-[#1c1c1a] mb-1 font-mono">{action.reqId}</p>
                {action.requester && (
                  <p className="text-[13px] text-[#5f5e5a] mb-6">{action.requester}</p>
                )}
              </>
            )}

            <Link
              href="/manager-inbox"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-lg border border-black/20 bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors"
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
