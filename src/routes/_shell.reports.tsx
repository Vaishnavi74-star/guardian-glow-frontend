import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  FileBarChart, Download, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck,
  Clock, Target, FileText,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { threatBreakdown, scanTypeStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — ScamShield" },
      { name: "description", content: "Executive security reporting: detection trends, threat mix, scanner coverage and exportable compliance summaries." },
      { property: "og:title", content: "ScamShield Reports & Analytics" },
      { property: "og:description", content: "Detection trends, threat mix and exportable compliance summaries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});

const RANGES = ["7d", "30d", "90d", "12m"] as const;
type Range = (typeof RANGES)[number];

const SERIES: Record<Range, { label: string; blocked: number; scanned: number }[]> = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
    label, blocked: [12, 19, 8, 24, 17, 31, 22][i], scanned: [48, 61, 52, 74, 68, 92, 80][i],
  })),
  "30d": Array.from({ length: 10 }, (_, i) => ({
    label: `W${i + 1}`, blocked: 18 + ((i * 7) % 23), scanned: 60 + ((i * 13) % 55),
  })),
  "90d": ["Apr", "May", "Jun"].flatMap((m, mi) =>
    ["1", "2", "3", "4"].map((w, wi) => ({
      label: `${m} W${w}`, blocked: 40 + ((mi * 17 + wi * 9) % 60), scanned: 180 + ((mi * 41 + wi * 23) % 160),
    })),
  ),
  "12m": ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((label, i) => ({
    label, blocked: 120 + ((i * 37) % 180), scanned: 620 + ((i * 91) % 540),
  })),
};

const KPIS: Record<Range, { scans: number; blocked: number; accuracy: number; avgMs: number }> = {
  "7d":  { scans: 475,   blocked: 133,  accuracy: 98.2, avgMs: 412 },
  "30d": { scans: 1_984, blocked: 561,  accuracy: 98.6, avgMs: 398 },
  "90d": { scans: 6_142, blocked: 1_733, accuracy: 98.4, avgMs: 405 },
  "12m": { scans: 24_318, blocked: 7_046, accuracy: 98.9, avgMs: 387 },
};

const TOP_TARGETS = [
  { target: "sbi-secure-kyc.co.in", hits: 148, level: "Critical" },
  { target: "paypa1-secure.com", hits: 121, level: "Critical" },
  { target: "amaz0n-refunds.io", hits: 96, level: "High" },
  { target: "bit.ly/free-crypto-gift", hits: 74, level: "High" },
  { target: "wireless-airpods-deals.shop", hits: 52, level: "Medium" },
];

const SCHEDULED = [
  { name: "Weekly executive summary", cadence: "Every Monday 09:00", format: "PDF" },
  { name: "Monthly compliance export", cadence: "1st of month", format: "CSV" },
  { name: "Critical incident digest", cadence: "Real-time", format: "Email" },
];

function Reports() {
  const [range, setRange] = useState<Range>("30d");
  const data = SERIES[range];
  const kpi = KPIS[range];

  const blockRate = useMemo(
    () => ((kpi.blocked / kpi.scans) * 100).toFixed(1),
    [kpi],
  );

  const exportCsv = () => {
    const rows = [
      ["period", "scans", "threats_blocked"],
      ...data.map((d) => [d.label, String(d.scanned), String(d.blocked)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `scamshield-report-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { icon: Target,      label: "Total scans",      value: kpi.scans.toLocaleString(), delta: "+12.4%", up: true },
    { icon: ShieldAlert, label: "Threats blocked",  value: kpi.blocked.toLocaleString(), delta: "+8.1%", up: true },
    { icon: ShieldCheck, label: "Detection accuracy", value: `${kpi.accuracy}%`, delta: "+0.3pt", up: true },
    { icon: Clock,       label: "Avg. scan time",   value: `${kpi.avgMs}ms`, delta: "-6.2%", up: false },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <FileBarChart className="h-6 w-6 text-primary" /> Reports &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Executive-grade reporting across your entire protection surface. Block rate {blockRate}%.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  range === r ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <Button onClick={exportCsv} variant="outline" className="gap-2 border-white/10 bg-white/5">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <GlassCard key={s.label} transition={{ delay: i * 0.05 }} className="p-5">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <span className={cn("flex items-center gap-1 text-xs font-semibold", s.up ? "text-safe" : "text-cyan")}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.delta}
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="text-sm font-semibold">Scans vs. threats blocked</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="rp-scan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.18 210)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.75 0.18 210)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rp-block" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="scanned" name="Scans" stroke="oklch(0.75 0.18 210)" fill="url(#rp-scan)" strokeWidth={2} />
                <Area type="monotone" dataKey="blocked" name="Blocked" stroke="oklch(0.65 0.24 25)" fill="url(#rp-block)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold">Threat mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {threatBreakdown.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="transparent" />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard>
          <h2 className="text-sm font-semibold">Scanner coverage</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanTypeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="type" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="oklch(0.62 0.22 275)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold">Most-blocked targets</h2>
          <div className="mt-4 space-y-3">
            {TOP_TARGETS.map((t, i) => (
              <motion.div
                key={t.target}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/5 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-xs">{t.target}</span>
                  <span className="shrink-0 text-xs font-semibold text-muted-foreground">{t.hits}×</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full gradient-primary" style={{ width: `${(t.hits / 148) * 100}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold">Scheduled reports</h2>
          <div className="mt-4 space-y-3">
            {SCHEDULED.map((s) => (
              <div key={s.name} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.cadence} · {s.format}</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full border-white/10 bg-white/5">Schedule new report</Button>
        </GlassCard>
      </div>
    </div>
  );
}
