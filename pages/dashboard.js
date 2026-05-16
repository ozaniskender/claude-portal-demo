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
      <div className="w-1 h-4 rounded-full bg-brand-primary shrink-0" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-content-tertiary shrink-0">{title}</p>
      <div className="flex-1 h-px bg-surface-bordered" />
    </div>
  );
}

const DELTA_CLS = { up: "text-accent-dark", down: "text-state-success", neutral: "text-content-tertiary" };

function KpiCard({ label, value, suffix, delta, deltaType, variant }) {
  let borderCls = "";
  let bgCls = "bg-surface";
  if (variant === "attention") { borderCls = "border-l-[3px] border-l-accent"; bgCls = "bg-gradient-to-r from-[#FFF3E0] to-surface"; }
  if (variant === "positive")  { borderCls = "border-l-[3px] border-l-state-success"; }

  return (
    <div className={`${bgCls} ${borderCls} border border-surface-bordered rounded-card p-4 shadow-card`}>
      <p className="text-[10px] uppercase tracking-[0.06em] text-content-tertiary mb-2 font-semibold">{label}</p>
      <p className="text-[28px] font-semibold text-content-primary leading-none mb-1.5 flex items-baseline gap-1.5">
        {value}
        {suffix && <span className="text-[14px] font-normal text-content-secondary">{suffix}</span>}
      </p>
      {delta && <p className={`text-[12px] ${DELTA_CLS[deltaType] || "text-content-tertiary"}`}>{delta}</p>}
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
    <div className={`bg-surface border border-surface-bordered rounded-card p-5 shadow-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[14px] font-semibold text-content-primary mb-0.5">{title}</p>
          {subtitle && <p className="text-[12px] text-content-secondary">{subtitle}</p>}
        </div>
        {(meta || topRight) && (
          <div className="text-[12px] text-content-tertiary">{meta}{topRight}</div>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Queue card ── */
const BADGE = {
  warning: "bg-[#faeeda] text-[#854f0b] border border-[#d4a87a]",
  info:    "bg-brand-light-blue text-[#09206E] border border-brand-primary/30",
};

function QueueCard() {
  return (
    <ChartCard
      title="Provisioning Queue · Öncelikli"
      subtitle="Aksiyon gerektiren bekleyen talepler"
      topRight={
        <Link href="/admin-queue" className="text-[12px] font-medium text-brand-primary hover:underline">
          Tümünü gör →
        </Link>
      }
    >
      <div className="flex flex-col gap-2.5">
        {queueData.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] border-l-[3px] ${
              item.urgent
                ? "border-l-accent bg-gradient-to-r from-[#FFF3E0] to-surface-muted"
                : "border-l-brand-primary bg-surface-muted"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[11px] text-content-tertiary">{item.id}</span>
                <span className="font-semibold text-content-primary">{item.name}</span>
              </div>
              <p className="text-[12px] text-content-secondary">{item.type}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg ${BADGE[item.badgeType]}`}>
                {item.badge}
              </span>
              <p className="text-[11px] text-content-tertiary mt-1">Onaylayan: {item.approver}</p>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

/* ── Activity feed ── */
const DOT_COLOR = { success: "#5C7F2E", info: "#2249D6", warning: "#C66130", danger: "#A02E1F" };

function ActivityFeed() {
  return (
    <ChartCard title="Son Aktiviteler" subtitle="Audit feed">
      <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 280 }}>
        {activityFeedData.map((item, i) => (
          <div
            key={i}
            className={`flex gap-2.5 py-2.5 text-[13px] ${i < activityFeedData.length - 1 ? "border-b border-surface-bordered" : ""}`}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0 mt-[5px]"
              style={{ backgroundColor: DOT_COLOR[item.type] }}
            />
            <div>
              <p className="text-content-primary leading-snug mb-0.5"
                 dangerouslySetInnerHTML={{ __html: item.text.replace(/^([^<]+?)(\s)/, '<strong>$1</strong>$2') }}
              />
              <p className="text-[11px] text-content-tertiary">{item.meta}</p>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
          <XAxis dataKey="month" stroke="#6B7894" fontSize={12} />
          <YAxis stroke="#6B7894" fontSize={12} tickFormatter={(v) => "$" + v / 1000 + "k"} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E8EDF5" }}
            formatter={(v) => ["$" + v.toLocaleString()]}
          />
          <Area type="monotone" dataKey="budget" stroke="#C66130" strokeDasharray="4 4" fill="transparent" name="Bütçe" strokeWidth={1.5} />
          <Area type="monotone" dataKey="spend"  stroke="#2249D6" fill="#DEE8FD" strokeWidth={2} name="Spend" />
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
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E8EDF5" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[26px] font-semibold text-content-primary leading-none">94</p>
            <p className="text-[10px] text-content-tertiary uppercase tracking-[0.05em] mt-1 font-semibold">Lisans</p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 pl-4">
          {kademeData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-[13px] text-content-primary leading-none font-medium">{item.name}</p>
                <p className="text-[12px] text-content-secondary">{item.value} kullanıcı</p>
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
  const color = pct >= 85 ? "#A02E1F" : pct >= 70 ? "#C66130" : "#2249D6";
  return (
    <div className="inline-flex items-center gap-2 ml-2">
      <div className="w-20 h-1.5 bg-surface-bordered rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function AccountTable() {
  return (
    <div className="bg-surface border border-surface-bordered rounded-card overflow-hidden mt-4 shadow-card">
      <div className="flex items-start justify-between px-5 py-4 border-b border-surface-bordered">
        <div>
          <p className="text-[14px] font-semibold text-content-primary mb-0.5">Account / Capability Bazlı Maliyet Dağılımı</p>
          <p className="text-[12px] text-content-secondary">Bu ay (Mayıs 2026) · Bütçe kullanımı</p>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Account / Capability", "Aktif Lisans", "Bu Ay Spend", "Bütçe", "Kullanım"].map((h) => (
              <th key={h} className="text-left text-[11px] uppercase tracking-[0.05em] text-content-tertiary font-semibold px-5 py-2.5 border-b border-surface-bordered first:pl-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accountBreakdownData.map((row, i) => (
            <tr key={row.account} className={i < accountBreakdownData.length - 1 ? "border-b border-surface-bordered/60" : ""}>
              <td className="px-5 py-2.5 text-[13px] font-semibold text-content-primary">{row.account}</td>
              <td className="px-5 py-2.5 text-[13px] text-content-secondary">{row.licenses}</td>
              <td className="px-5 py-2.5 text-[13px] text-content-primary">${row.spend.toLocaleString()}</td>
              <td className="px-5 py-2.5 text-[13px] text-content-secondary">${row.budget.toLocaleString()}</td>
              <td className="px-5 py-2.5 text-[13px] text-content-primary">
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
const HEAT_COLORS = ["#F5F8FC", "#DEE8FD", "#8FAEED", "#2249D6", "#0F1737"];
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
          <div key={h} className="text-[10px] text-content-tertiary text-center font-medium">{h}:00</div>
        ))}
        {days.map((day, di) => (
          <>
            <div key={`d-${di}`} className="text-[11px] text-content-secondary flex items-center font-medium">{day}</div>
            {values[di].map((v, hi) => (
              <div
                key={`${di}-${hi}`}
                title={`${day} ${hours[hi]}:00 — ${v} kullanıcı`}
                className="flex items-center justify-center rounded-[4px] text-[10px] font-medium"
                style={{
                  height: 22,
                  backgroundColor: heatColor(v),
                  color: v > 30 ? "#fff" : "#3B4A6B",
                }}
              >
                {v}
              </div>
            ))}
          </>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[11px] text-content-tertiary">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" horizontal={false} />
          <XAxis type="number" stroke="#6B7894" fontSize={12} />
          <YAxis dataKey="role" type="category" stroke="#6B7894" fontSize={11} width={140} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E8EDF5" }} />
          <Bar dataKey="count" fill="#2249D6" radius={[0, 4, 4, 0]} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF5" vertical={false} />
          <XAxis dataKey="month" stroke="#6B7894" fontSize={12} />
          <YAxis stroke="#6B7894" fontSize={12} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E8EDF5" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="yeni"  stackId="a" fill="#2249D6" name="Yeni Lisans" />
          <Bar dataKey="spend" stackId="a" fill="#C66130" name="Spend Yükseltme" />
          <Bar dataKey="role"  stackId="a" fill="#5C7F2E" name="Role Değişikliği" radius={[4, 4, 0, 0]} />
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
          <span className="text-[32px] font-semibold text-content-primary">+11</span>
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#FFF3E0] text-accent border border-[#F3B693]">↑ 2x</span>
        </div>
        <p className="text-[13px] text-content-secondary mb-4 leading-relaxed">
          Bu ay 11 kullanıcı bir üst Spend Kademesi&apos;ne yükseltildi. Geçen ay sadece 5&apos;ti.
        </p>
        <div className="bg-brand-light-blue rounded-xl border border-brand-primary/20 px-4 py-3">
          <p className="text-[12px] text-brand-primary leading-relaxed">
            <strong>İçgörü:</strong> Medium → High geçişleri AI &amp; Analytics ve Tech Consulting&apos;de yoğunlaşıyor. Bu departmanların Q3 bütçe revizyonu önerilir.
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
    <div className="flex gap-1 bg-surface-muted border border-surface-bordered p-1 rounded-xl">
      {DATE_RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-[12px] rounded-lg transition-colors ${
            active === r
              ? "bg-surface text-content-primary font-semibold shadow-card border border-surface-bordered"
              : "text-content-secondary hover:text-content-primary"
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
          <p className="text-content-secondary text-sm">Bu sayfa sadece License Admin tarafından görüntülenebilir.</p>
          <Link
            href="/"
            className="px-4 py-2 text-[13px] font-medium border border-surface-bordered rounded-lg bg-surface text-content-primary hover:bg-surface-muted transition-colors shadow-card"
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
        <p className="text-content-secondary text-sm text-center px-4">Bu sayfa desktop ekranlar için optimize edilmiştir.</p>
      </div>

      <div className="hidden lg:block max-w-[1200px] mx-auto">

        {/* Page Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="text-[24px] font-bold text-content-primary mb-1">Dashboard</h1>
            <p className="text-[13px] text-content-secondary">Operasyonel durum, kullanım metrikleri ve maliyet özeti</p>
          </div>
          <DateRangeSelector active={dateRange} onChange={setDateRange} />
        </div>

        {/* Attention Alert */}
        <div className="flex items-center gap-3 bg-[#FFF3E0] border-l-[3px] border-accent rounded-xl px-4 py-3 mb-6 text-[13px] text-accent-dark">
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
