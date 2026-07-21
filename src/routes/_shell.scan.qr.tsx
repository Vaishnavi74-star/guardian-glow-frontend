import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { QrCode, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";

export const Route = createFileRoute("/_shell/scan/qr")({
  head: () => ({ meta: [{ title: "QR Code Scanner — ScamShield" }] }),
  component: QrScan,
});

function QrScan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const onFile = (f: File | null) => {
    if (!f) return;
    setFileName(f.name);
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
    setResult(null);
  };

  const scan = () => {
    if (!preview) return;
    setLoading(true);
    setTimeout(() => {
      const decoded = fileName.includes("payment") ? "upi://pay?pa=fraud@axl&am=9999" : "https://example.com/menu";
      setResult({
        ...mockAnalyze(decoded),
        extras: (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Decoded content</div>
            <div className="mt-1 break-all font-mono text-sm">{decoded}</div>
          </div>
        ),
      });
      setLoading(false);
    }, 1600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><QrCode className="h-3.5 w-3.5 text-accent" /> QR SCANNER</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Scan a QR code image</h1>
        <p className="text-sm text-muted-foreground">Upload a QR — we'll decode and check the destination.</p>
      </div>

      <GlassCard strong>
        {!preview ? (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0] ?? null); }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-12 text-center transition-all hover:border-accent/40 hover:bg-white/[0.04]"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4 font-semibold">Drop QR image or click to browse</div>
            <div className="text-xs text-muted-foreground">PNG, JPG up to 10MB</div>
            <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img src={preview} alt="QR preview" className="aspect-square w-full object-contain" />
              <button onClick={() => { setPreview(null); setResult(null); }} className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 hover:bg-black/80">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Selected file</div>
                <div className="mt-1 font-semibold">{fileName}</div>
              </div>
              <Button onClick={scan} disabled={loading} className="gradient-primary text-white glow-primary">
                {loading ? "Decoding & scanning..." : "Scan QR code"}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {loading && <LoadingScan label="Decoding QR & scanning destination" />}
      {result && <ResultView result={result} />}
    </div>
  );
}
