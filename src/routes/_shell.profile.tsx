import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Bell, Moon, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({ meta: [{ title: "Profile — ScamShield" }] }),
  component: Profile,
});

function Section({ icon: Icon, title, desc, children }: { icon: typeof User; title: string; desc: string; children: React.ReactNode }) {
  return (
    <GlassCard>
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary"><Icon className="h-5 w-5 text-white" /></div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Separator className="my-5 bg-white/5" />
      {children}
    </GlassCard>
  );
}

function Profile() {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState({ email: true, push: true, weekly: false });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">USER PROFILE</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Account & preferences</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="md:col-span-1 flex flex-col items-center text-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl gradient-primary text-3xl font-black text-white glow-primary">AK</div>
          <div className="mt-4 text-lg font-bold">Alex Kumar</div>
          <div className="text-xs text-muted-foreground">alex.kumar@example.com</div>
          <div className="mt-3 rounded-full border border-safe/30 bg-safe/15 px-3 py-1 text-xs text-safe">Pro plan · Active</div>
          <Button variant="outline" size="sm" className="mt-6 border-white/10 bg-white/5 hover:bg-white/10">Change photo</Button>
        </GlassCard>

        <div className="md:col-span-2 space-y-6">
          <Section icon={User} title="Personal Information" desc="Update your profile details.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>First name</Label><Input defaultValue="Alex" className="border-white/10 bg-white/5" /></div>
              <div className="space-y-2"><Label>Last name</Label><Input defaultValue="Kumar" className="border-white/10 bg-white/5" /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Email</Label><Input defaultValue="alex.kumar@example.com" className="border-white/10 bg-white/5" /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" className="border-white/10 bg-white/5" /></div>
            </div>
            <div className="mt-5 flex justify-end"><Button className="gradient-primary text-white">Save changes</Button></div>
          </Section>

          <Section icon={Lock} title="Change Password" desc="Use a strong, unique password.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2"><Label>Current password</Label><Input type="password" className="border-white/10 bg-white/5" /></div>
              <div className="space-y-2"><Label>New password</Label><Input type="password" className="border-white/10 bg-white/5" /></div>
              <div className="space-y-2"><Label>Confirm</Label><Input type="password" className="border-white/10 bg-white/5" /></div>
            </div>
            <div className="mt-5 flex justify-end"><Button className="gradient-primary text-white">Update password</Button></div>
          </Section>

          <Section icon={Bell} title="Notification Settings" desc="Choose how we reach you.">
            {[
              { k: "email", label: "Email alerts", desc: "Critical threats & weekly reports" },
              { k: "push",  label: "Push notifications", desc: "Real-time browser alerts" },
              { k: "weekly",label: "Weekly digest", desc: "Summary every Monday" },
            ].map((n) => (
              <div key={n.k} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div><div className="font-medium">{n.label}</div><div className="text-xs text-muted-foreground">{n.desc}</div></div>
                <Switch checked={(notif as Record<string, boolean>)[n.k]} onCheckedChange={(v) => setNotif({ ...notif, [n.k]: v })} />
              </div>
            ))}
          </Section>

          <Section icon={Moon} title="Appearance" desc="Interface preferences.">
            <div className="flex items-center justify-between">
              <div><div className="font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Optimized for cyber-hours coding.</div></div>
              <Switch checked={dark} onCheckedChange={setDark} />
            </div>
          </Section>

          <Section icon={Trash2} title="Danger Zone" desc="Irreversible actions.">
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4">
              <div className="font-semibold text-danger">Delete account</div>
              <p className="mt-1 text-xs text-muted-foreground">Permanently removes your data, scans and history.</p>
              <Button variant="destructive" className="mt-3" size="sm">Delete my account</Button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
