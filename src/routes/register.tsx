import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/scam/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Check } from "lucide-react";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const nav = useNavigate();
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. Upgrade anytime."
      footer={<>Already have one? <Link to="/login" className="font-semibold text-accent hover:underline">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/verify-otp" }); }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>First name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input required placeholder="Alex" className="border-white/10 bg-white/5 pl-10 h-11" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Last name</Label>
            <Input required placeholder="Kumar" className="border-white/10 bg-white/5 h-11" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input required type="email" placeholder="you@example.com" className="border-white/10 bg-white/5 pl-10 h-11" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input required type="password" placeholder="Min 8 characters" className="border-white/10 bg-white/5 pl-10 h-11" />
          </div>
          <ul className="grid grid-cols-2 gap-1 pt-1 text-xs text-muted-foreground">
            {["8+ characters", "1 uppercase", "1 number", "1 symbol"].map((r) => (
              <li key={r} className="flex items-center gap-1"><Check className="h-3 w-3 text-safe" /> {r}</li>
            ))}
          </ul>
        </div>
        <Button type="submit" className="h-11 w-full gradient-primary text-white glow-primary hover:opacity-95">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
