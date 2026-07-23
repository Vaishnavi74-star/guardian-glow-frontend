import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layers, Play, Download, Upload, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mockUrlAnalysis, scoreToLevel, RISK_META, type RiskLevel } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/bulk")({
  head: () => ({
    meta: [
      { title: "Bulk URL Scanner — ScamShield" },
      { name: "description", content: "Scan hundreds of URLs at once and export a CSV threat report." },
      { property: "og:title", content: "Bulk URL Scanner — ScamShield" },
      { property: "og:description", content: "Scan hundreds of URLs at once and export a CSV threat report." },
    ],
  }),
  component: BulkScan,
});

interface Row {
  url: string;
  score: number;
  level: RiskLevel;
  finding: string;
}

function BulkScan() {
  const [text, setText] = useState(
    "https://github.com\nhttps://paypa1-secure.com/login\nhttps://bit.ly/free-crypto-gift\nhttps://vercel.com\nhttps://amaz0n-refunds.io/verify",
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const urls = useMemo(
    () => text.split(/[\n,]/).map((u) => u.trim()).filter(Boolean),
    [text],
  );

  const run = async () => {
    if (!urls.length) return;
    setRunning(true);
    setRows([]);
    for (const u of urls) {
      await new Promise((r) => setTimeout(r, 90));
      const a = mockUrlAnalysis(u);
      setRows((prev) => [
        ...prev,
        { url: u, score: a.score, level: scoreToLevel(a.score), finding: a.findings[0] },
      ]);
    }
    setRunning(false);
  };

  const filtered = rows.filter(
    (r) =>
      (filter === "all" || r.level === filter) &&
      r.url.toLowerCase().includes(q.toLowerCase()),
  );

  const exportCSV = () => {
    const header = "URL,Score,Level,Finding\n";
    const body = rows
      .map((r) => `"${r.url}",${r.score},${r.level},"${r.finding.replaceAll('"', "'")}"`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `scamshield-bulk-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onUpload = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setText(String(r.result));
    r.readAsText(f);
  };

  const stats = {
    total: rows.length,
    threats: rows.filter((r) => r.score > 60).length,
    safe: rows.filter((r) => r.score < 20).length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5 text-accent" /> BULK SCANNER
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Scan many URLs at once</h1>
        <p className="text-sm text-muted-foreground">
          Paste a list (one per line), upload a .txt/.csv, then export a report.
        </p>
      </div>

      <GlassCard strong>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com&#10;https://another.com&#10;..."
          className="min-h-[180px] border-white/10 bg-white/5 font-mono text-sm"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {urls.length} URL{urls.length === 1 ? "" : "s"} queued
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm hover:bg-white/10">
              <Upload className="h-4 w-4" /> Import file
              <input type="file" accept=".txt,.csv" hidden onChange={(e) => onUpload(e.target.files?.[0] ?? null)} />
            </label>
            <Button
              onClick={() => { setText(""); setRows([]); }}
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Clear
            </Button>
            <Button
              onClick={run}
              disabled={running || !urls.length}
              className="gradient-primary px-6 text-white glow-primary"
            >
              <Play className="mr-1.5 h-4 w-4" /> {running ? `Scanning ${rows.length}/${urls.length}...` : "Run bulk scan"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {rows.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Scanned", value: stats.total, cls: "text-foreground" },
              { label: "Threats detected", value: stats.threats, cls: "text-danger" },
              { label: "Verified safe", value: stats.safe, cls: "text-safe" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className={`mt-1 text-3xl font-black ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <GlassCard>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter URLs..." className="border-white/10 bg-white/5 pl-9"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as RiskLevel | "all")}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                <option value="all">All levels</option>
                <option value="safe">Safe</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <Button onClick={exportCSV} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                <Download className="mr-1.5 h-4 w-4" /> Export CSV
              </Button>
            </div>

            <div className="scrollbar-thin -mx-6 overflow-x-auto px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 text-left font-medium">URL</th>
                    <th className="pb-3 text-left font-medium">Level</th>
                    <th className="pb-3 text-left font-medium">Finding</th>
                    <th className="pb-3 text-right font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const m = RISK_META[r.level];
                    return (
                      <motion.tr
                        key={r.url + i}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="border-t border-white/5"
                      >
                        <td className="max-w-[260px] truncate py-3 pr-3 font-mono text-xs">{r.url}</td>
                        <td className="py-3 pr-3">
                          <span className={`rounded-full border px-2 py-0.5 text-xs ${m.bg} ${m.color}`}>{m.label}</span>
                        </td>
                        <td className="max-w-[280px] truncate py-3 pr-3 text-muted-foreground">{r.finding}</td>
                        <td className="py-3 text-right font-mono font-semibold">{r.score}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
