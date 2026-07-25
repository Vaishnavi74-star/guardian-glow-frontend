import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Link2, Mail, MessageSquare, QrCode, Image as ImageIcon,
  History, User, Settings, LogOut, Menu, X, Search, ShieldCheck,
  Layers, Radio, Puzzle, KeyRound, Trophy, PhoneCall, Command, ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/scam/Logo";
import { Input } from "@/components/ui/input";
import { CommandPalette } from "@/components/scam/CommandPalette";
import { NotificationsCenter } from "@/components/scam/NotificationsCenter";
import { OnboardingTour } from "@/components/scam/OnboardingTour";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Scanners",
    items: [
      { to: "/scan/url",        label: "URL",        icon: Link2 },
      { to: "/scan/email",      label: "Email",      icon: Mail },
      { to: "/scan/sms",        label: "SMS",        icon: PhoneCall },
      { to: "/scan/whatsapp",   label: "WhatsApp",   icon: MessageSquare },
      { to: "/scan/qr",         label: "QR Code",    icon: QrCode },
      { to: "/scan/screenshot", label: "Screenshot", icon: ImageIcon },
      { to: "/bulk",            label: "Bulk URLs",  icon: Layers },
    ],
  },
  {
    label: "Explore",
    items: [
      { to: "/community",    label: "Community",   icon: Radio },
      { to: "/achievements", label: "Achievements", icon: Trophy },
      { to: "/extension",    label: "Extension",   icon: Puzzle },
      { to: "/api-keys",     label: "API Keys",    icon: KeyRound },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/history",  label: "History",  icon: History },
      { to: "/profile",  label: "Profile",  icon: User },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function ShellLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const renderNav = (onClick?: () => void) =>
    NAV_GROUPS.map((group) => (
      <div key={group.label} className="mb-4">
        <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {group.label}
        </div>
        <div className="space-y-1">
          {group.items.map((item) => {
            const active =
              path === item.to ||
              (item.to !== "/dashboard" && path.startsWith(item.to) && item.to.split("/").length > 1);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClick}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-white/10 text-foreground shadow-inner"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full gradient-primary"
                  />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    ));

  return (
    <div className="flex min-h-screen w-full">
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <OnboardingTour />

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 backdrop-blur-2xl">
        <div className="px-5 py-6"><Logo /></div>
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3">{renderNav()}</nav>
        <div className="p-3">
          <Link to="/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            className="relative flex h-full w-72 flex-col bg-sidebar/95 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
            </div>
            <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-6">{renderNav(() => setMobileOpen(false))}</nav>
          </motion.aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/5 bg-background/40 px-4 backdrop-blur-2xl md:px-6">
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <button
            onClick={() => setCmdOpen(true)}
            className="relative hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/10 md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1">Search or run a command...</span>
            <kbd className="flex items-center gap-0.5 rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <NotificationsCenter />
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-lg gradient-primary text-xs font-bold text-white">AK</div>
              <div className="text-xs">
                <div className="font-semibold leading-tight">Alex Kumar</div>
                <div className="flex items-center gap-1 text-muted-foreground"><ShieldCheck className="h-3 w-3 text-safe" /> Pro</div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
