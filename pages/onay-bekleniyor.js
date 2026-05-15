import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function OnayBekleniyor() {
  const [reqId, setReqId] = useState(null);

  useEffect(() => {
    setReqId(localStorage.getItem("lastRequestId") || "REQ-2026-????");
  }, []);

  return (
    <Layout>
      <Head><title>Talep Gönderildi · Definex</title></Head>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
          <div className="bg-[#eaf3de] px-6 py-8 text-center border-b border-[#639922]/30">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#27500a]/10 mb-4">
              <svg className="w-7 h-7 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[18px] font-semibold text-[#27500a] mb-1">
              Talebiniz oluşturuldu
            </h1>
            <p className="text-[13px] text-[#3a6b10]">
              Zeynep Şen&apos;e onay için iletildi
            </p>
          </div>

          <div className="px-6 py-6 text-center">
            <p className="text-[12px] text-[#888780] uppercase tracking-wider mb-1">Talep No</p>
            <p className="text-[22px] font-semibold text-[#1c1c1a] mb-6 font-mono">
              {reqId}
            </p>

            <div className="bg-[#f4f3ef] rounded-lg px-4 py-3 mb-6 text-left">
              <div className="flex items-start gap-2.5 text-[13px] text-[#5f5e5a]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#0c447c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  Zeynep Şen talebinizi inceleyecek. Onay veya red durumunda e-posta ile bilgilendirileceksiniz.
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-lg border border-black/20 bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
