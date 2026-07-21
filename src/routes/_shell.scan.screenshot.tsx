import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, ScanText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/scam/GlassCard";
import { LoadingScan, ResultView, mockAnalyze, type ScanResult } from "@/components/scam/ScannerShared";

export const Route = createFileRoute("/_shell/scan/screenshot")({
  head: () => ({ meta: [{ title: "Screenshot Scanner — ScamShield" }] }),
  component: ScreenScan,
});

const MOCK_OCR = `URGENT: Your ICICI account has been temporarily suspended
due to unusual activity. To re-activate, verify your KYC now:
https://icici-secure-verify.co/kyc

Failure to comply within 24 hours will result in permanent
account closure. — Security Team`;

function ScreenScan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [ocr, setOcr] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const onFile = (f: File | null) => {
    if (!f) return;
    setFileName(f.name);
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
    setResult(null); setOcr("");
  };

  const scan = () => {
    if (!preview) return;
    setLoading(true);
    setTimeout(() => {
      setOcr(MOCK_OCR);
      setResult(mockAnalyze(MOCK_OCR + " verify urgent kyc"));
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><ImageIcon className="h-3.5 w-3.5 text-accent" /> SCREENSHOT SCANNER</div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Analyze scam screenshots</h1>
        <p className="text-sm text-muted-foreground">Upload an SMS / chat / email screenshot — OCR + AI will inspect it.</p>
      </div>

      <GlassCard strong>
        {!preview ? (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0] ?? null); }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-12 text-center hover:border-accent/40 hover:bg-white/[0.04]"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="mt-4 font-semibold">Drop screenshot or click to browse</div>
            <div className="text-xs text-muted-foreground">PNG, JPG, HEIC up to 20MB</div>
            <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </label>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img src={preview} alt="Screenshot preview" className="w-full object-contain" />
              <button onClick={() => { setPreview(null); setResult(null); setOcr(""); }}
                className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 hover:bg-black/80">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Selected file</div>
                <div className="mt-1 font-semibold">{fileName}</div>
                {ocr && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <ScanText className="h-3.5 w-3.5" /> Extracted text (OCR)
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed">{ocr}</pre>
                  </div>
                )}
              </div>
              <Button onClick={scan} disabled={loading} className="gradient-primary text-white glow-primary">
                {loading ? "Running OCR + AI analysis..." : "Analyze screenshot"}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      {loading && <LoadingScan label="Extracting text & analyzing" />}
      {result && <ResultView result={result} />}
    </div>
  );
}
