import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneCall, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";
import { suspiciousKeywords } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/scan/sms")({
  head: () => ({
    meta: [
      { title: "SMS Scanner — ScamShield" },
      { name: "description", content: "Detect smishing texts, fake OTP requests, and premium-rate SMS scams." },
      { property: "og:title", content: "SMS Scanner — ScamShield" },
      { property: "og:description", content: "Detect smishing texts, fake OTP requests, and premium-rate SMS scams." },
    ],
  }),
  component: SmsScan,
});

const SAMPLES = [
  { sender: "VM-HDFCBK", body: "Your HDFC account will be suspended today. Verify KYC: http://hdfc-kyc-verify.co/pending" },
  { sender: "+91 98999 12341", body: "Congrats! You won a Rs 25,000 Amazon gift card. Claim: http://amzn-gift.win/claim" },
  { sender: "AD-DELIVER", body: "Your package is on hold. Pay ₹28 customs fee: https://india-post-track.top/pay" },
];

function SmsScan() {
  const [sender, setSender] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const matched = suspiciousKeywords.filter((k) => body.toLowerCase().includes(k.toLowerCase()));
  const senderRisk = /^[A-Z]{2}-|^\+?\d{10,}$/.test(sender.trim()) === false && sender.trim().length > 0;

  const scan = () => {
    if (!body.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const r = mockAnalyze(body + " " + sender + (matched.length ? " urgent verify" : ""));
      setResult({
        ...r,
        extras: (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sender analysis</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-mono">{sender || "(no sender)"}</span>
                {senderRisk && (
                  <span className="rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-xs text-warning">
                    Unrecognized format
                  </span>
                )}
              </div>
            </div>
            {matched.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suspicious phrases detected</div>
                <div className="flex flex-wrap gap-2">
                  {matched.map((k) => (
                    <span key={k} className="flex items-center gap-1 rounded-full border border-danger/40 bg-danger/15 px-2.5 py-1 text-xs text-danger">
                      <AlertTriangle className="h-3 w-3" /> {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      });
      setLoading(false);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PhoneCall className="h-3.5 w-3.5 text-accent" /> SMS / TEXT SCANNER
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Analyze suspicious text messages</h1>
        <p className="text-sm text-muted-foreground">Paste the sender ID and full message body — we check for smishing patterns.</p>
      </div>

      <GlassCard strong>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sender</label>
        <Input
          value={sender} onChange={(e) => setSender(e.target.value)}
          placeholder="+91 98xxx xxxxx or VM-HDFCBK"
          className="mt-1.5 border-white/10 bg-white/5"
        />
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message body</label>
        <Textarea
          value={body} onChange={(e) => setBody(e.target.value)}
          placeholder="Your account will be blocked. Click here to verify KYC..."
          className="mt-1.5 min-h-[160px] border-white/10 bg-white/5 font-mono text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground">Try:</span>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSender(s.sender); setBody(s.body); }}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10"
            >
              {s.sender}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{body.length} characters</div>
          <Button onClick={scan} disabled={loading || !body.trim()} className="gradient-primary px-6 text-white glow-primary">
            {loading ? "Analyzing..." : "Analyze SMS"}
          </Button>
        </div>
      </GlassCard>

      {loading && <LoadingScan label="Analyzing SMS" />}
      {result && <ResultView result={result} />}
    </div>
  );
}
