import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  spendTrendData, kademeData, accountBreakdownData,
  heatmapData, roleData, activityFeedData, queueData,
  talepTrendData, kpiData,
} from "@/data/dashboardMock";

// SSR-safe Recharts imports
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart        = dynamic(() => import("recharts").then(m => m.AreaChart),        { ssr: false });
const Area             = dynamic(() => import("recharts").then(m => m.Area),             { ssr: false });
const BarChart         = dynamic(() => import("recharts").then(m => m.BarChart),         { ssr: false });
const Bar              = dynamic(() => import("recharts").then(m => m.Bar),              { ssr: false });
const PieChart         = dynamic(() => import("recharts").then(m => m.PieChart),         { ssr: false });
const Pie              = dynamic(() => import("recharts").then(m => m.Pie),              { ssr: false });
const Cell             = dynamic(() => import("recharts").then(m => m.Cell),             { ssr: false });
const XAxis            = dynamic(() => import("recharts").then(m => m.XAxis),            { ssr: false });
const YAxis            = dynamic(() => import("recharts").then(m => m.YAxis),            { ssr: false });
const CartesianGrid    = dynamic(() => import("recharts").then(m => m.CartesianGrid),    { ssr: false });
const Tooltip          = dynamic(() => import("recharts").then(m => m.Tooltip),          { ssr: false });
const Legend           = dynamic(() => import("recharts").then(m => m.Legend),           { ssr: false });

/* ── Shared primitives ── */

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5f5e5a] shrink-0">{title}</p>
      <div className="flex-1 h-px bg-black/10" />
    </div>
  );
}

const DELTA_CLS = { up: "text-[#854f0b]", down: "text-[#27500a]", neutral: "text-[#888780]" };

function KpiCard({ label, value, suffix, delta, deltaType, variant }) {
  let borderCls = "";
  let bgCls = "bg-white";
  if (variant === "attention") { borderCls = "border-l-[3px] border-l-[#ba7517]"; bgCls = "bg-gradient-to-r from-[#fffaf2] to-white"; }
  if (variant === "positive")  { borderCls = "border-l-[3px] border-l-[#639922]"; }

  return (
    <div className={`${bgCls} ${borderCls} border border-black/10 rounded-lg p-4`}>
      <p className="text-[10px] uppercase tracking-[0.06em] text-[#888780] mb-2">{label}</p>
      <p className="text-[28px] font-medium text-[#1c1c1a] leading-none mb-1.5 flex items-baseline gap-1.5">
        {value}
        {suffix && <span className="text-[14px] font-normal text-[#5f5e5a]">{suffix}</span>}
      </p>
      {delta && <p className={`text-[12px] ${DELTA_CLS[deltaType] || "text-[#888780]"}`}>{delta}</p>}
    </div>
  );
}

function KpiGrid({ items }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {items.map((k, i) => <KpiCard key={i} {...k} />)}
    </div>
  );
}

function ChartCard({ title, subtitle, meta, topRight, children, className = "" }) {
  return (
    <div className={`bg-white border border-black/10 rounded-lg p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[14px] font-medium text-[#1c1c1a] mb-0.5">{title}</p>
          {subtitle && <p className="text-[12px] text-[#5f5e5a]">{subtitle}</p>}
        </div>
        {(meta || topRight) && (
          <div className="text-[12px] text-[#888780]">{meta}{topRight}</div>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Queue card ── */
const BADGE = {
  warning: "bg-[#faeeda] text-[#854f0b]",
  info:    "bg-[#e6f1fb] text-[#0c447c]",
};

function QueueCard() {
  return (
    <ChartCard
      title="Provisioning Queue · Öncelikli"
      subtitle="Aksiyon gerektiren bekleyen talepler"
      topRight={
        <Link href="/admin-queue" className="text-[12px] font-medium text-[#0c447c] hover:underline">
          Tümünü gör →
        </Link>
      }
    >
      <div className="flex flex-col gap-2.5">
        {queueData.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-[13px] border-l-[3px] ${
              item.urgent
                ? "border-l-[#ba7517] bg-gradient-to-r from-[#fffaf2] to-[#f4f3ef]"
                : "border-l-[#5a8fc2] bg-[#f4f3ef]"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[11px] text-[#888780]">{item.id}</span>
                <span className="font-medium text-[#1c1c1a]">{item.name}</span>
              </div>
              <p className="text-[12px] text-[#5f5e5a]">{item.type}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg ${BADGE[item.badgeType]}`}>
                {item.badge}
              </span>
              <p className="text-[11px] text-[#888780] mt-1">Onaylayan: {item.approver}</p>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ── Activity feed ── */
const DOT_COLOR = { success: "#639922", info: "#5a8fc2", warning: "#ba7517", danger: "#c14545" };

function ActivityFeed() {
  return (
    <ChartCard title="Son Aktiviteler" subtitle="Audit feed">
      <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 280 }}>
        {activityFeedData.map((item, i) => (
          <div
            key={i}
            className={`flex gap-2.5 py-2.5 text-[13px] ${i < activityFeedData.length - 1 ? "border-b border-black/[0.07]" : ""}`}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0 mt-[5px]"
              style={{ backgroundColor: DOT_COLOR[item.type] }}
            />
            <div>
              <p className="text-[#1c1c1a] leading-snug mb-0.5"
                 dangerouslySetInnerHTML={{ __html: item.text.replace(/^([^<]+?)(\s)/, '<strong>$1</strong>$2') }}
              />
              <p className="text-[11px] text-[#888780]">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ── Spend Trend Chart ── */
function SpendTrendChart() {
  return (
    <ChartCard title="Aylık Spend Trendi" subtitle="Son 6 ay · Bütçe karşılaştırması" meta="USD">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={spendTrendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebeae5" vertical={false} />
          <XAxis dataKey="month" stroke="#888780" fontSize={12} />
          <YAxis stroke="#888780" fontSize={12} tickFormatter={(v) => "$" + v / 1000 + "k"} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }}
            formatter={(v) => ["$" + v.toLocaleString()]}
          />
          <Area type="monotone" dataKey="budget" stroke="#d4a259" strokeDasharray="4 4" fill="transparent" name="Bütçe" strokeWidth={1.5} />
          <Area type="monotone" dataKey="spend"  stroke="#5a8fc2" fill="#e6f1fb" strokeWidth={2} name="Spend" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Donut Chart ── */
function KademeDonut() {
  return (
    <ChartCard title="Spend Kademesi Dağılımı" subtitle="94 aktif kullanıcı">
      <div className="flex items-center">
        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={kademeData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                {kademeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[26px] font-medium text-[#1c1c1a] leading-none">94</p>
            <p className="text-[10px] text-[#888780] uppercase tracking-[0.05em] mt-1">Lisans</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pl-4">
          {kademeData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-[13px] text-[#1c1c1a] leading-none">{item.name}</p>
                <p className="text-[12px] text-[#5f5e5a]">{item.value} kullanıcı</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Account breakdown table ── */
function ProgressBar({ pct }) {
  const color = pct >= 85 ? "#c14545" : pct >= 70 ? "#ba7517" : "#5a8fc2";
  return (
    <div className="inline-flex items-center gap-2 ml-2">
      <div className="w-20 h-1.5 bg-[#ebeae5] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function AccountTable() {
  return (
    <div className="bg-white border border-black/10 rounded-lg overflow-hidden mt-4">
      <div className="flex items-start justify-between px-5 py-4 border-b border-black/10">
        <div>
          <p className="text-[14px] font-medium text-[#1c1c1a] mb-0.5">Account / Capability Bazlı Maliyet Dağılımı</p>
          <p className="text-[12px] text-[#5f5e5a]">Bu ay (Mayıs 2026) · Bütçe kullanımı</p>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Account / Capability", "Aktif Lisans", "Bu Ay Spend", "Bütçe", "Kullanım"].map((h) => (
              <th key={h} className="text-left text-[11px] uppercase tracking-[0.05em] text-[#888780] font-medium px-5 py-2.5 border-b border-black/10 first:pl-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accountBreakdownData.map((row, i) => (
            <tr key={row.account} className={i < accountBreakdownData.length - 1 ? "border-b border-black/[0.07]" : ""}>
              <td className="px-5 py-2.5 text-[13px] font-medium text-[#1c1c1a]">{row.account}</td>
              <td className="px-5 py-2.5 text-[13px] text-[#5f5e5a]">{row.licenses}</td>
              <td className="px-5 py-2.5 text-[13px] text-[#1c1c1a]">${row.spend.toLocaleString()}</td>
              <td className="px-5 py-2.5 text-[13px] text-[#5f5e5a]">${row.budget.toLocaleString()}</td>
              <td className="px-5 py-2.5 text-[13px] text-[#1c1c1a]">
                {row.pct}%
                <ProgressBar pct={row.pct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Heatmap ── */
const HEAT_COLORS = ["#f4f3ef", "#dce7f0", "#a8c4dc", "#5a8fc2", "#2a5a8a"];
const MAX_VAL = 58;

function heatColor(v) {
  const r = v / MAX_VAL;
  if (r < 0.15) return HEAT_COLORS[0];
  if (r < 0.30) return HEAT_COLORS[1];
  if (r < 0.50) return HEAT_COLORS[2];
  if (r < 0.75) return HEAT_COLORS[3];
  return HEAT_COLORS[4];
}

function UsageHeatmap() {
  const { days, hours, values } = heatmapData;
  return (
    <ChartCard title="Kullanım Yoğunluğu Heatmap" subtitle="Saat ve gün bazlı aktif kullanıcı">
      <div style={{ display: "grid", gridTemplateColumns: `36px repeat(${hours.length}, 1fr)`, gap: 4 }}>
        <div />
        {hours.map((h) => (
          <div key={h} className="text-[10px] text-[#888780] text-center">{h}:00</div>
        ))}
        {days.map((day, di) => (
          <>
            <div key={`d-${di}`} className="text-[11px] text-[#888780] flex items-center">{day}</div>
            {values[di].map((v, hi) => (
              <div
                key={`${di}-${hi}`}
                title={`${day} ${hours[hi]}:00 — ${v} kullanıcı`}
                className="flex items-center justify-center rounded-[3px] text-[10px]"
                style={{
                  height: 22,
                  backgroundColor: heatColor(v),
                  color: v > 30 ? "#fff" : "#5f5e5a",
                }}
              >
                {v}
              </div>
            ))}
          </>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[11px] text-[#888780]">
        <span>Az</span>
        {HEAT_COLORS.map((c) => (
          <div key={c} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>Çok</span>
      </div>
    </ChartCard>
  );
}

/* ── Role Bar Chart ── */
function RoleChart() {
  return (
    <ChartCard title="Custom Role Dağılımı" subtitle="Aktif lisanslar">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={roleData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebeae5" horizontal={false} />
          <XAxis type="number" stroke="#888780" fontSize={12} />
          <YAxis dataKey="role" type="category" stroke="#888780" fontSize={11} width={140} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }} />
          <Bar dataKey="count" fill="#5a8fc2" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Talep Trend ── */
function TalepTrendChart() {
  return (
    <ChartCard title="Talep Tipleri Trendi" subtitle="Son 6 ay · Aylık talep sayısı">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={talepTrendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebeae5" vertical={false} />
          <XAxis dataKey="month" stroke="#888780" fontSize={12} />
          <YAxis stroke="#888780" fontSize={12} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="yeni"  stackId="a" fill="#5a8fc2" name="Yeni Lisans" />
          <Bar dataKey="spend" stackId="a" fill="#d4a259" name="Spend Yükseltme" />
          <Bar dataKey="role"  stackId="a" fill="#a8c489" name="Role Değişikliği" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Upgrade signal card ── */
function UpgradeSignalCard() {
  return (
    <ChartCard title="Kademe Yükseltme Sinyali" subtitle="Son 30 günün davranışı">
      <div className="pt-1">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-[32px] font-medium text-[#1c1c1a]">+11</span>
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#faeeda] text-[#854f0b]">↑ 2x</span>
        </div>
        <p className="text-[13px] text-[#5f5e5a] mb-4 leading-relaxed">
          Bu ay 11 kullanıcı bir üst Spend Kademesi'ne yükseltildi. Geçen ay sadece 5'ti.
        </p>
        <div className="bg-[#e6f1fb] rounded-lg px-4 py-3">
          <p className="text-[12px] text-[#0c447c] leading-relaxed">
            <strong>İçgörü:</strong> Medium → High geçişleri AI & Analytics ve Tech Consulting'de yoğunlaşıyor. Bu departmanların Q3 bütçe revizyonu önerilir.
          </p>
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Date range selector ── */
const DATE_RANGES = ["7G", "30G", "90G", "Yıl"];

function DateRangeSelector({ active, onChange }) {
  return (
    <div className="flex gap-1 bg-[#f4f3ef] p-1 rounded-lg">
      {DATE_RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-[12px] rounded-md transition-colors ${
            active === r
              ? "bg-white text-[#1c1c1a] font-medium shadow-sm"
              : "text-[#5f5e5a] hover:text-[#1c1c1a]"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

/* ── Main ── */
export default function Dashboard() {
  const [persona, setPersona] = useState(null);
  const [dateRange, setDateRange] = useState("30G");
  const router = useRouter();

  useEffect(() => {
    setPersona(localStorage.getItem("currentPersona") || "Burçak");
  }, []);

  if (persona === null) return null;

  if (persona !== "Hakan") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
          <p className="text-[#5f5e5a] text-sm">Bu sayfa sadece License Admin tarafından görüntülenebilir.</p>
          <Link
            href="/"
            className="px-4 py-2 text-[13px] font-medium border border-black/20 rounded-lg bg-white text-[#1c1c1a] hover:bg-gray-50 transition-colors"
          >
            Ana sayfaya dön
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>Dashboard · Definex</title></Head>
      {/* Desktop-only guard */}
      <div className="lg:hidden flex items-center justify-center min-h-[40vh]">
        <p className="text-[#5f5e5a] text-sm text-center px-4">Bu sayfa desktop ekranlar için optimize edilmiştir.</p>
      </div>

      <div className="hidden lg:block max-w-[1200px] mx-auto">

        {/* Page Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="text-[24px] font-medium text-[#1c1c1a] mb-1">Dashboard</h1>
            <p className="text-[13px] text-[#5f5e5a]">Operasyonel durum, kullanım metrikleri ve maliyet özeti</p>
          </div>
          <DateRangeSelector active={dateRange} onChange={setDateRange} />
        </div>

        {/* Attention Alert */}
        <div className="flex items-center gap-3 bg-[#faeeda] border-l-[3px] border-[#ba7517] rounded-lg px-4 py-3 mb-6 text-[13px] text-[#854f0b]">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            <strong>3 talep</strong> 24 saatten uzun süredir provisioning kuyruğunda bekliyor.{" "}
            AI &amp; Analytics departmanının aylık spend&apos;i bütçenin %92&apos;sine ulaştı.
          </span>
        </div>

        {/* BÖLÜM 1: OPS */}
        <div className="mb-8">
          <SectionHeader title="Operasyonel Durum" />
          <KpiGrid items={kpiData.ops} />
          <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <QueueCard />
            <ActivityFeed />
          </div>
        </div>

        {/* BÖLÜM 2: MALIYET */}
        <div className="mb-8">
          <SectionHeader title="Maliyet ve Bütçe" />
          <KpiGrid items={kpiData.cost} />
          <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <SpendTrendChart />
            <KademeDonut />
          </div>
          <AccountTable />
        </div>

        {/* BÖLÜM 3: ADOPTION */}
        <div className="mb-8">
          <SectionHeader title="Adoption ve Developer Productivity" />
          <div className="grid grid-cols-2 gap-5 mb-6">
            <UsageHeatmap />
            <RoleChart />
          </div>
          <KpiGrid items={kpiData.adoption} />
        </div>

        {/* BÖLÜM 4: TALEP SÜRECI */}
        <div className="mb-8">
          <SectionHeader title="Talep Süreci Görünürlüğü" />
          <div className="grid gap-5" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <TalepTrendChart />
            <UpgradeSignalCard />
          </div>
        </div>

      </div>
    </Layout>
  );
}
