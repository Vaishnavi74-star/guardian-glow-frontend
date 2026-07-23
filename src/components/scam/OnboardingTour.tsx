import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowRight, X, ShieldCheck, Layers, Radio, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: ShieldCheck,
    title: "Welcome to ScamShield",
    body: "Your AI-powered guard against phishing, scams, and fraud. Let's take a 30-second tour of what you can do here.",
  },
  {
    icon: Sparkles,
    title: "Six ways to scan",
    body: "URLs, emails, WhatsApp messages, SMS, QR codes, and screenshots. Each scanner runs multi-signal AI analysis and returns a risk score.",
  },
  {
    icon: Layers,
    title: "Bulk & Community",
    body: "Check hundreds of URLs at once with the bulk scanner, or browse the live community feed of scams reported by users worldwide.",
  },
  {
    icon: Command,
    title: "Power-user shortcut",
    body: "Press ⌘K (or Ctrl+K) anywhere to open the command palette and jump to any scanner or page instantly.",
  },
];

const KEY = "scamshield.tour.seen";

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  if (!open) return null;
  const s = STEPS[step];
  const Icon = s.icon;
  const last = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="glass-strong relative w-full max-w-lg overflow-hidden rounded-3xl p-8"
        >
          <button
            onClick={finish}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />

          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary glow-primary">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-8 gradient-primary" : "w-1.5 bg-white/15"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={finish} className="text-xs text-muted-foreground hover:text-foreground">
                  Skip
                </button>
                <Button
                  onClick={() => (last ? finish() : setStep((v) => v + 1))}
                  className="gradient-primary text-white glow-primary"
                >
                  {last ? "Get started" : "Next"} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
