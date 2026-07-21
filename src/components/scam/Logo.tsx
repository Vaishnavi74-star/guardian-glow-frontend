import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-base" },
    md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-lg" },
    lg: { box: "h-14 w-14", icon: "h-7 w-7", text: "text-2xl" },
  }[size];
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className={cn("gradient-primary grid place-items-center rounded-xl glow-primary", sizes.box)}>
        <ShieldCheck className={cn("text-white", sizes.icon)} />
      </div>
      <span className={cn("font-black tracking-tight gradient-text", sizes.text)}>
        ScamShield
      </span>
    </div>
  );
}
