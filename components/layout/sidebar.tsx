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
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/articles",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    name: "Warehouses",
    href: "/warehouses",
    icon: Building2,
  },
  {
    name: "Suppliers",
    href: "/suppliers",
    icon: Users,
  },
  {
    name: "Movements",
    href: "/movements",
    icon: ArrowUpDown,
  },
  {
    name: "Receptions",
    href: "/receptions",
    icon: Truck,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Forecasting",
    href: "/forecasting",
    icon: TrendingUp,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <Package className="h-8 w-8 text-primary" />
          <span className="text-primary">StockAirys</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10 text-slate-700 dark:text-slate-400 hover:text-slate-800 hover:dark:text-slate-300",
                    isActive && "bg-primary/40 font-medium text-slate-900 dark:text-slate-200",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
