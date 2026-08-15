import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Puzzle, Chrome, Download, Shield, Zap, MousePointerClick, Lock, CheckCircle2, Star,
  FolderOpen, ToggleRight, Package, Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/extension")({
  head: () => ({
    meta: [
      { title: "Browser Extension — ScamShield" },
      { name: "description", content: "Install the ScamShield browser extension for real-time protection against phishing sites while you browse." },
      { property: "og:title", content: "ScamShield Browser Extension" },
      { property: "og:description", content: "Real-time phishing protection right inside your browser." },
    ],
  }),
  component: ExtensionPage,
});

const FEATURES = [
  { icon: Zap,              title: "Real-time protection",     body: "Every URL you visit is checked against 40+ threat feeds and AI models in milliseconds." },
  { icon: MousePointerClick,title: "One-click reporting",       body: "See something sketchy? Right-click and send it straight to the community feed." },
  { icon: Shield,           title: "Phishing site blocker",     body: "Loud, unmissable warning page before you land on a known scam or lookalike domain." },
  { icon: Lock,              title: "Zero data collection",     body: "URLs are hashed locally. We never see your browsing history or personal data." },
];

const BROWSERS = [
  { name: "Chrome",  users: "2M+",    installed: true },
  { name: "Edge",    users: "480K",   installed: false },
  { name: "Firefox", users: "310K",   installed: false },
  { name: "Brave",   users: "170K",   installed: false },
];

const STEPS = [
  { icon: Download,    title: "Download the ZIP",      body: "Grab scamshield-extension.zip and unzip it anywhere on your computer." },
  { icon: Chrome,      title: "Open chrome://extensions", body: "Works in Chrome, Edge, Brave, Arc and Opera — paste the address in a new tab." },
  { icon: ToggleRight, title: "Enable Developer mode",  body: "Flip the Developer mode toggle in the top-right corner of the page." },
  { icon: FolderOpen,  title: "Load unpacked",          body: "Click “Load unpacked” and select the unzipped scamshield folder. Done." },
];

function ExtensionPage() {
  const [busy, setBusy] = useState(false);

  const downloadExtension = () => {
    setBusy(true);
    fetch("/scamshield-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "scamshield-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success("Extension downloaded", { description: "Unzip it, then load it via chrome://extensions." });
      })
      .catch((err: Error) => toast.error(err.message))
      .finally(() => setBusy(false));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Puzzle className="h-3.5 w-3.5 text-accent" /> BROWSER EXTENSION · v2.4.1
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Protection <span className="gradient-text">as you browse</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Install ScamShield in your browser to get instant warnings on phishing, scams, and malicious
            downloads — without slowing you down.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="gradient-primary px-6 text-white glow-primary">
              <Chrome className="mr-2 h-4 w-4" /> Add to Chrome — Free
            </Button>
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
              <Download className="mr-2 h-4 w-4" /> Other browsers
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />)}
              </div>
              4.9 · 24,381 reviews
            </span>
            <span>·</span>
            <span>3M+ active users</span>
            <span>·</span>
            <span>Editor's Pick 2026</span>
          </div>
        </div>

        <GlassCard strong className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 rounded-t-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-safe/60" />
              </div>
              <div className="ml-2 flex-1 rounded-md bg-black/30 px-3 py-1 font-mono text-xs text-muted-foreground">
                paypa1-secure.com/login
              </div>
              <div className="grid h-6 w-6 place-items-center rounded-md gradient-primary">
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-b-xl border-x border-b border-danger/40 bg-danger/10 p-6 text-center"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger/20 text-danger">
                <Shield className="h-7 w-7" />
              </div>
              <div className="mt-3 text-lg font-black text-danger">Phishing site blocked</div>
              <div className="mt-1 text-xs text-muted-foreground">
                This page mimics PayPal to steal your credentials.
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <Button size="sm" className="gradient-primary text-white">Take me back</Button>
                <Button size="sm" variant="outline" className="border-white/10 bg-white/5">Report false positive</Button>
              </div>
            </motion.div>
          </div>
        </GlassCard>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-black tracking-tight">Why install it?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 font-bold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <GlassCard>
        <h2 className="font-bold">Available on</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BROWSERS.map((b) => (
            <div key={b.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div>
                <div className="font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.users} users</div>
              </div>
              {b.installed ? (
                <span className="flex items-center gap-1 rounded-full border border-safe/40 bg-safe/15 px-2 py-1 text-[10px] text-safe">
                  <CheckCircle2 className="h-3 w-3" /> Installed
                </span>
              ) : (
                <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">Install</Button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
