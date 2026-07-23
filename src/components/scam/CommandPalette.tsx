import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, Link2, Mail, MessageSquare, QrCode, Image as ImageIcon,
  History, User, Settings, Layers, Radio, Puzzle, KeyRound, Trophy, Info, PhoneCall,
} from "lucide-react";

const ROUTES = [
  { to: "/dashboard",       label: "Dashboard",           icon: LayoutDashboard, group: "Navigate" },
  { to: "/scan/url",        label: "URL Scanner",         icon: Link2,           group: "Scan" },
  { to: "/scan/email",      label: "Email Scanner",       icon: Mail,            group: "Scan" },
  { to: "/scan/sms",        label: "SMS / Text Scanner",  icon: PhoneCall,       group: "Scan" },
  { to: "/scan/whatsapp",   label: "WhatsApp Scanner",    icon: MessageSquare,   group: "Scan" },
  { to: "/scan/qr",         label: "QR Code Scanner",     icon: QrCode,          group: "Scan" },
  { to: "/scan/screenshot", label: "Screenshot Scanner",  icon: ImageIcon,       group: "Scan" },
  { to: "/bulk",            label: "Bulk URL Scanner",    icon: Layers,          group: "Scan" },
  { to: "/community",       label: "Community Threat Feed", icon: Radio,         group: "Explore" },
  { to: "/achievements",    label: "Achievements",        icon: Trophy,          group: "Explore" },
  { to: "/extension",       label: "Browser Extension",   icon: Puzzle,          group: "Explore" },
  { to: "/api-keys",        label: "API Keys",            icon: KeyRound,        group: "Developer" },
  { to: "/history",         label: "Scan History",        icon: History,         group: "Account" },
  { to: "/profile",         label: "Profile",             icon: User,            group: "Account" },
  { to: "/settings",        label: "Settings",            icon: Settings,        group: "Account" },
  { to: "/about",           label: "About ScamShield",    icon: Info,            group: "Account" },
] as const;

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const groups = ["Navigate", "Scan", "Explore", "Developer", "Account"] as const;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((g, i) => {
          const items = ROUTES.filter((r) => r.group === g);
          if (!items.length) return null;
          return (
            <div key={g}>
              {i > 0 && <CommandSeparator />}
              <CommandGroup heading={g}>
                {items.map((r) => (
                  <CommandItem
                    key={r.to}
                    onSelect={() => {
                      onOpenChange(false);
                      navigate({ to: r.to });
                    }}
                  >
                    <r.icon className="mr-2 h-4 w-4" />
                    <span>{r.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
