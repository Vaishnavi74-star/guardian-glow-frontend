import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, ShieldAlert, Zap, Radio, Info, Check } from "lucide-react";
import { mockNotifications, type Notification } from "@/lib/extra-mock-data";
import { cn } from "@/lib/utils";

const ICONS = {
  threat:    { Icon: ShieldAlert, cls: "text-danger bg-danger/15" },
  scan:      { Icon: Zap,         cls: "text-accent bg-accent/15" },
  community: { Icon: Radio,       cls: "text-cyan bg-cyan/15" },
  system:    { Icon: Info,        cls: "text-primary bg-primary/15" },
} as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationsCenter() {
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const unread = items.filter((i) => !i.read).length;

  const markAll = () => setItems((prev) => prev.map((i) => ({ ...i, read: true })));
  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] border-white/10 bg-sidebar/95 p-0 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <div className="text-sm font-bold">Notifications</div>
            <div className="text-[11px] text-muted-foreground">{unread} unread</div>
          </div>
          <button onClick={markAll} className="flex items-center gap-1 text-xs text-accent hover:underline">
            <Check className="h-3 w-3" /> Mark all read
          </button>
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          {items.map((n) => {
            const { Icon, cls } = ICONS[n.type];
            return (
              <button
                key={n.id}
                onClick={() => toggle(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left hover:bg-white/5 transition-colors",
                  !n.read && "bg-white/[0.03]",
                )}
              >
                <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", cls)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-semibold">{n.title}</div>
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">{n.message}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{timeAgo(n.timestamp)}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="border-t border-white/5 px-4 py-2 text-center">
          <button className="text-xs text-accent hover:underline">View all notifications</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
