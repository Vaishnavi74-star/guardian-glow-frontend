import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Minus } from "lucide-react";
import { Logo } from "@/components/scam/Logo";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ScamShield Scam Protection Plans" },
      { name: "description", content: "Simple ScamShield pricing: a free personal plan, Pro for power users, and Business with team seats, API access and compliance reporting." },
      { property: "og:title", content: "ScamShield Pricing" },
      { property: "og:description", content: "Free, Pro and Business plans for AI-powered scam detection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Personal",
    tagline: "For everyday safety",
    monthly: 0,
    yearly: 0,
    features: ["50 scans / month", "URL + Email scanners", "Basic risk report", "Community threat feed", "Email alerts"],
    cta: "Start free",
  },
  {
    name: "Pro",
    tagline: "For power users & freelancers",
    monthly: 9,
    yearly: 90,
    features: [
      "Unlimited scans",
      "All 6 scanners incl. QR & Screenshot",
      "AI explanation + PDF reports",
      "Bulk URL scanning & CSV export",
      "Browser extension + real-time blocking",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Business",
    tagline: "For teams & compliance",
    monthly: 29,
    yearly: 290,
    features: [
      "Everything in Pro",
      "10 team seats + roles & audit log",
      "API access (100k calls / mo)",
      "Threat intelligence database",
      "Scheduled compliance reports",
      "SSO + 99.9% uptime SLA",
    ],
    cta: "Talk to sales",
  },
];

const MATRIX = [
  { row: "Monthly scans", values: ["50", "Unlimited", "Unlimited"] },
  { row: "Scanners", values: ["2", "6", "6"] },
  { row: "PDF reports", values: [false, true, true] },
  { row: "Bulk scanning", values: [false, true, true] },
  { row: "API access", values: [false, false, true] },
  { row: "Team seats & audit log", values: [false, false, true] },
  { row: "Threat intel database", values: [false, false, true] },
  { row: "SSO & SLA", values: [false, false, true] },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes — upgrades apply instantly and downgrades take effect at the end of the billing cycle." },
  { q: "Do you store the content I scan?", a: "Scan payloads are analysed and discarded. Only the risk verdict and metadata are retained in your history." },
  { q: "Is there a discount for annual billing?", a: "Annual billing saves roughly two months compared to paying monthly." },
  { q: "Do you offer nonprofit pricing?", a: "Registered nonprofits and educational institutions get Business at Pro pricing." },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/5 bg-background/50 px-4 backdrop-blur-2xl md:px-8">
        <Link to="/"><Logo /></Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/about" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">About</Link>
          <Link to="/contact" className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground">Contact</Link>
          <Link to="/login"><Button className="gradient-primary text-white">Sign in</Button></Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> 14-day Pro trial on every paid plan
          </span>
          <h1 className="mt-5 text-3xl font-bold md:text-5xl">Protection that scales with you</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Start free, upgrade when scams get personal. No contracts, cancel any time.
          </p>

          <div className="mt-7 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {[["Monthly", false], ["Yearly · save 17%", true]].map(([label, val]) => (
              <button
                key={String(label)}
                onClick={() => setYearly(val as boolean)}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-semibold transition-all",
                  yearly === val ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <GlassCard
              key={p.name}
              strong={p.featured}
              transition={{ delay: i * 0.08 }}
              className={cn("relative flex flex-col", p.featured && "border-primary/40 ring-1 ring-primary/30")}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.tagline}</div>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold">${yearly ? p.yearly : p.monthly}</span>
                <span className="pb-1 text-sm text-muted-foreground">/{yearly ? "year" : "month"}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to={p.name === "Business" ? "/contact" : "/register"} className="mt-6">
                <Button
                  className={cn("w-full gap-2", p.featured ? "gradient-primary text-white" : "border border-white/10 bg-white/5")}
                  variant={p.featured ? "default" : "outline"}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-12 overflow-x-auto">
          <h2 className="text-sm font-semibold">Compare plans</h2>
          <table className="mt-4 w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 text-left font-semibold">Feature</th>
                {PLANS.map((p) => (
                  <th key={p.name} className="pb-3 text-center font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((m) => (
                <tr key={m.row} className="border-t border-white/5">
                  <td className="py-3 text-muted-foreground">{m.row}</td>
                  {m.values.map((v, i) => (
                    <td key={i} className="py-3 text-center">
                      {typeof v === "string" ? (
                        <span className="font-medium">{v}</span>
                      ) : v ? (
                        <Check className="mx-auto h-4 w-4 text-safe" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-muted-foreground/50" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {FAQ.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="text-sm font-semibold">{f.q}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold">Ready to stop the next scam?</h2>
          <p className="mt-2 text-muted-foreground">Join 240,000+ people scanning with ScamShield.</p>
          <Link to="/register" className="mt-5 inline-block">
            <Button size="lg" className="gap-2 gradient-primary text-white">
              Create free account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
