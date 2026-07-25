import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, ShieldAlert, ShieldCheck, Filter, Check, X,
  Link2, Mail, MessageSquare, QrCode, Image as ImageIcon, PhoneCall,
  Search, Archive, Bell, Clock,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { mockScans, RISK_META, type RiskLevel, type ScanType } from "@/lib/mock-data";
import { communityReports } from "@/lib/extra-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/alerts")({
  head: () => ({
    meta: [
      { title: "Security Alerts — ScamShield" },
      { name: "description", content: "Aggregated timeline of security alerts from every scanner, with severity filters and resolution actions." },
      { property: "og:title", content: "Security Alerts — ScamShield" },
      { property: "og:description", content: "Unified alert center with severity filters and mark-as-resolved workflow." },
    ],
  }),
  component: AlertsCenter,
});

type AlertStatus = "active" | "resolved" | "dismissed";
type AlertSource = "scanner" | "community" | "system";

interface AlertItem {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  source: AlertSource;
  scanType?: ScanType;
  target: string;
  timestamp: string;
  status: AlertStatus;
}

const SCAN_ICON: Record<ScanType, typeof Link2> = {
  url: Link2, email: Mail, whatsapp: MessageSquare, qr: QrCode, screenshot: ImageIcon,
};

function buildInitialAlerts(): AlertItem[] {
  const fromScans: AlertItem[] = mockScans
    .filter((s) => s.level !== "safe" && s.level !== "low")
    .map((s) => ({
      id: `a-${s.id}`,
      title:
        s.level === "critical" ? "Critical threat detected"
        : s.level === "high" ? "High-risk target flagged"
        : "Suspicious activity",
      description: `Scanner flagged ${s.type.toUpperCase()} target with a risk score of ${s.riskScore}/100.`,
      level: s.level,
      source: "scanner",
      scanType: s.type,
      target: s.target,
      timestamp: s.timestamp,
      status: "active",
    }));

  const fromCommunity: AlertItem[] = communityReports.slice(0, 4).map((c) => ({
    id: `a-${c.id}`,
    title: `Community: ${c.category}`,
    description: c.description,
    level: c.level,
    source: "community",
    target: c.target,
    timestamp: c.timestamp,
    status: "active",
  }));

  const system: AlertItem[] = [
    {
      id: "a-sys1",
      title: "Weekly digest ready",
      description: "You scanned 47 items this week. Safety score improved by 4 points.",
      level: "low",
      source: "system",
      target: "ScamShield · Weekly Report",
      timestamp: "2026-07-22T20:00:00Z",
      status: "active",
    },
    {
      id: "a-sys2",
      title: "Extension update available",
      description: "ScamShield browser extension v2.4 improves phishing heuristics.",
      level: "safe",
      source: "system",
      target: "ScamShield · System",
      timestamp: "2026-07-21T12:00:00Z",
      status: "resolved",
    },
  ];

  return [...fromScans, ...fromCommunity, ...system].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

const LEVELS: (RiskLevel | "all")[] = ["all", "critical", "high", "medium", "low", "safe"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function SourceIcon({ alert }: { alert: AlertItem }) {
  if (alert.source === "scanner" && alert.scanType) {
    const Icon = SCAN_ICON[alert.scanType];
    return <Icon className="h-4 w-4" />;
  }
  if (alert.source === "community") return <PhoneCall className="h-4 w-4" />;
  return <Bell className="h-4 w-4" />;
}

function AlertsCenter() {
  const [alerts, setAlerts] = useState<AlertItem[]>(() => buildInitialAlerts());
  const [levelFilter, setLevelFilter] = useState<RiskLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("active");
  const [sourceFilter, setSourceFilter] = useState<AlertSource | "all">("all");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const active = alerts.filter((a) => a.status === "active");
    return {
      total: alerts.length,
      active: active.length,
      critical: active.filter((a) => a.level === "critical").length,
      high: active.filter((a) => a.level === "high").length,
      resolved: alerts.filter((a) => a.status === "resolved").length,
    };
  }, [alerts]);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (levelFilter !== "all" && a.level !== levelFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (sourceFilter !== "all" && a.source !== sourceFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!a.title.toLowerCase().includes(q) &&
            !a.description.toLowerCase().includes(q) &&
            !a.target.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [alerts, levelFilter, statusFilter, sourceFilter, query]);

  const update = (id: string, status: AlertStatus) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const resolveAll = () =>
    setAlerts((prev) => prev.map((a) => (a.status === "active" ? { ...a, status: "resolved" } : a)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5 text-danger" /> Security Alerts
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
            Alerts <span className="gradient-text">Center</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every threat from your scanners, the community feed, and system events in one live timeline.
          </p>
        </div>
        <button
          onClick={resolveAll}
          disabled={stats.active === 0}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-40"
        >
          <Check className="h-4 w-4" /> Resolve all active
        </button>
      </div>

      {/* Stat strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active alerts",   value: stats.active,   icon: AlertTriangle, cls: "text-warning bg-warning/15" },
          { label: "Critical",        value: stats.critical, icon: ShieldAlert,   cls: "text-destructive bg-destructive/15" },
          { label: "High severity",   value: stats.high,     icon: AlertTriangle, cls: "text-danger bg-danger/15" },
          { label: "Resolved",        value: stats.resolved, icon: ShieldCheck,   cls: "text-safe bg-safe/15" },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-2xl font-black">{s.value}</div>
              </div>
              <div className={cn("grid h-10 w-10 place-items-center rounded-xl", s.cls)}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search alerts, targets, descriptions..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
            {(["active", "resolved", "dismissed", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                  statusFilter === s ? "bg-white/15 text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
            {(["all", "scanner", "community", "system"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                  sourceFilter === s ? "bg-white/15 text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Severity:
          </span>
          {LEVELS.map((l) => {
            const active = levelFilter === l;
            const meta = l !== "all" ? RISK_META[l] : null;
            return (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold capitalize transition-all",
                  active
                    ? meta
                      ? `${meta.bg} ${meta.color}`
                      : "border-white/20 bg-white/10 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                )}
              >
                {l}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Timeline */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <h3 className="font-bold">Alert timeline</h3>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {alerts.length} alerts
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Most recent first
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-safe/15 text-safe">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-sm font-semibold">All clear</div>
            <div className="text-xs text-muted-foreground">No alerts match the current filters.</div>
          </div>
        ) : (
          <ol className="relative">
            <span className="pointer-events-none absolute left-[34px] top-4 bottom-4 w-px bg-white/10" />
            <AnimatePresence initial={false}>
              {filtered.map((a) => {
                const meta = RISK_META[a.level];
                const dotCls =
                  a.level === "critical" ? "bg-destructive" :
                  a.level === "high"     ? "bg-danger" :
                  a.level === "medium"   ? "bg-warning" :
                  a.level === "low"      ? "bg-cyan" : "bg-safe";
                return (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative flex gap-4 border-b border-white/5 px-6 py-4 last:border-b-0 hover:bg-white/[0.02]"
                  >
                    <div className="relative z-10 flex flex-col items-center pt-1">
                      <span className={cn("grid h-8 w-8 place-items-center rounded-full ring-4 ring-background/60", dotCls, "text-white")}>
                        <SourceIcon alert={a} />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", meta.bg, meta.color)}>
                          {meta.label}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {a.source}
                        </span>
                        {a.status !== "active" && (
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                            a.status === "resolved" ? "bg-safe/15 text-safe" : "bg-white/10 text-muted-foreground",
                          )}>
                            {a.status}
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(a.timestamp)}</span>
                      </div>

                      <div className="mt-1.5 font-semibold">{a.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{a.description}</div>
                      <div className="mt-1.5 truncate font-mono text-[11px] text-muted-foreground/80">{a.target}</div>

                      {a.status === "active" && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => update(a.id, "resolved")}
                            className="flex items-center gap-1.5 rounded-lg border border-safe/30 bg-safe/10 px-3 py-1.5 text-xs font-semibold text-safe hover:bg-safe/20"
                          >
                            <Check className="h-3.5 w-3.5" /> Mark resolved
                          </button>
                          <button
                            onClick={() => update(a.id, "dismissed")}
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-white/10"
                          >
                            <Archive className="h-3.5 w-3.5" /> Dismiss
                          </button>
                        </div>
                      )}
                      {a.status !== "active" && (
                        <div className="mt-3">
                          <button
                            onClick={() => update(a.id, "active")}
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-white/10"
                          >
                            <X className="h-3.5 w-3.5" /> Reopen
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ol>
        )}
      </GlassCard>
    </div>
  );
}
