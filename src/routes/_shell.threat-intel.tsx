import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Database, Search, Globe, Server, Calendar, ShieldAlert, Flag, Building2, Copy, Check,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RISK_META, type RiskLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/threat-intel")({
  head: () => ({
    meta: [
      { title: "Threat Intelligence — ScamShield" },
      { name: "description", content: "Search the ScamShield threat intelligence database: malicious domains, IPs, wallets and phone numbers with WHOIS, hosting and campaign attribution." },
      { property: "og:title", content: "ScamShield Threat Intelligence" },
      { property: "og:description", content: "Look up malicious domains, IPs, wallets and numbers with full attribution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThreatIntel,
});

type IocType = "Domain" | "IP" | "Wallet" | "Phone";

interface Ioc {
  id: string;
  value: string;
  type: IocType;
  level: RiskLevel;
  campaign: string;
  family: string;
  firstSeen: string;
  lastSeen: string;
  registrar: string;
  hosting: string;
  country: string;
  reports: number;
  feeds: string[];
}

const IOCS: Ioc[] = [
  {
    id: "i1", value: "sbi-secure-kyc.co.in", type: "Domain", level: "critical",
    campaign: "KYC-Freeze IN", family: "Credential Phish", firstSeen: "2026-07-12", lastSeen: "2026-08-11",
    registrar: "NameSilo LLC", hosting: "Cheap-VPS (AS204601)", country: "RU", reports: 148,
    feeds: ["OpenPhish", "PhishTank", "ScamShield Community", "URLhaus"],
  },
  {
    id: "i2", value: "paypa1-secure.com", type: "Domain", level: "critical",
    campaign: "PayPal Typosquat 24", family: "Credential Phish", firstSeen: "2026-06-30", lastSeen: "2026-08-10",
    registrar: "Njalla", hosting: "Bulletproof-Host (AS49505)", country: "NL", reports: 121,
    feeds: ["OpenPhish", "PhishTank", "Spamhaus DBL"],
  },
  {
    id: "i3", value: "185.220.101.44", type: "IP", level: "high",
    campaign: "Smishing Relay Net", family: "SMS Gateway Abuse", firstSeen: "2026-05-04", lastSeen: "2026-08-09",
    registrar: "—", hosting: "Tor Exit / AS205100", country: "DE", reports: 87,
    feeds: ["AbuseIPDB", "Spamhaus XBL", "Blocklist.de"],
  },
  {
    id: "i4", value: "bc1qxy2k...9f4dm3", type: "Wallet", level: "critical",
    campaign: "Crypto Doubler", family: "Investment Fraud", firstSeen: "2026-04-18", lastSeen: "2026-08-08",
    registrar: "—", hosting: "Bitcoin mainnet", country: "—", reports: 214,
    feeds: ["Chainabuse", "ScamShield Community"],
  },
  {
    id: "i5", value: "+1 (415) 555-0138", type: "Phone", level: "high",
    campaign: "IRS Gift-Card", family: "Voice Scam", firstSeen: "2026-07-01", lastSeen: "2026-08-07",
    registrar: "—", hosting: "VoIP (Twilio resale)", country: "US", reports: 54,
    feeds: ["FTC Complaints", "ScamShield Community"],
  },
  {
    id: "i6", value: "wireless-airpods-deals.shop", type: "Domain", level: "medium",
    campaign: "Fake Store Cluster 9", family: "E-commerce Fraud", firstSeen: "2026-07-19", lastSeen: "2026-08-06",
    registrar: "Hostinger", hosting: "Cloudflare-fronted", country: "CN", reports: 52,
    feeds: ["ScamAdviser", "ScamShield Community"],
  },
  {
    id: "i7", value: "hr-globaljobs-hiring.top", type: "Domain", level: "high",
    campaign: "Task-Job Recruitment", family: "Job Fraud", firstSeen: "2026-06-11", lastSeen: "2026-08-05",
    registrar: "Dynadot", hosting: "Alibaba Cloud", country: "HK", reports: 63,
    feeds: ["OpenPhish", "ScamShield Community"],
  },
  {
    id: "i8", value: "104.21.66.19", type: "IP", level: "low",
    campaign: "Shared CDN edge", family: "Mixed reputation", firstSeen: "2025-11-02", lastSeen: "2026-08-04",
    registrar: "—", hosting: "Cloudflare (AS13335)", country: "US", reports: 6,
    feeds: ["AbuseIPDB"],
  },
];

const TYPES: (IocType | "All")[] = ["All", "Domain", "IP", "Wallet", "Phone"];
const TYPE_ICON: Record<IocType, typeof Globe> = {
  Domain: Globe, IP: Server, Wallet: Database, Phone: Flag,
};

function ThreatIntel() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<IocType | "All">("All");
  const [selectedId, setSelectedId] = useState(IOCS[0].id);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IOCS.filter(
      (i) =>
        (type === "All" || i.type === type) &&
        (!q ||
          i.value.toLowerCase().includes(q) ||
          i.campaign.toLowerCase().includes(q) ||
          i.family.toLowerCase().includes(q)),
    );
  }, [query, type]);

  const selected = results.find((r) => r.id === selectedId) ?? results[0];

  const copyIoc = async () => {
    if (!selected) return;
    await navigator.clipboard?.writeText(selected.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <Database className="h-6 w-6 text-primary" /> Threat Intelligence
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {IOCS.length.toLocaleString()} indicators enriched across 40+ feeds — search domains, IPs, wallets and numbers.
        </p>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search indicator, campaign or family..."
              className="border-white/10 bg-white/5 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  type === t ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {results.length === 0 && (
            <GlassCard className="text-sm text-muted-foreground">No indicators match that search.</GlassCard>
          )}
          {results.map((i, idx) => {
            const Icon = TYPE_ICON[i.type];
            const meta = RISK_META[i.level];
            return (
              <motion.button
                key={i.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedId(i.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all",
                  selected?.id === i.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate font-mono text-sm">{i.value}</span>
                  <span className={cn("ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold", meta.bg, meta.color)}>
                    {meta.label}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {i.family} · {i.reports} reports · last seen {i.lastSeen}
                </div>
              </motion.button>
            );
          })}
        </div>

        {selected && (
          <GlassCard strong key={selected.id} className="lg:col-span-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-mono text-lg font-semibold">{selected.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {selected.type} indicator · campaign “{selected.campaign}”
                </div>
              </div>
              <Button variant="outline" onClick={copyIoc} className="gap-2 border-white/10 bg-white/5">
                {copied ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy IOC"}
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { icon: ShieldAlert, label: "Threat family", value: selected.family },
                { icon: Building2,   label: "Registrar", value: selected.registrar },
                { icon: Server,      label: "Hosting", value: selected.hosting },
                { icon: Flag,        label: "Country", value: selected.country },
                { icon: Calendar,    label: "First seen", value: selected.firstSeen },
                { icon: Calendar,    label: "Last seen", value: selected.lastSeen },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <f.icon className="h-3.5 w-3.5" /> {f.label}
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{f.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Corroborating feeds ({selected.feeds.length})
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.feeds.map((f) => (
                  <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              Community reports: <span className="font-semibold text-foreground">{selected.reports}</span>. This
              indicator is auto-blocked for all workspace members and included in the daily blocklist export.
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
