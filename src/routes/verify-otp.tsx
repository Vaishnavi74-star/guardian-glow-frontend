import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthLayout } from "@/components/scam/AuthLayout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";

export const Route = createFileRoute("/verify-otp")({ component: OtpPage });

function OtpPage() {
  const [code, setCode] = useState("");
  const nav = useNavigate();
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We sent a 6-digit code to a•••@example.com"
      footer={<>Didn't get it? <button className="font-semibold text-accent hover:underline">Resend in 42s</button></>}
    >
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }}>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0,1,2,3,4,5].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-14 w-12 border-white/15 bg-white/5 text-xl" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="h-11 w-full gradient-primary text-white glow-primary" disabled={code.length < 6}>
          Verify & continue
        </Button>
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/login" className="hover:text-foreground">Use a different account</Link>
        </div>
      </form>
    </AuthLayout>
  );
}
