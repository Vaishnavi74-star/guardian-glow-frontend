import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radio, ArrowBigUp, Flag, Search, Plus, Send, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { communityReports, type CommunityReport } from "@/lib/extra-mock-data";
import { RISK_META } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/community")({
  head: () => ({
    meta: [
      { title: "Community Threat Feed — ScamShield" },
      { name: "description", content: "Live feed of scams and phishing attempts reported by the ScamShield community." },
      { property: "og:title", content: "Community Threat Feed — ScamShield" },
      { property: "og:description", content: "Live feed of scams and phishing attempts reported by the ScamShield community." },
    ],
  }),
  component: Community,
});

const CATS = ["All", "Phishing", "Scam Call", "Investment Fraud", "Fake Store", "Romance Scam", "Job Fraud"] as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Community() {
  const [items, setItems] = useState<CommunityReport[]>(communityReports);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ target: "", description: "", category: "Phishing" as CommunityReport["category"] });

  const filtered = useMemo(
    () =>
      items.filter(
        (r) =>
          (cat === "All" || r.category === cat) &&
          (r.target.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase())),
      ),
    [items, q, cat],
  );

  const trending = [...items].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  const upvote = (id: string) => {
    if (voted[id]) return;
    setVoted((v) => ({ ...v, [id]: true }));
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)));
  };

  const submit = () => {
    if (!form.target.trim() || !form.description.trim()) return;
    const n: CommunityReport = {
      id: `c${Date.now()}`,
      reporter: "You",
      avatar: "YO",
      target: form.target,
      category: form.category,
      description: form.description,
      level: "high",
      upvotes: 1,
      reports: 1,
      timestamp: new Date().toISOString(),
    };
    setItems((prev) => [n, ...prev]);
    setForm({ target: "", description: "", category: "Phishing" });
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Radio className="h-3.5 w-3.5 text-accent animate-pulse" /> COMMUNITY FEED · LIVE
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Threats reported by the community</h1>
          <p className="text-sm text-muted-foreground">Real scams caught in the wild. Upvote to warn others.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="gradient-primary text-white glow-primary">
          <Plus className="mr-1.5 h-4 w-4" /> Report a scam
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard strong>
            <h3 className="font-bold">Report a scam</h3>
            <p className="text-xs text-muted-foreground">Help protect others — your report is anonymous.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                placeholder="URL, phone number, or handle"
                className="border-white/10 bg-white/5"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as CommunityReport["category"] })}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              >
                {CATS.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what happened, how you were contacted, and any red flags..."
              className="mt-3 min-h-[100px] border-white/10 bg-white/5"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">Cancel</Button>
              <Button onClick={submit} className="gradient-primary text-white glow-primary">
                <Send className="mr-1.5 h-4 w-4" /> Submit report
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reports..." className="border-white/10 bg-white/5 pl-9" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  cat === c
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((r, i) => {
              const m = RISK_META[r.level];
              const has = voted[r.id];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass rounded-2xl p-5 hover:border-white/20 transition-all"
                >
                  <div className="flex gap-4">
                    <button
                      onClick={() => upvote(r.id)}
                      className={`flex h-fit flex-col items-center gap-0.5 rounded-xl border px-2.5 py-2 transition-all ${
                        has
                          ? "border-accent/50 bg-accent/15 text-accent"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      <ArrowBigUp className={`h-5 w-5 ${has ? "fill-current" : ""}`} />
                      <span className="text-xs font-bold">{r.upvotes}</span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-lg gradient-primary text-[10px] font-bold text-white">
                          {r.avatar}
                        </div>
                        <span className="text-sm font-semibold">{r.reporter}</span>
                        <span className="text-xs text-muted-foreground">· {timeAgo(r.timestamp)}</span>
                        <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${m.bg} ${m.color}`}>
                          {m.label}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {r.category}
                        </span>
                        <span className="break-all font-mono text-sm">{r.target}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Flag className="h-3 w-3" /> {r.reports} reports</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
                No reports match your filters.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-bold">Trending threats</h3>
            </div>
            <ol className="mt-3 space-y-3">
              {trending.map((t, i) => (
                <li key={t.id} className="flex gap-3">
                  <div className="text-xl font-black text-muted-foreground/50">{i + 1}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.target}</div>
                    <div className="text-[11px] text-muted-foreground">{t.category} · {t.upvotes} upvotes</div>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
          <GlassCard>
            <h3 className="font-bold">Community stats</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Reports today</dt><dd className="font-semibold">1,247</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Active reporters</dt><dd className="font-semibold">8,391</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Threats blocked</dt><dd className="font-semibold text-safe">184,203</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Countries</dt><dd className="font-semibold">142</dd></div>
            </dl>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
