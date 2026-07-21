import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, ShieldAlert, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";

export const Route = createFileRoute("/_shell/scan/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp Scanner — ScamShield" }] }),
  component: WaScan,
});

const SAFETY_TIPS = [
  "Never share OTPs, PINs, or passwords over chat.",
  "Verify the sender through an independent channel before acting.",
  "Be skeptical of urgency, rewards, or KYC threats.",
  "Report and block suspicious contacts immediately.",
];

function WaScan() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scan = () => {
    if (!msg.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => setResult(mockAnalyze(msg)) as unknown as void, 1400);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><MessageSquare className="h-3.5 w-3.5 text-accent" /> WHATSAPP SCANNER</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Detect message scams</h1>
        <p className="text-sm text-muted-foreground">Paste a WhatsApp / SMS message to check for scam patterns.</p>
      </div>

      <GlassCard strong>
        <Textarea
          value={msg} onChange={(e) => setMsg(e.target.value)}
          placeholder="Congratulations! You've won ₹50,000. Click here to claim..."
          className="min-h-[180px] border-white/10 bg-white/5 text-sm"
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" /> Your message is analyzed locally in this demo.
          </div>
          <Button onClick={scan} disabled={loading || !msg.trim()} className="gradient-primary px-6 text-white glow-primary">
            {loading ? "Scanning..." : "Scan message"}
          </Button>
        </div>
      </GlassCard>

      {loading && <LoadingScan label="Analyzing message" />}
      {result && (
        <>
          <ResultView result={result} />
          <GlassCard>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning" />
              <h3 className="font-bold">Safety Tips</h3>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {SAFETY_TIPS.map((t) => (
                <li key={t} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> {t}
                </li>
              ))}
            </ul>
          </GlassCard>
        </>
      )}
    </div>
  );
}
