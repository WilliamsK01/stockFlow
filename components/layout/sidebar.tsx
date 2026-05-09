"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  Users,
  ArrowUpDown,
  TrendingUp,
  BarChart3,
  Settings,
  AlertTriangle,
  Truck,
  ClipboardList,
  ChevronLeft,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard",   href: "/dashboard",   icon: LayoutDashboard },
  { name: "Articles",    href: "/articles",    icon: Package          },
  { name: "Categories",  href: "/categories",  icon: Tags             },
  { name: "Warehouses",  href: "/warehouses",  icon: Building2        },
  { name: "Suppliers",   href: "/suppliers",   icon: Users            },
  { name: "Movements",   href: "/movements",   icon: ArrowUpDown      },
  { name: "Receptions",  href: "/receptions",  icon: Truck            },
  { name: "Orders",      href: "/orders",      icon: ClipboardList    },
  { name: "Forecasting", href: "/forecasting", icon: TrendingUp       },
  { name: "Reports",     href: "/reports",     icon: BarChart3        },
  { name: "Alerts",      href: "/alerts",      icon: AlertTriangle    },
  { name: "Settings",    href: "/settings",    icon: Settings         },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-card border-r overflow-hidden",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* ── Header / Logo ─────────────────────────────────────── */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center justify-between border-b",
          collapsed ? "px-3" : "px-4",
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl overflow-hidden min-w-0"
        >
          <Package className="h-6 w-6 text-primary shrink-0" />
          <span
            className={cn(
              "text-primary whitespace-nowrap transition-all duration-300 overflow-hidden",
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100",
            )}
          >
            StockAirys
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "h-7 w-7 shrink-0 rounded-md text-muted-foreground",
            "hover:bg-primary/10 hover:text-primary transition-colors duration-200",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* ── Navigation ─────────────────────────────────────────── */}
      <ScrollArea className="flex-1 py-3">
        <nav className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10 transition-all duration-200",
                    "text-slate-600 dark:text-slate-400",
                    "hover:text-slate-900 dark:hover:text-slate-100 hover:bg-muted",
                    collapsed ? "justify-center gap-0 px-0" : "justify-start gap-3 px-3",
                    isActive &&
                      "bg-primary/15 text-primary dark:text-primary font-medium hover:bg-primary/20 hover:text-primary",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors duration-200",
                      isActive && "text-primary",
                    )}
                  />
                  <span
                    className={cn(
                      "whitespace-nowrap overflow-hidden transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "opacity-100",
                    )}
                  >
                    {item.name}
                  </span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="shrink-0 border-t">
        {/* Version tag — only when expanded */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            collapsed ? "max-h-0 opacity-0" : "max-h-8 opacity-100",
          )}
        >
          <p className="px-4 pt-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
            StockAirys v1.0.0
          </p>
        </div>

        {/* User card */}
        <div className={cn("p-2", collapsed && "flex flex-col items-center gap-1")}>
          {collapsed ? (
            <>
              {/* Avatar only */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-bold shadow-sm cursor-default select-none"
                title="Williams KOFFI — Administrator"
              >
                WK
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            /* Expanded user row */
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-muted/60 transition-colors group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-bold shadow-sm select-none">
                WK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">
                  Williams KOFFI
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Administrator
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
