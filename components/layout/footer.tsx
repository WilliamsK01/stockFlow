"use client";

import { useEffect, useState } from "react";
import { Package, Clock, Wifi } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time?.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }) ?? "--:--";

  const formattedDate = time?.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }) ?? "";

  return (
    <footer className="shrink-0 border-t bg-card/60 backdrop-blur-sm">
      <div className="flex h-10 items-center justify-between px-6">

        {/* ── Left — Brand ───────────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground/80 tracking-tight">
            StockAirys
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span>v1.0.0</span>
          <Separator orientation="vertical" className="h-3" />
          <span>© {new Date().getFullYear()} Williams KOFFI</span>
        </div>

        {/* ── Center — System status ──────────────────────── */}
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            System operational
          </span>
          <Separator orientation="vertical" className="h-3" />
          <Wifi className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">Mock data — no backend</span>
        </div>

        {/* ── Right — Date & Clock ────────────────────────── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formattedDate}</span>
          <Separator orientation="vertical" className="h-3" />
          <span className="font-mono font-semibold text-foreground/80 tabular-nums">
            {formattedTime}
          </span>
        </div>

      </div>
    </footer>
  );
}
