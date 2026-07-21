import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/scam/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPage });

function ForgotPage() {
  const nav = useNavigate();
  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<><Link to="/login" className="font-semibold text-accent hover:underline">Back to sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/reset-password" }); }}>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input required type="email" placeholder="you@example.com" className="border-white/10 bg-white/5 pl-10 h-11" />
          </div>
        </div>
        <Button className="h-11 w-full gradient-primary text-white glow-primary">Send reset link</Button>
      </form>
    </AuthLayout>
  );
}
