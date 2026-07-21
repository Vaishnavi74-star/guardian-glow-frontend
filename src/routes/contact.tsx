import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { GlassCard } from "@/components/scam/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "./about";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ScamShield" },
      { name: "description", content: "Get in touch with the ScamShield team." },
    ],
  }),
  component: Contact,
});

const INFO = [
  { icon: Mail, label: "Email",   value: "hello@scamshield.io" },
  { icon: Phone, label: "Phone",  value: "+91 80 4711 2200" },
  { icon: MapPin, label: "Office", value: "Bengaluru · Singapore · Berlin" },
  { icon: MessageSquare, label: "Live chat", value: "Mon–Fri · 9am–8pm IST" },
];

function Contact() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs text-muted-foreground">GET IN TOUCH</div>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            We'd love to <span className="gradient-text">hear from you</span>.
          </h1>
          <p className="mt-4 text-muted-foreground">Questions, partnerships or press? Drop us a note.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            {INFO.map((i) => (
              <GlassCard key={i.label} className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary"><i.icon className="h-5 w-5 text-white" /></div>
                <div>
                  <div className="text-xs text-muted-foreground">{i.label}</div>
                  <div className="font-semibold">{i.value}</div>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="lg:col-span-3" strong>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Name</Label><Input className="border-white/10 bg-white/5" placeholder="Your name" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" className="border-white/10 bg-white/5" placeholder="you@example.com" /></div>
              </div>
              <div className="space-y-2"><Label>Subject</Label><Input className="border-white/10 bg-white/5" placeholder="How can we help?" /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea rows={6} className="border-white/10 bg-white/5" placeholder="Tell us more..." /></div>
              <Button className="w-full gradient-primary text-white glow-primary">Send message</Button>
            </form>
          </GlassCard>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
