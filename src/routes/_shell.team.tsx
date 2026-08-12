import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users2, UserPlus, Shield, Crown, Eye, MoreHorizontal, Activity, Mail, Trash2, Check,
} from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/team")({
  head: () => ({
    meta: [
      { title: "Team & Workspace — ScamShield" },
      { name: "description", content: "Manage workspace members, roles and permissions, pending invites and the workspace audit log." },
      { property: "og:title", content: "ScamShield Team & Workspace" },
      { property: "og:description", content: "Roles, permissions, invites and audit logging for your security workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Team,
});

type Role = "Owner" | "Admin" | "Analyst" | "Viewer";

interface Member {
  id: string;
  name: string;
  email: string;
  init: string;
  role: Role;
  scans: number;
  lastActive: string;
  status: "active" | "invited";
}

const ROLE_META: Record<Role, { icon: typeof Crown; className: string; desc: string }> = {
  Owner:   { icon: Crown,  className: "text-warning bg-warning/15 border-warning/30", desc: "Full control including billing and workspace deletion." },
  Admin:   { icon: Shield, className: "text-primary bg-primary/15 border-primary/30", desc: "Manage members, API keys, integrations and alert policies." },
  Analyst: { icon: Activity, className: "text-cyan bg-cyan/15 border-cyan/30", desc: "Run scans, triage alerts, resolve incidents, export reports." },
  Viewer:  { icon: Eye,    className: "text-muted-foreground bg-white/10 border-white/15", desc: "Read-only access to dashboards, reports and history." },
};

const INITIAL: Member[] = [
  { id: "m1", name: "Alex Kumar",  email: "alex@scamshield.dev",  init: "AK", role: "Owner",   scans: 1284, lastActive: "2 min ago",  status: "active" },
  { id: "m2", name: "Maya Chen",   email: "maya@scamshield.dev",  init: "MC", role: "Admin",   scans: 962,  lastActive: "18 min ago", status: "active" },
  { id: "m3", name: "Sam Rivera",  email: "sam@scamshield.dev",   init: "SR", role: "Analyst", scans: 741,  lastActive: "1 hr ago",   status: "active" },
  { id: "m4", name: "Priya Nair",  email: "priya@scamshield.dev", init: "PN", role: "Analyst", scans: 508,  lastActive: "Yesterday",  status: "active" },
  { id: "m5", name: "Devin Osei",  email: "devin@contractor.io",  init: "DO", role: "Viewer",  scans: 24,   lastActive: "3 days ago", status: "active" },
  { id: "m6", name: "Lena Fischer", email: "lena@scamshield.dev", init: "LF", role: "Analyst", scans: 0,    lastActive: "Invite sent", status: "invited" },
];

const AUDIT = [
  { who: "Maya Chen",  what: "revoked API key sk_live_…8f2c", when: "12 min ago" },
  { who: "Alex Kumar", what: "changed Devin Osei's role to Viewer", when: "1 hr ago" },
  { who: "Sam Rivera", what: "resolved 14 critical alerts", when: "3 hrs ago" },
  { who: "System",     what: "auto-blocked sbi-secure-kyc.co.in workspace-wide", when: "5 hrs ago" },
  { who: "Priya Nair", what: "exported monthly compliance report", when: "Yesterday" },
  { who: "Alex Kumar", what: "invited lena@scamshield.dev as Analyst", when: "Yesterday" },
];

function Team() {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Analyst");
  const [sent, setSent] = useState(false);

  const invite = () => {
    if (!email.includes("@")) return;
    const init = email.slice(0, 2).toUpperCase();
    setMembers((m) => [
      ...m,
      {
        id: `m${Date.now()}`,
        name: email.split("@")[0],
        email,
        init,
        role,
        scans: 0,
        lastActive: "Invite sent",
        status: "invited",
      },
    ]);
    setEmail("");
    setSent(true);
    setTimeout(() => setSent(false), 1800);
  };

  const changeRole = (id: string, next: Role) =>
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, role: next } : x)));

  const remove = (id: string) => setMembers((m) => m.filter((x) => x.id !== id));

  const seats = members.filter((m) => m.status === "active").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <Users2 className="h-6 w-6 text-primary" /> Team &amp; Workspace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ScamShield Business · {seats} of 10 seats used · SSO enforced
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs">
          <span className="text-muted-foreground">Workspace ID </span>
          <span className="font-mono">ws_9f31d0a4</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(ROLE_META) as Role[]).map((r, i) => {
          const meta = ROLE_META[r];
          const count = members.filter((m) => m.role === r).length;
          return (
            <GlassCard key={r} transition={{ delay: i * 0.05 }} className="p-5">
              <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", meta.className)}>
                <meta.icon className="h-3.5 w-3.5" /> {r}
              </div>
              <div className="mt-3 text-2xl font-bold">{count}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="h-4 w-4 text-primary" /> Invite a teammate
        </h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="flex-1 border-white/10 bg-white/5"
          />
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
            {(["Admin", "Analyst", "Viewer"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  role === r ? "gradient-primary text-white" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <Button onClick={invite} className="gap-2 gradient-primary text-white">
            {sent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            {sent ? "Invite sent" : "Send invite"}
          </Button>
        </div>
      </GlassCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 overflow-hidden">
          <h2 className="text-sm font-semibold">Members</h2>
          <div className="mt-4 space-y-2">
            {members.map((m, i) => {
              const meta = ROLE_META[m.role];
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary text-xs font-bold text-white">
                    {m.init}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{m.name}</span>
                      {m.status === "invited" && (
                        <span className="rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    <div>{m.scans.toLocaleString()} scans</div>
                    <div>{m.lastActive}</div>
                  </div>
                  <select
                    value={m.role}
                    disabled={m.role === "Owner"}
                    onChange={(e) => changeRole(m.id, e.target.value as Role)}
                    className={cn(
                      "rounded-lg border bg-transparent px-2 py-1 text-xs font-semibold outline-none disabled:opacity-60",
                      meta.className,
                    )}
                  >
                    {(Object.keys(ROLE_META) as Role[]).map((r) => (
                      <option key={r} value={r} className="bg-background text-foreground">{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => remove(m.id)}
                    disabled={m.role === "Owner"}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-destructive disabled:opacity-30"
                    aria-label={`Remove ${m.name}`}
                  >
                    {m.role === "Owner" ? <MoreHorizontal className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Activity className="h-4 w-4 text-primary" /> Audit log
          </h2>
          <div className="mt-4 space-y-4">
            {AUDIT.map((a, i) => (
              <div key={i} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full gradient-primary" />
                {i < AUDIT.length - 1 && <span className="absolute left-[3px] top-4 h-full w-px bg-white/10" />}
                <div className="text-sm">
                  <span className="font-semibold">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                </div>
                <div className="text-xs text-muted-foreground">{a.when}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
