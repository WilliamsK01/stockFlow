"use client";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { ModeToggle } from "../ui/theme-toggle";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search bar*/}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article, référence..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Stock faible</p>
                  <p className="text-muted-foreground">
                    Article REF001 - Seuil critique atteint
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-info/10">
                <CheckCircle className="h-4 w-4 text-info mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Commande confirmée</p>
                  <p className="text-muted-foreground">
                    Commande N°123456 - Livraison prévue le 15/07/2025
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-primary/10">
                <Package className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Réception en attente</p>
                  <p className="text-muted-foreground">
                    Commande CMD-2025-001 à traiter
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
