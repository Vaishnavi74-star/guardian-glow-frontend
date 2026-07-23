import type { RiskLevel } from "./mock-data";

export interface CommunityReport {
  id: string;
  reporter: string;
  avatar: string;
  target: string;
  category: "Phishing" | "Scam Call" | "Investment Fraud" | "Fake Store" | "Romance Scam" | "Job Fraud";
  description: string;
  level: RiskLevel;
  upvotes: number;
  reports: number;
  timestamp: string;
}

export const communityReports: CommunityReport[] = [
  {
    id: "c1",
    reporter: "Priya S.",
    avatar: "PS",
    target: "https://sbi-secure-kyc.co.in",
    category: "Phishing",
    description: "Fake SBI KYC page harvesting credentials + OTP. Received via SMS claiming account will be frozen.",
    level: "critical",
    upvotes: 342,
    reports: 89,
    timestamp: "2026-07-23T08:12:00Z",
  },
  {
    id: "c2",
    reporter: "Marcus T.",
    avatar: "MT",
    target: "+1 (415) 555-0138",
    category: "Scam Call",
    description: "Robocall pretending to be IRS threatening arrest unless you pay in gift cards. Classic tax scam.",
    level: "high",
    upvotes: 218,
    reports: 54,
    timestamp: "2026-07-23T06:44:00Z",
  },
  {
    id: "c3",
    reporter: "Aisha K.",
    avatar: "AK",
    target: "cryptox-doubler.io",
    category: "Investment Fraud",
    description: "Promises to double your Bitcoin in 24h. Elon Musk deepfake video on their landing page.",
    level: "critical",
    upvotes: 512,
    reports: 141,
    timestamp: "2026-07-22T22:10:00Z",
  },
  {
    id: "c4",
    reporter: "Ravi M.",
    avatar: "RM",
    target: "wireless-airpods-deals.shop",
    category: "Fake Store",
    description: "AirPods for $19. Ships nothing, charges card, disappears in 3 weeks. Cloned Shopify template.",
    level: "high",
    upvotes: 176,
    reports: 63,
    timestamp: "2026-07-22T18:03:00Z",
  },
  {
    id: "c5",
    reporter: "Elena V.",
    avatar: "EV",
    target: "hire-fast-remote.jobs",
    category: "Job Fraud",
    description: "Fake 'remote data entry' job asking for $200 upfront for training kit. No real employer exists.",
    level: "medium",
    upvotes: 94,
    reports: 27,
    timestamp: "2026-07-22T14:27:00Z",
  },
  {
    id: "c6",
    reporter: "Jordan B.",
    avatar: "JB",
    target: "match-me-love.app",
    category: "Romance Scam",
    description: "Bot accounts on this dating platform quickly move to WhatsApp then ask for emergency travel money.",
    level: "high",
    upvotes: 133,
    reports: 42,
    timestamp: "2026-07-22T11:11:00Z",
  },
];

export interface Notification {
  id: string;
  type: "threat" | "scan" | "system" | "community";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  { id: "n1", type: "threat", title: "Critical threat blocked", message: "paypa1-secure.com attempted access from your network.", timestamp: "2026-07-23T09:14:00Z", read: false },
  { id: "n2", type: "scan", title: "Scan complete", message: "Your bulk URL scan of 24 links finished — 3 threats found.", timestamp: "2026-07-23T08:22:00Z", read: false },
  { id: "n3", type: "community", title: "New community report", message: "Fake SBI KYC page trending — 89 users reported it today.", timestamp: "2026-07-23T07:55:00Z", read: false },
  { id: "n4", type: "system", title: "Weekly digest ready", message: "You scanned 47 items this week. Safety score: 87%.", timestamp: "2026-07-22T20:00:00Z", read: true },
  { id: "n5", type: "threat", title: "Suspicious QR code", message: "A QR you scanned yesterday redirects to a phishing UPI handle.", timestamp: "2026-07-22T14:12:00Z", read: true },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "flame" | "target" | "trophy" | "zap" | "star" | "crown" | "eye";
  progress: number;
  goal: number;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const achievements: Achievement[] = [
  { id: "a1", title: "First Line of Defense",  description: "Complete your first scan.",              icon: "shield", progress: 1,   goal: 1,   unlocked: true,  rarity: "common" },
  { id: "a2", title: "7-Day Streak",            description: "Scan something every day for a week.",   icon: "flame",  progress: 7,   goal: 7,   unlocked: true,  rarity: "rare" },
  { id: "a3", title: "Threat Hunter",           description: "Detect 50 malicious targets.",           icon: "target", progress: 34,  goal: 50,  unlocked: false, rarity: "rare" },
  { id: "a4", title: "Community Guardian",      description: "Report 10 scams to the community feed.", icon: "eye",    progress: 4,   goal: 10,  unlocked: false, rarity: "epic" },
  { id: "a5", title: "Century Scanner",         description: "Reach 100 total scans.",                 icon: "zap",    progress: 87,  goal: 100, unlocked: false, rarity: "epic" },
  { id: "a6", title: "Bulk Master",             description: "Scan 50+ URLs in a single bulk run.",    icon: "trophy", progress: 24,  goal: 50,  unlocked: false, rarity: "epic" },
  { id: "a7", title: "Perfect Week",            description: "Zero threats detected across a week.",   icon: "star",   progress: 0,   goal: 1,   unlocked: false, rarity: "legendary" },
  { id: "a8", title: "Cyber Sentinel",          description: "Reach a 30-day scanning streak.",        icon: "crown",  progress: 12,  goal: 30,  unlocked: false, rarity: "legendary" },
];

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  scopes: string[];
  requests: number;
}

export const mockApiKeys: ApiKey[] = [
  { id: "k1", name: "Production Web",    key: "sk_live_a92f••••••••••••••••••••8d1c", createdAt: "2026-05-14", lastUsed: "2 minutes ago", scopes: ["scan:url", "scan:email", "read:history"], requests: 148213 },
  { id: "k2", name: "Mobile iOS Client", key: "sk_live_b41e••••••••••••••••••••2c98", createdAt: "2026-06-02", lastUsed: "17 minutes ago", scopes: ["scan:url", "scan:qr"], requests: 72841 },
  { id: "k3", name: "CI Testing",        key: "sk_test_f77c••••••••••••••••••••61ab", createdAt: "2026-07-11", lastUsed: "3 hours ago", scopes: ["scan:url"], requests: 3120 },
];
