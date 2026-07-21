import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Users, Rocket, Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/scam/Logo";
import { GlassCard } from "@/components/scam/GlassCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ScamShield" },
      { name: "description", content: "The story and mission behind ScamShield." },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: ShieldCheck, title: "Safety first", desc: "We treat every user's security as a personal responsibility." },
  { icon: Sparkles,    title: "AI-native",   desc: "Purpose-built models trained on billions of scam signals." },
  { icon: Users,       title: "Human-friendly", desc: "Security shouldn't feel like homework. Ours is delightful." },
  { icon: Rocket,      title: "Ship fast",    desc: "New threats emerge daily. We ship counter-measures daily too." },
];

const TEAM = [
  { name: "Alex Kumar",  role: "CEO & Co-founder",    init: "AK" },
  { name: "Maya Chen",   role: "CTO & Co-founder",    init: "MC" },
  { name: "Sam Rivera",  role: "Head of AI Research", init: "SR" },
  { name: "Priya Nair",  role: "Head of Design",      init: "PN" },
];

function About() {
  return (
    <div className="min-h-screen">
      <PublicHeader />

      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-accent" /> Our mission
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            Making the internet <span className="gradient-text">safer for everyone</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            ScamShield started in 2024 when a family member lost ₹2 lakhs to a phishing SMS.
            We built the tool we wished had existed — and made it available to millions.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <motion.div key={v.title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary"><v.icon className="h-5 w-5 text-white" /></div>
              <div className="mt-4 font-bold">{v.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center text-3xl font-black tracking-tight">The team</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          A tight crew of security engineers, researchers and designers.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <GlassCard key={m.name} className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl gradient-primary text-xl font-black text-white glow-primary">{m.init}</div>
              <div className="mt-4 font-bold">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.role}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/40 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/dashboard"><Logo /></Link>
        <nav className="hidden gap-6 text-sm md:flex">
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/contact" className="hover:text-accent">Contact</Link>
          <Link to="/dashboard" className="hover:text-accent">Dashboard</Link>
        </nav>
        <Link to="/login" className="rounded-xl gradient-primary px-4 py-2 text-sm font-semibold text-white glow-primary">Sign in</Link>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <Logo size="sm" />
        <div className="text-xs text-muted-foreground">© 2026 ScamShield. All rights reserved.</div>
        <div className="flex gap-3">
          {[Github, Twitter, Linkedin].map((I, i) => (
            <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"><I className="h-4 w-4" /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}
