import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Flame, Target, Trophy, Zap, Star, Crown, Eye, Lock } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { achievements, type Achievement } from "@/lib/extra-mock-data";

export const Route = createFileRoute("/_shell/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — ScamShield" },
      { name: "description", content: "Track your scanning streaks, badges, and safety milestones." },
      { property: "og:title", content: "ScamShield Achievements & Streaks" },
      { property: "og:description", content: "Track your scanning streaks, badges, and safety milestones." },
    ],
  }),
  component: Achievements,
});

const ICON_MAP = { shield: Shield, flame: Flame, target: Target, trophy: Trophy, zap: Zap, star: Star, crown: Crown, eye: Eye };

const RARITY_CLS: Record<Achievement["rarity"], { border: string; glow: string; text: string; bg: string }> = {
  common:    { border: "border-cyan/40",       glow: "shadow-[0_0_30px_-8px_var(--cyan)]",      text: "text-cyan",       bg: "bg-cyan/10" },
  rare:      { border: "border-primary/50",    glow: "shadow-[0_0_35px_-8px_var(--primary)]",   text: "text-primary",    bg: "bg-primary/10" },
  epic:      { border: "border-accent/50",     glow: "shadow-[0_0_35px_-8px_var(--accent)]",    text: "text-accent",     bg: "bg-accent/10" },
  legendary: { border: "border-warning/60",    glow: "shadow-[0_0_45px_-6px_var(--warning)]",   text: "text-warning",    bg: "bg-warning/10" },
};

function Achievements() {
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const pct = Math.round((unlocked / total) * 100);
  const streak = 12;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="h-3.5 w-3.5 text-accent" /> ACHIEVEMENTS
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Your safety journey</h1>
        <p className="text-sm text-muted-foreground">Unlock badges as you protect yourself and the community.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Current Streak</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Flame className="h-8 w-8 text-warning" />
            <span className="text-4xl font-black gradient-text">{streak}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">days scanning in a row</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Badges Unlocked</div>
          <div className="mt-2 text-4xl font-black">{unlocked}<span className="text-muted-foreground text-2xl">/{total}</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{pct}% complete</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Global Rank</div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-warning" />
            <span className="text-4xl font-black">#847</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">top 3% of scanners</div>
        </GlassCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a, i) => {
          const Icon = ICON_MAP[a.icon];
          const cls = RARITY_CLS[a.rarity];
          const pct = Math.min(100, Math.round((a.progress / a.goal) * 100));
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`glass relative overflow-hidden rounded-2xl border p-5 transition-all ${
                a.unlocked ? `${cls.border} ${cls.glow}` : "border-white/10 opacity-70"
              }`}
            >
              {a.unlocked && (
                <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${cls.bg} blur-2xl`} />
              )}
              <div className="relative">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${a.unlocked ? cls.bg : "bg-white/5"}`}>
                  {a.unlocked ? (
                    <Icon className={`h-7 w-7 ${cls.text}`} />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-bold">{a.title}</div>
                  <span className={`ml-auto rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-wider ${cls.border} ${cls.text}`}>
                    {a.rarity}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.description}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full transition-all ${a.unlocked ? "gradient-primary" : "bg-white/20"}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 text-[11px] font-mono text-muted-foreground">
                  {a.progress} / {a.goal}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
