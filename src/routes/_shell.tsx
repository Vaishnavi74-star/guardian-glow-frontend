import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Link2, Mail, MessageSquare, QrCode, Image as ImageIcon,
  History, User, Settings, LogOut, Menu, X, Bell, Search, ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/scam/Logo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

const NAV = [
  { to: "/dashboard",         label: "Dashboard",  icon: LayoutDashboard },
  { to: "/scan/url",          label: "URL",        icon: Link2 },
  { to: "/scan/email",        label: "Email",      icon: Mail },
  { to: "/scan/whatsapp",     label: "WhatsApp",   icon: MessageSquare },
  { to: "/scan/qr",           label: "QR Code",    icon: QrCode },
  { to: "/scan/screenshot",   label: "Screenshot", icon: ImageIcon },
  { to: "/history",           label: "History",    icon: History },
  { to: "/profile",           label: "Profile",    icon: User },
  { to: "/settings",          label: "Settings",   icon: Settings },
] as const;

function ShellLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 backdrop-blur-2xl">
        <div className="px-5 py-6"><Logo /></div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = path === item.to || (item.to !== "/dashboard" && path.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
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
        </nav>
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
            <nav className="flex-1 space-y-1 px-3">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/5 bg-background/40 px-4 backdrop-blur-2xl md:px-6">
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search scans, URLs, emails..." className="border-white/10 bg-white/5 pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
            </button>
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
