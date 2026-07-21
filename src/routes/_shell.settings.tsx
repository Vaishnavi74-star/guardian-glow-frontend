import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Shield, Zap, Database } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — ScamShield" }] }),
  component: Settings,
});

function Settings() {
  const [autoscan, setAutoscan] = useState(true);
  const [aggressive, setAggressive] = useState([60]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-xs text-muted-foreground">SETTINGS</div>
        <h1 className="mt-1 text-3xl font-black tracking-tight">System settings</h1>
        <p className="text-sm text-muted-foreground">Configure how ScamShield analyzes and protects you.</p>
      </div>

      <GlassCard>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary"><Shield className="h-5 w-5 text-white" /></div>
          <div><h3 className="font-bold">Protection</h3><p className="text-xs text-muted-foreground">Real-time detection preferences.</p></div>
        </div>
        <Separator className="my-5 bg-white/5" />
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Auto-scan on paste</div><div className="text-xs text-muted-foreground">Detect URLs & scan automatically.</div></div>
            <Switch checked={autoscan} onCheckedChange={setAutoscan} />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div><Label>Sensitivity</Label><div className="text-xs text-muted-foreground">Higher = more aggressive flagging.</div></div>
              <span className="font-mono text-sm font-bold">{aggressive[0]}%</span>
            </div>
            <Slider value={aggressive} onValueChange={setAggressive} max={100} step={5} />
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary"><Globe className="h-5 w-5 text-white" /></div>
          <div><h3 className="font-bold">Region & Language</h3><p className="text-xs text-muted-foreground">Localize threat feeds and UI.</p></div>
        </div>
        <Separator className="my-5 bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <Select defaultValue="in">
              <SelectTrigger className="border-white/10 bg-white/5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary"><Zap className="h-5 w-5 text-white" /></div>
          <div><h3 className="font-bold">Integrations</h3><p className="text-xs text-muted-foreground">Connect ScamShield to your workflow.</p></div>
        </div>
        <Separator className="my-5 bg-white/5" />
        <div className="grid gap-3 sm:grid-cols-2">
          {["Slack","Discord","Chrome Extension","Email Forwarder"].map((n) => (
            <div key={n} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="font-medium text-sm">{n}</div>
              <Switch />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary"><Database className="h-5 w-5 text-white" /></div>
          <div><h3 className="font-bold">Data & Privacy</h3><p className="text-xs text-muted-foreground">Control how your data is stored.</p></div>
        </div>
        <Separator className="my-5 bg-white/5" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Store scan history</div><div className="text-xs text-muted-foreground">Keep results for future reference.</div></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><div className="font-medium">Share anonymized threat data</div><div className="text-xs text-muted-foreground">Improves detection for everyone.</div></div>
            <Switch defaultChecked />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
