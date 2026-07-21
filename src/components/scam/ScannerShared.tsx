import { motion } from "framer-motion";
import { GlassCard } from "@/components/scam/GlassCard";
import { RiskGauge } from "@/components/scam/RiskGauge";
import { RISK_META, mockUrlAnalysis, scoreToLevel, type RiskLevel } from "@/lib/mock-data";
import { Sparkles, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

export interface ScanResult {
  score: number;
  level: RiskLevel;
  findings: string[];
  recommendations: string[];
  aiSummary?: string;
  extras?: ReactNode;
}

export function mockAnalyze(target: string): ScanResult {
  const base = mockUrlAnalysis(target);
  return {
    ...base,
    aiSummary:
      base.score > 60
        ? "Our AI classifier flags this as highly likely to be a phishing / scam attempt. Multiple red flags detected across language, structure, and reputation signals."
        : base.score > 30
        ? "Some suspicious signals detected, but not conclusive. Proceed with caution and verify the source through an independent channel."
        : "No meaningful threat signals detected. Content appears legitimate based on current threat intelligence.",
  };
}

export function ResultView({ result }: { result: ScanResult }) {
  const meta = RISK_META[result.level];
  const Icon = result.score > 60 ? ShieldAlert : result.score > 30 ? AlertTriangle : CheckCircle2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="grid gap-6 lg:grid-cols-3"
    >
      <GlassCard className="flex flex-col items-center justify-center text-center">
        <RiskGauge score={result.score} />
        <div className={`mt-6 flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${meta.bg} ${meta.color}`}>
          <Icon className="h-4 w-4" /> Threat level: {meta.label}
        </div>
      </GlassCard>

      <GlassCard className="lg:col-span-2">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold">AI Analysis</h3>
          <span className="ml-auto text-xs text-muted-foreground">Powered by ScamShield AI</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.aiSummary}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key findings</div>
            <ul className="space-y-2 text-sm">
              {result.findings.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommendations</div>
            <ul className="space-y-2 text-sm">
              {result.recommendations.map((r) => (
                <li key={r} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {result.extras}
      </GlassCard>
    </motion.div>
  );
}

export function LoadingScan({ label = "Scanning" }: { label?: string }) {
  return (
    <GlassCard className="flex flex-col items-center py-16 text-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-white/10 border-t-primary animate-spin" />
        <div className="absolute inset-0 grid place-items-center">
          <Sparkles className="h-8 w-8 text-accent animate-pulse" />
        </div>
      </div>
      <div className="mt-6 font-bold">{label}...</div>
      <div className="text-sm text-muted-foreground">Cross-checking 40+ threat intelligence feeds</div>
      <div className="mt-6 h-1 w-64 overflow-hidden rounded-full bg-white/5">
        <div className="h-full w-1/3 gradient-primary shimmer" />
      </div>
    </GlassCard>
  );
}

// helper for callers
export { scoreToLevel };
