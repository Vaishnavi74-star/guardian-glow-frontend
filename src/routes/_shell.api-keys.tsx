import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Copy, Plus, Trash2, Eye, EyeOff, Code2, Check } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockApiKeys, type ApiKey } from "@/lib/extra-mock-data";

export const Route = createFileRoute("/_shell/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — ScamShield" },
      { name: "description", content: "Manage your ScamShield API keys. Integrate scam detection into your own products." },
      { property: "og:title", content: "ScamShield API Keys" },
      { property: "og:description", content: "Integrate scam detection into your own products." },
    ],
  }),
  component: ApiKeys,
});

const CURL_SAMPLE = `curl -X POST https://api.scamshield.dev/v1/scan/url \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://suspicious-link.com"}'`;

function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const copy = async (id: string, text: string) => {
    await navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const create = () => {
    if (!newName.trim()) return;
    const rand = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    const k: ApiKey = {
      id: `k${Date.now()}`,
      name: newName,
      key: `sk_live_${rand}••••••••••••${rand.slice(0, 4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "Never",
      scopes: ["scan:url"],
      requests: 0,
    };
    setKeys((prev) => [k, ...prev]);
    setNewName("");
    setCreating(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5 text-accent" /> DEVELOPER · API KEYS
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Integrate ScamShield into your product</h1>
          <p className="text-sm text-muted-foreground">Manage keys, monitor usage, and access our REST API.</p>
        </div>
        <Button onClick={() => setCreating((v) => !v)} className="gradient-primary text-white glow-primary">
          <Plus className="mr-1.5 h-4 w-4" /> Create new key
        </Button>
      </div>

      {creating && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard strong>
            <h3 className="font-bold">Create API key</h3>
            <p className="text-xs text-muted-foreground">Give it a descriptive name. You can revoke it any time.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Mobile Android Client"
                className="flex-1 min-w-[240px] border-white/10 bg-white/5"
              />
              <Button onClick={() => setCreating(false)} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">Cancel</Button>
              <Button onClick={create} className="gradient-primary text-white glow-primary">Generate</Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <GlassCard>
        <div className="scrollbar-thin -mx-6 overflow-x-auto px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 text-left font-medium">Name</th>
                <th className="pb-3 text-left font-medium">Key</th>
                <th className="pb-3 text-left font-medium">Scopes</th>
                <th className="pb-3 text-left font-medium">Requests</th>
                <th className="pb-3 text-left font-medium">Last used</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-t border-white/5">
                  <td className="py-3 pr-3 font-semibold">{k.name}</td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs">
                        {revealed[k.id] ? k.key.replaceAll("•", "x") : k.key}
                      </code>
                      <button
                        onClick={() => setRevealed((r) => ({ ...r, [k.id]: !r[k.id] }))}
                        className="rounded-md p-1 hover:bg-white/10"
                        aria-label="Reveal"
                      >
                        {revealed[k.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => copy(k.id, k.key)}
                        className="rounded-md p-1 hover:bg-white/10"
                        aria-label="Copy"
                      >
                        {copied === k.id ? <Check className="h-3.5 w-3.5 text-safe" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <span key={s} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-3 font-mono">{k.requests.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{k.lastUsed}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setKeys((prev) => prev.filter((x) => x.id !== k.id))}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/15 hover:text-danger"
                      aria-label="Revoke"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-accent" />
          <h3 className="font-bold">Quick start</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Send your first request in under a minute.</p>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed">
{CURL_SAMPLE}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <a className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10">API reference →</a>
          <a className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10">Node.js SDK →</a>
          <a className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10">Python SDK →</a>
          <a className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10">Webhooks →</a>
        </div>
      </GlassCard>
    </div>
  );
}
