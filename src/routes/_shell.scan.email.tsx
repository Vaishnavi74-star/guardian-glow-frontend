import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";
import { suspiciousKeywords } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/scan/email")({
  head: () => ({ meta: [{ title: "Email Scanner — ScamShield" }] }),
  component: EmailScan,
});

function EmailScan() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const matched = suspiciousKeywords.filter((k) => text.toLowerCase().includes(k.toLowerCase()));

  const scan = () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const r = mockAnalyze(text + (matched.length > 0 ? " urgent verify" : ""));
      setResult({
        ...r,
        extras: matched.length > 0 ? (
          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suspicious keywords detected</div>
            <div className="flex flex-wrap gap-2">
              {matched.map((k) => (
                <span key={k} className="flex items-center gap-1 rounded-full border border-danger/40 bg-danger/15 px-2.5 py-1 text-xs text-danger">
                  <AlertTriangle className="h-3 w-3" /> {k}
                </span>
              ))}
            </div>
          </div>
        ) : null,
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5 text-accent" /> EMAIL SCANNER</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Analyze suspicious emails</h1>
        <p className="text-sm text-muted-foreground">Paste full email content — headers, subject, and body.</p>
      </div>

      <GlassCard strong>
        <Textarea
          value={text} onChange={(e) => setText(e.target.value)}
          placeholder={`From: billing@amaz0n-refunds.io\nSubject: Urgent — verify your account\n\nDear customer, your account has been suspended...`}
          className="min-h-[220px] border-white/10 bg-white/5 font-mono text-sm"
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{text.length} characters</div>
          <Button onClick={scan} disabled={loading || !text.trim()} className="gradient-primary px-6 text-white glow-primary">
            {loading ? "Analyzing..." : "Analyze email"}
          </Button>
        </div>
      </GlassCard>

      {loading && <LoadingScan label="Analyzing email content" />}
      {result && <ResultView result={result} />}
    </div>
  );
}
