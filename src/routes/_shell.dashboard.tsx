import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";
import {
  ShieldCheck, TrendingUp, AlertTriangle, Activity, Link2, Mail, MessageSquare,
  QrCode, Image as ImageIcon, ArrowUpRight, Zap,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { RiskGauge } from "@/components/scam/RiskGauge";
import { Link } from "@tanstack/react-router";
import {
  mockScans, threatTrend, threatBreakdown, scanTypeStats, RISK_META,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ScamShield" }] }),
  component: Dashboard,
});

const STATS = [
  { label: "Total Scans",     value: "2,148", trend: "+12.4%", icon: Activity,      grad: "from-primary to-accent" },
  { label: "Threats Blocked", value: "184",   trend: "+8.1%",  icon: ShieldCheck,   grad: "from-safe to-cyan" },
  { label: "Critical Alerts", value: "23",    trend: "-4.2%",  icon: AlertTriangle, grad: "from-danger to-warning" },
  { label: "Safe Score",      value: "87%",   trend: "+2.0%",  icon: TrendingUp,    grad: "from-neon to-primary" },
];

const QUICK = [
  { label: "URL",        icon: Link2,        to: "/scan/url" },
  { label: "Email",      icon: Mail,         to: "/scan/email" },
  { label: "WhatsApp",   icon: MessageSquare,to: "/scan/whatsapp" },
  { label: "QR Code",    icon: QrCode,       to: "/scan/qr" },
  { label: "Screenshot", icon: ImageIcon,    to: "/scan/screenshot" },
] as const;

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 overflow-hidden relative">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-accent" /> LIVE PROTECTION
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, <span className="gradient-text">Alex</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Your shield stopped 3 threats in the last 24 hours.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <Link key={q.label} to={q.to}
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm hover:bg-white/10 hover:border-white/20 transition-all">
                  <q.icon className="h-4 w-4 text-accent" />
                  <span>{q.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Security Score</div>
          <div className="mt-2"><RiskGauge score={13} size={170} /></div>
          <div className="mt-1 text-xs text-muted-foreground">Lower is safer</div>
        </GlassCard>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.grad} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-3xl font-black tracking-tight">{s.value}</div>
                <div className={`mt-1 text-xs font-semibold ${s.trend.startsWith("+") ? "text-safe" : "text-danger"}`}>{s.trend}</div>
              </div>
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.grad} text-white`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Threat Activity</h3>
              <p className="text-xs text-muted-foreground">Scans vs blocked threats · last 7 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Scans</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> Threats</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 25)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="day" stroke="oklch(0.72 0.03 260)" fontSize={12} />
                <YAxis stroke="oklch(0.72 0.03 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.04 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="scans" stroke="oklch(0.65 0.22 275)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="oklch(0.65 0.24 25)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold">Threat Breakdown</h3>
          <p className="text-xs text-muted-foreground">By category · last 30 days</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {threatBreakdown.map((e) => <Cell key={e.name} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.20 0.04 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {threatBreakdown.map((t) => (
              <li key={t.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: t.color }} /> {t.name}</span>
                <span className="font-semibold">{t.value}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Scan types + recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <h3 className="font-bold">Scans by Type</h3>
          <p className="text-xs text-muted-foreground">Volume distribution</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanTypeStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.72 0.03 260)" fontSize={11} />
                <YAxis type="category" dataKey="type" stroke="oklch(0.72 0.03 260)" fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: "oklch(0.20 0.04 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="oklch(0.70 0.18 230)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Recent Scans</h3>
              <p className="text-xs text-muted-foreground">Latest security checks</p>
            </div>
            <Link to="/history" className="text-xs text-accent hover:underline">View all →</Link>
          </div>
          <div className="scrollbar-thin -mx-6 overflow-x-auto px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Target</th>
                  <th className="pb-3 text-left font-medium">Type</th>
                  <th className="pb-3 text-left font-medium">Risk</th>
                  <th className="pb-3 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {mockScans.slice(0, 6).map((s) => {
                  const meta = RISK_META[s.level];
                  return (
                    <tr key={s.id} className="border-t border-white/5">
                      <td className="max-w-[220px] truncate py-3 pr-3 font-medium">{s.target}</td>
                      <td className="py-3 pr-3 text-muted-foreground capitalize">{s.type}</td>
                      <td className="py-3 pr-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${meta.bg} ${meta.color}`}>{meta.label}</span>
                      </td>
                      <td className="py-3 text-right font-mono font-semibold">{s.riskScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
