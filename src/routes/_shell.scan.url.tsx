import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";

export const Route = createFileRoute("/_shell/scan/url")({
  head: () => ({ meta: [{ title: "URL Scanner — ScamShield" }] }),
  component: UrlScan,
});

function UrlScan() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scan = () => {
    if (!url.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => { setResult(mockAnalyze(url)); setLoading(false); }, 1600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link2 className="h-3.5 w-3.5 text-accent" /> URL SCANNER
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Check if a link is safe</h1>
        <p className="text-sm text-muted-foreground">Paste any URL — we'll analyze reputation, SSL, redirects, and content.</p>
      </div>

      <GlassCard strong>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/suspicious-link"
              className="h-14 border-white/10 bg-white/5 pl-11 text-base"
              onKeyDown={(e) => e.key === "Enter" && scan()}
            />
          </div>
          <Button onClick={scan} disabled={loading || !url.trim()} className="h-14 gradient-primary px-8 text-white glow-primary">
            {loading ? "Scanning..." : "Scan URL"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground">Try:</span>
          {["https://bit.ly/free-crypto-gift", "https://github.com", "paypa1-secure.com/login"].map((s) => (
            <button key={s} onClick={() => setUrl(s)}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10">{s}</button>
          ))}
        </div>
      </GlassCard>

      {loading && <LoadingScan label="Analyzing URL" />}
      {result && <ResultView result={result} />}
    </div>
  );
}
