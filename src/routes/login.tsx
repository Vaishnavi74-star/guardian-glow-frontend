import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/scam/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue protecting your digital life."
      footer={<>Don't have an account? <Link to="/register" className="font-semibold text-accent hover:underline">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }}>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input required type="email" placeholder="you@example.com" className="border-white/10 bg-white/5 pl-10 h-11" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Password</Label>
            <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input required type={show ? "text" : "password"} placeholder="••••••••" className="border-white/10 bg-white/5 pl-10 pr-10 h-11" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox /> Remember me for 30 days
        </label>
        <Button type="submit" className="h-11 w-full gradient-primary text-white glow-primary hover:opacity-95">
          Sign in
        </Button>
        <div className="relative py-2 text-center text-xs text-muted-foreground">
          <span className="bg-transparent px-2">or continue with</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="h-11 border-white/10 bg-white/5 hover:bg-white/10">Google</Button>
          <Button type="button" variant="outline" className="h-11 border-white/10 bg-white/5 hover:bg-white/10">GitHub</Button>
        </div>
      </form>
    </AuthLayout>
  );
}
