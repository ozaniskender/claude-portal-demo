import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function Home() {
  const [openCount, setOpenCount] = useState(null);

  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem("requests") || "[]");
    const open = reqs.filter(
      (r) =>
        r.requester === "Burçak Göksel" &&
        (r.state === "pending_manager_approval" || r.state === "pending_provisioning")
    ).length;
    setOpenCount(open);
  }, []);

  return (
    <Layout>
      <Head><title>Definex · Claude Lisans Yönetimi</title></Head>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <svg className="w-8 h-8 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29
                 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-3">
          Claude Lisans Yönetim Portalı
        </h1>
        <p className="text-[#5f5e5a] max-w-md mb-2 text-sm leading-relaxed">
          Definex çalışanları için Claude Enterprise lisans taleplerini, spend
          kademesi değişikliklerini ve custom role değişikliklerini buradan yönetebilirsiniz.
        </p>

        {openCount !== null && openCount > 0 && (
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e6f1fb] text-[#0c447c] text-[13px] font-medium">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0c447c] text-white text-[11px] font-semibold">
              {openCount}
            </span>
            açık talep bekliyor
          </div>
        )}
        {openCount === 0 && <div className="mb-6" />}

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/talep"
            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3
                       rounded-lg font-medium hover:bg-[#16304f] transition-colors shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Talep Oluştur
          </Link>

          <Link
            href="/taleplerim"
            className="inline-flex items-center gap-2 bg-white text-[#1c1c1a] px-6 py-3
                       rounded-lg font-medium border border-black/20 hover:bg-gray-50 transition-colors shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Taleplerim
          </Link>
        </div>

        <Link
          href="/demo-reset"
          className="mt-8 text-[12px] text-[#888780] hover:text-[#5f5e5a] transition-colors underline underline-offset-2"
        >
          Demo Sıfırla
        </Link>
      </div>
    </Layout>
  );
}
