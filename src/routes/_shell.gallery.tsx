import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid, ExternalLink, Columns2, Columns3, Square, RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { ResultView, mockAnalyze } from "@/components/scam/ScannerShared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/gallery")({
  head: () => ({
    meta: [
      { title: "Route Gallery — ScamShield" },
      { name: "description", content: "Side-by-side previews of every ScamShield scanner and details page, rendered live with mock data." },
      { property: "og:title", content: "Route Gallery — ScamShield" },
      { property: "og:description", content: "Preview every scanner and details page of ScamShield side-by-side with mock data." },
    ],
  }),
  component: GalleryPage,
});

const GROUPS = [
  {
    label: "Scanners",
    routes: [
      { to: "/scan/url", label: "URL Scanner" },
      { to: "/scan/email", label: "Email Scanner" },
      { to: "/scan/sms", label: "SMS Scanner" },
      { to: "/scan/whatsapp", label: "WhatsApp Scanner" },
      { to: "/scan/qr", label: "QR Code Scanner" },
      { to: "/scan/screenshot", label: "Screenshot Scanner" },
      { to: "/bulk", label: "Bulk URL Scanner" },
    ],
  },
  {
    label: "Details & Overview",
    routes: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/alerts", label: "Alerts Center" },
      { to: "/history", label: "Scan History" },
      { to: "/community", label: "Community Feed" },
      { to: "/achievements", label: "Achievements" },
      { to: "/api-keys", label: "API Keys" },
      { to: "/extension", label: "Extension" },
      { to: "/profile", label: "Profile" },
      { to: "/settings", label: "Settings" },
    ],
  },
  {
    label: "Public & Auth",
    routes: [
      { to: "/", label: "Landing" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" },
      { to: "/forgot-password", label: "Forgot Password" },
      { to: "/reset-password", label: "Reset Password" },
      { to: "/verify-otp", label: "OTP Verification" },
    ],
  },
] as const;

const MOCK_TARGETS = [
  { label: "Phishing link", target: "http://paypa1-secure.zip/verify-account-now" },
  { label: "Safe link", target: "https://github.com/scamshield" },
  { label: "Smishing SMS", target: "KYC suspended! Share OTP to claim ₹25,000 reward: bit.ly/x9k" },
  { label: "UPI QR", target: "upi://pay?pa=refund.instant@okaxis&am=4999" },
] as const;

const COLS = [
  { n: 1, icon: Square },
  { n: 2, icon: Columns2 },
  { n: 3, icon: Columns3 },
] as const;

function GalleryPage() {
  const [cols, setCols] = useState<number>(2);
  const [nonce, setNonce] = useState(0);
  const [activeTarget, setActiveTarget] = useState<string>(MOCK_TARGETS[0].target);

  const result = mockAnalyze(activeTarget);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <LayoutGrid className="h-3.5 w-3.5 text-accent" /> ROUTE GALLERY
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Every screen, side-by-side</h1>
          <p className="text-sm text-muted-foreground">
            Live previews of all scanner and details pages, rendered with mock data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {COLS.map((c) => (
              <button
                key={c.n}
                onClick={() => setCols(c.n)}
                aria-label={`${c.n} column layout`}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  cols === c.n ? "bg-white/15 text-foreground" : "text-muted-foreground hover:bg-white/10",
                )}
              >
                <c.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setNonce((n) => n + 1)}
            className="border-white/10 bg-white/5"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reload previews
          </Button>
        </div>
      </div>

      {/* Mock result comparison */}
      <GlassCard strong className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Mock result preview</span>
          <span className="text-xs text-muted-foreground">— same analyzer used by every scanner</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {MOCK_TARGETS.map((m) => (
              <button
                key={m.label}
                onClick={() => setActiveTarget(m.target)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  activeTarget === m.target
                    ? "border-accent/40 bg-accent/15 text-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="truncate rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-muted-foreground">
          {activeTarget}
        </div>
        <ResultView result={result} />
      </GlassCard>

      {GROUPS.map((group) => (
        <section key={group.label} className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight">{group.label}</h2>
          <div
            className={cn(
              "grid gap-5",
              cols === 1 && "grid-cols-1",
              cols === 2 && "grid-cols-1 xl:grid-cols-2",
              cols === 3 && "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3",
            )}
          >
            {group.routes.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                className="glass overflow-hidden rounded-2xl"
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{r.label}</div>
                    <div className="truncate font-mono text-[11px] text-muted-foreground">{r.to}</div>
                  </div>
                  <Link
                    to={r.to}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div className="relative h-[300px] overflow-hidden bg-background/40">
                  <iframe
                    key={`${r.to}-${nonce}`}
                    src={r.to}
                    title={`${r.label} preview`}
                    loading="lazy"
                    tabIndex={-1}
                    className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
                    style={{ width: 1440, height: 1200, transform: "scale(0.42)" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
