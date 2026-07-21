export type ScanType = "url" | "email" | "whatsapp" | "qr" | "screenshot";
export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export interface ScanRecord {
  id: string;
  type: ScanType;
  target: string;
  riskScore: number;
  level: RiskLevel;
  timestamp: string;
}

export const RISK_META: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  safe:     { label: "Safe",     color: "text-safe",       bg: "bg-safe/15 border-safe/30" },
  low:      { label: "Low",      color: "text-cyan",       bg: "bg-cyan/15 border-cyan/30" },
  medium:   { label: "Medium",   color: "text-warning",    bg: "bg-warning/15 border-warning/30" },
  high:     { label: "High",     color: "text-danger",     bg: "bg-danger/15 border-danger/30" },
  critical: { label: "Critical", color: "text-destructive",bg: "bg-destructive/20 border-destructive/40" },
};

export function scoreToLevel(score: number): RiskLevel {
  if (score < 20) return "safe";
  if (score < 40) return "low";
  if (score < 60) return "medium";
  if (score < 80) return "high";
  return "critical";
}

export const mockScans: ScanRecord[] = [
  { id: "s1", type: "url",        target: "https://paypa1-secure.com/login",           riskScore: 92, level: "critical", timestamp: "2026-07-21T09:14:00Z" },
  { id: "s2", type: "email",      target: "billing@amaz0n-refunds.io",                 riskScore: 78, level: "high",     timestamp: "2026-07-21T08:42:00Z" },
  { id: "s3", type: "whatsapp",   target: "Congratulations! You won ₹50,000...",       riskScore: 84, level: "critical", timestamp: "2026-07-20T22:10:00Z" },
  { id: "s4", type: "url",        target: "https://github.com/openai",                 riskScore: 8,  level: "safe",     timestamp: "2026-07-20T18:03:00Z" },
  { id: "s5", type: "qr",         target: "qr_payment_2f81.png",                       riskScore: 55, level: "medium",   timestamp: "2026-07-20T14:27:00Z" },
  { id: "s6", type: "screenshot", target: "bank_sms_screenshot.jpg",                   riskScore: 71, level: "high",     timestamp: "2026-07-20T11:11:00Z" },
  { id: "s7", type: "email",      target: "newsletter@stripe.com",                     riskScore: 12, level: "safe",     timestamp: "2026-07-19T20:48:00Z" },
  { id: "s8", type: "url",        target: "https://bit.ly/free-crypto-gift",           riskScore: 88, level: "critical", timestamp: "2026-07-19T16:33:00Z" },
  { id: "s9", type: "whatsapp",   target: "Your KYC is pending, click to update...",   riskScore: 66, level: "high",     timestamp: "2026-07-19T10:09:00Z" },
  { id: "s10",type: "url",        target: "https://vercel.com",                        riskScore: 5,  level: "safe",     timestamp: "2026-07-18T22:00:00Z" },
  { id: "s11",type: "email",      target: "no-reply@dropbox.com",                      riskScore: 22, level: "low",      timestamp: "2026-07-18T15:20:00Z" },
  { id: "s12",type: "qr",         target: "menu_qr_cafe.png",                          riskScore: 10, level: "safe",     timestamp: "2026-07-18T09:15:00Z" },
];

export const threatTrend = [
  { day: "Mon", threats: 12, scans: 48 },
  { day: "Tue", threats: 19, scans: 61 },
  { day: "Wed", threats: 8,  scans: 52 },
  { day: "Thu", threats: 24, scans: 74 },
  { day: "Fri", threats: 17, scans: 68 },
  { day: "Sat", threats: 31, scans: 92 },
  { day: "Sun", threats: 22, scans: 80 },
];

export const threatBreakdown = [
  { name: "Phishing",  value: 42, color: "oklch(0.65 0.24 25)" },
  { name: "Malware",   value: 21, color: "oklch(0.75 0.20 305)" },
  { name: "Scam",      value: 27, color: "oklch(0.80 0.17 80)" },
  { name: "Spam",      value: 10, color: "oklch(0.75 0.18 210)" },
];

export const scanTypeStats = [
  { type: "URL",        count: 184 },
  { type: "Email",      count: 132 },
  { type: "WhatsApp",   count: 96  },
  { type: "QR",         count: 54  },
  { type: "Screenshot", count: 38  },
];

export const suspiciousKeywords = [
  "urgent action required",
  "verify your account",
  "click here immediately",
  "you have won",
  "KYC pending",
  "refund initiated",
  "limited time offer",
];

export function mockUrlAnalysis(url: string) {
  const risky = /bit\.ly|tinyurl|free|gift|verify|login|secure|update|paypa1|amaz0n|-refund/i.test(url);
  const score = risky ? 70 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 20);
  return {
    score,
    level: scoreToLevel(score),
    findings: risky
      ? [
          "Domain mimics a well-known brand (typosquatting).",
          "URL shortener conceals the real destination.",
          "SSL certificate issued < 7 days ago.",
          "Hosted on a bulletproof hosting provider.",
        ]
      : [
          "Valid SSL certificate issued by a trusted CA.",
          "Domain older than 2 years with clean reputation.",
          "No blacklist entries across 40+ threat feeds.",
        ],
    recommendations: risky
      ? [
          "Do NOT enter any credentials on this page.",
          "Report the URL to your IT/security team.",
          "Enable phishing protection in your browser.",
        ]
      : [
          "Site appears safe — proceed with normal caution.",
          "Always verify the URL before entering credentials.",
        ],
  };
}
