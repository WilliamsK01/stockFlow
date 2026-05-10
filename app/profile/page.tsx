"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Shield, Calendar, KeyRound, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  OPERATOR: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  VIEWER: "bg-slate-100 text-slate-800",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string; role?: string } | undefined;

  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [joinedAt, setJoinedAt] = useState<string>("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/users`)
      .then(r => r.json())
      .then((users: Array<{ id: string; createdAt: string }>) => {
        const me = users.find(u => u.id === user.id);
        if (me?.createdAt) setJoinedAt(new Date(me.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }));
      })
      .catch(() => {});
  }, [user?.id]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.newPassword }),
      });
      if (!r.ok) throw new Error();
      toast.success("Password updated successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Error updating password.");
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold shadow-lg select-none ring-4 ring-primary/20">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success border-2 border-background" title="Online" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold truncate">{user?.name ?? "—"}</h2>
                  <Badge className={ROLE_COLORS[user?.role ?? ""] ?? "bg-slate-100 text-slate-800"}>
                    {user?.role ?? "—"}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user?.email ?? "—"}</span>
                  </div>
                  {joinedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Member since {joinedAt}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    <span>{user?.role === "ADMIN" ? "Full access — all operations" : user?.role === "MANAGER" ? "Management access" : user?.role === "OPERATOR" ? "Operational access" : "Read-only access"}</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <Image src="/logo.jpeg" alt="StockAirys" width={56} height={56} className="rounded-xl object-cover opacity-60" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Badge className={ROLE_COLORS[user?.role ?? ""] ?? "bg-slate-100 text-slate-800"}>
                  {user?.role ?? "—"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-primary">StockAirys</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="font-semibold text-success">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password. Minimum 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={form.newPassword}
                  onChange={(e) => setForm(p => ({ ...p, newPassword: e.target.value }))}
                  placeholder="••••••••" required minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={form.confirmPassword}
                  onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="••••••••" required minLength={8} />
              </div>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Check className="h-4 w-4" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
