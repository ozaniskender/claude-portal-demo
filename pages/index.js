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

      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-brand-navy text-white mb-8">
        {/* Checkered grid pattern on right */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: `
              linear-gradient(to right, #0F1737 0%, transparent 30%),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)
            `,
          }}
        />

        <div className="relative px-10 py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-[#8FAEED] text-[12px] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FAEED]" />
            Claude Enterprise
          </div>

          <h1 className="text-[32px] font-bold leading-tight mb-3 text-white">
            Lisans Yönetim Portalı
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed mb-7">
            Definex çalışanları için Claude Enterprise lisans taleplerini,
            spend kademesi değişikliklerini ve custom role değişikliklerini
            buradan yönetin.
          </p>

          {openCount !== null && openCount > 0 && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-[#8FAEED] text-[13px] font-medium">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-semibold">
                {openCount}
              </span>
              açık talep bekliyor
            </div>
          )}
          {openCount === 0 && <div className="mb-6" />}

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/talep"
              className="inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5
                         rounded-lg font-medium hover:bg-[#1a3bbf] transition-colors shadow-elevated text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Talep Oluştur
            </Link>

            <Link
              href="/taleplerim"
              className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2.5
                         rounded-lg font-medium border border-white/20 hover:bg-white/15 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Taleplerim
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/talep", label: "Yeni Lisans Talebi", desc: "Claude Enterprise erişimi için başvurun", icon: "M12 4v16m8-8H4" },
          { href: "/talep-spend", label: "Spend Kademesi", desc: "Mevcut kademeni yükselt veya değiştir", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
          { href: "/talep-role", label: "Custom Role", desc: "Tool yetkisi ve rol güncellemesi talep et", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-surface rounded-card border border-surface-bordered shadow-card hover:shadow-card-hover transition-all p-5"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-light-blue flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-content-primary mb-1 group-hover:text-brand-primary transition-colors">{item.label}</p>
            <p className="text-[12px] text-content-tertiary leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/demo-reset"
          className="text-[12px] text-content-tertiary hover:text-content-secondary transition-colors underline underline-offset-2"
        >
          Demo Sıfırla
        </Link>
      </div>
    </Layout>
  );
}
