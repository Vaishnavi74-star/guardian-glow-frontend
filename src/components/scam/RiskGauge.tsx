import { motion } from "framer-motion";
import { scoreToLevel, RISK_META } from "@/lib/mock-data";

export function RiskGauge({ score, size = 180 }: { score: number; size?: number }) {
  const level = scoreToLevel(score);
  const meta = RISK_META[level];
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const gradientId = "riskGauge";

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.15 210)" />
            <stop offset="50%" stopColor="oklch(0.72 0.22 285)" />
            <stop offset="100%" stopColor="oklch(0.65 0.24 25)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="oklch(1 0 0 / 0.08)" strokeWidth={stroke} fill="none"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={`url(#${gradientId})`} strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-black tracking-tight">{score}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Risk score</div>
        <div className={`mt-2 rounded-full border px-3 py-0.5 text-xs font-semibold ${meta.bg} ${meta.color}`}>
          {meta.label}
        </div>
      </div>
    </div>
  );
}
