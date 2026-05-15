import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function AdminProvisionTamam() {
  const [reqId, setReqId] = useState(null);

  useEffect(() => {
    setReqId(localStorage.getItem("lastProvisionReqId") || "—");
  }, []);

  return (
    <Layout>
      <Head><title>Provisioning Tamamlandı · Definex</title></Head>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
          <div className="bg-[#eaf3de] px-6 py-8 text-center border-b border-[#639922]/30">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#27500a]/10 mb-4">
              <svg className="w-7 h-7 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[18px] font-semibold text-[#27500a] mb-1">Provisioning tamamlandı</h1>
            <p className="text-[13px] text-[#3a6b10]">Burçak&apos;a bilgilendirme maili gönderildi</p>
          </div>

          <div className="px-6 py-6 text-center">
            {reqId && (
              <>
                <p className="text-[12px] text-[#888780] uppercase tracking-wider mb-1">Talep No</p>
                <p className="text-[20px] font-semibold text-[#1c1c1a] mb-6 font-mono">{reqId}</p>
              </>
            )}

            <div className="bg-[#f4f3ef] rounded-lg px-4 py-3 mb-6 text-left">
              <div className="flex items-start gap-2.5 text-[13px] text-[#5f5e5a]">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Anthropic Admin API çağrıları başarıyla tamamlandı. Kullanıcı artık Claude Enterprise&apos;e erişebilir.
                </span>
              </div>
            </div>

            <Link
              href="/admin-queue"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium rounded-lg border border-black/20 bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kuyruğa dön
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
