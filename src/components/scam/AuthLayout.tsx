import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/scam/Logo";
import type { ReactNode } from "react";

export function AuthLayout({
  title, subtitle, children, footer,
}: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent/25 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neon/20 blur-3xl" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Left panel */}
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Link to="/"><Logo size="lg" /></Link>
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-black leading-tight">
              Stay one step ahead of <span className="gradient-text">every scam</span>.
            </h2>
            <p className="text-muted-foreground">
              Real-time AI-powered protection across URLs, emails, messages, QR codes and screenshots.
              Built for the era of intelligent threats.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { k: "99.4%", v: "Detection" },
                { k: "2.1M+", v: "Scans" },
                { k: "24/7",  v: "Monitoring" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl p-4 text-center">
                  <div className="gradient-text text-2xl font-black">{s.k}</div>
                  <div className="text-xs text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">© 2026 ScamShield · Trusted by 120k+ users worldwide</div>
        </div>

        {/* Right / form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="glass-strong w-full max-w-md rounded-3xl p-8 sm:p-10"
          >
            <div className="lg:hidden mb-6"><Logo /></div>
            <h1 className="text-2xl font-black tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
