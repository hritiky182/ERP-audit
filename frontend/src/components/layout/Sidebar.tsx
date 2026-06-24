import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCog,
  ShieldAlert,
  Building2,
  CreditCard,
  BookOpenCheck,
  GitPullRequestArrow,
  ClipboardList,
  FileBarChart,
  Settings,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "User Access Review", icon: UserCog },
  { to: "/sod", label: "SoD Conflicts", icon: ShieldAlert },
  { to: "/vendors", label: "Vendor Controls", icon: Building2 },
  { to: "/payments", label: "Payment Controls", icon: CreditCard },
  { to: "/journals", label: "Journal Controls", icon: BookOpenCheck },
  // { to: "/changes", label: "Change Management", icon: GitPullRequestArrow },
  { to: "/findings", label: "Audit Findings", icon: ClipboardList },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const { collapsed, toggle } = useSidebarStore();
  const { pathname } = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] md:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">CIS</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">We Make IT Possible</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const link = (
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", active && "text-sidebar-primary")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.to}>{link}</div>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft
              className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
            />
            {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
