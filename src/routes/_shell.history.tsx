import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter, Link2, Mail, MessageSquare, QrCode, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockScans, RISK_META, type ScanType, type RiskLevel } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/history")({
  head: () => ({ meta: [{ title: "Scan History — ScamShield" }] }),
  component: History,
});

const TYPE_ICON: Record<ScanType, typeof Link2> = {
  url: Link2, email: Mail, whatsapp: MessageSquare, qr: QrCode, screenshot: ImageIcon,
};

// Expand mock list
const ALL = [...Array(3)].flatMap((_, i) => mockScans.map((s) => ({ ...s, id: s.id + "-" + i })));

function History() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() =>
    ALL.filter((s) =>
      (type === "all" || s.type === type) &&
      (level === "all" || s.level === level) &&
      (q === "" || s.target.toLowerCase().includes(q.toLowerCase()))
    ), [q, type, level]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">SCAN HISTORY</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">All your scans</h1>
        <p className="text-sm text-muted-foreground">Search, filter, and review every check you've run.</p>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search target..." className="border-white/10 bg-white/5 pl-10" />
          </div>
          <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
            <SelectTrigger className="w-full border-white/10 bg-white/5 md:w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="qr">QR</SelectItem>
              <SelectItem value="screenshot">Screenshot</SelectItem>
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1); }}>
            <SelectTrigger className="w-full border-white/10 bg-white/5 md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk</SelectItem>
              {(["safe","low","medium","high","critical"] as RiskLevel[]).map((l) => (
                <SelectItem key={l} value={l}>{RISK_META[l].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 -mx-6 overflow-x-auto px-6 scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 text-left font-medium">Type</th>
                <th className="pb-3 text-left font-medium">Target</th>
                <th className="pb-3 text-left font-medium">Risk</th>
                <th className="pb-3 text-right font-medium">Score</th>
                <th className="pb-3 text-right font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => {
                const Icon = TYPE_ICON[s.type];
                const meta = RISK_META[s.level];
                return (
                  <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5">
                          <Icon className="h-4 w-4 text-accent" />
                        </div>
                        <span className="capitalize">{s.type}</span>
                      </div>
                    </td>
                    <td className="max-w-[320px] truncate py-3 pr-3 font-medium">{s.target}</td>
                    <td className="py-3 pr-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    </td>
                    <td className="py-3 pr-3 text-right font-mono font-semibold">{s.riskScore}</td>
                    <td className="py-3 text-right text-muted-foreground">{new Date(s.timestamp).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center text-muted-foreground">No scans match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Showing {shown.length} of {filtered.length}</div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="px-3 text-sm">{page} / {pages}</div>
            <Button variant="outline" size="icon" className="border-white/10 bg-white/5" disabled={page === pages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
