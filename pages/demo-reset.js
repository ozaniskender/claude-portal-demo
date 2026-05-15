import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/components/Layout";
import { resetSeedData } from "@/utils/seedData";

export default function DemoReset() {
  const [done, setDone] = useState(false);
  const router = useRouter();

  function handleReset() {
    resetSeedData();
    setDone(true);
    setTimeout(() => router.push("/"), 3000);
  }

  return (
    <Layout>
      <Head><title>Demo Reset · Definex</title></Head>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-sm w-full bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden text-center">
          {done ? (
            <div className="px-8 py-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#eaf3de] mb-4">
                <svg className="w-7 h-7 text-[#27500a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-[#1c1c1a] mb-2">Demo verisi sıfırlandı</p>
              <p className="text-[13px] text-[#5f5e5a]">Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
          ) : (
            <div className="px-8 py-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f4f3ef] mb-4">
                <svg className="w-7 h-7 text-[#5f5e5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-[#1c1c1a] mb-1">Demo Sıfırla</p>
              <p className="text-[13px] text-[#5f5e5a] mb-6">
                Tüm talep verisi silinir ve başlangıç seed data yeniden yüklenir. Persona Burçak&apos;a sıfırlanır.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-2.5 text-[13px] font-medium rounded-lg bg-[#1e3a5f] text-white hover:bg-[#16304f] transition-colors"
              >
                Sıfırla
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
