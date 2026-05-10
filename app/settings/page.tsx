"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Edit, Loader2, MoreHorizontal, UserPlus } from "lucide-react";
import Link from "next/link";

interface AppUser { id: string; name: string; email: string; role: string; active: boolean; }

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  OPERATOR: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  VIEWER: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
};

export default function SettingsPage() {
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);

  const [company, setCompany] = useState({
    companyName: "StockAirys SARL", industry: "Manufacturing",
    address: "", city: "", postalCode: "", country: "Côte d'Ivoire", email: "", phone: "",
  });

  const [preferences, setPreferences] = useState({
    currency: "XOF", unitOfMeasure: "Piece",
    lowStockThreshold: 20, language: "French", dateFormat: "DD/MM/YYYY",
  });

  const [notifications, setNotifications] = useState({
    notifLowStock: true, notifExpiry: true, notifCapacity: true,
    notifNewOrder: true, notifDelivery: true, notifEmail: false, notifSms: false,
  });

  // ── Load settings from API ───────────────────────────────────
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setCompany({
          companyName: s.companyName, industry: s.industry,
          address: s.address, city: s.city, postalCode: s.postalCode,
          country: s.country, email: s.email, phone: s.phone,
        });
        setPreferences({
          currency: s.currency, unitOfMeasure: s.unitOfMeasure,
          lowStockThreshold: s.lowStockThreshold, language: s.language, dateFormat: s.dateFormat,
        });
        setNotifications({
          notifLowStock: s.notifLowStock, notifExpiry: s.notifExpiry,
          notifCapacity: s.notifCapacity, notifNewOrder: s.notifNewOrder,
          notifDelivery: s.notifDelivery, notifEmail: s.notifEmail, notifSms: s.notifSms,
        });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoadingSettings(false));
  }, []);

  // ── Load users ───────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, []);

  // ── Generic save ─────────────────────────────────────────────
  const save = async (section: string, data: Record<string, unknown>) => {
    setSaving(section);
    try {
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      toast.success(`${section} saved.`);
    } catch {
      toast.error(`Error saving ${section}.`);
    } finally {
      setSaving(null);
    }
  };

  if (loadingSettings) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your application</p>
        </div>

        <Tabs defaultValue="company">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* ── Company Tab ──────────────────────────────────── */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company profile and contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={company.companyName}
                      onChange={(e) => setCompany({ ...company, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={company.industry} onValueChange={(v) => setCompany({ ...company, industry: v })}>
                      <SelectTrigger id="industry"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Distribution">Distribution</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })} rows={2} />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={company.city} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input value={company.postalCode} onChange={(e) => setCompany({ ...company, postalCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={company.country} onChange={(e) => setCompany({ ...company, country: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={() => save("Company", company)} disabled={saving === "Company"}>
                    {saving === "Company" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Preferences Tab ──────────────────────────────── */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Customize units, currency, and display settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={preferences.currency} onValueChange={(v) => setPreferences({ ...preferences, currency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XOF">XOF - West African Franc</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Unit of Measure</Label>
                    <Select value={preferences.unitOfMeasure} onValueChange={(v) => setPreferences({ ...preferences, unitOfMeasure: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Piece">Piece</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="Liter">Liter</SelectItem>
                        <SelectItem value="Meter">Meter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Low Stock Alert Threshold (%)</Label>
                    <Input type="number" min={0} max={100} value={preferences.lowStockThreshold}
                      onChange={(e) => setPreferences({ ...preferences, lowStockThreshold: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={preferences.language} onValueChange={(v) => setPreferences({ ...preferences, language: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={preferences.dateFormat} onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={() => save("Preferences", preferences)} disabled={saving === "Preferences"}>
                    {saving === "Preferences" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Notifications Tab ────────────────────────────── */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Choose which alerts and notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {([
                    { key: "notifLowStock", label: "Low stock alerts", desc: "Get notified when an item drops below its minimum threshold." },
                    { key: "notifExpiry", label: "Expiry alerts", desc: "Get notified before a product lot expires." },
                    { key: "notifCapacity", label: "Capacity alerts", desc: "Get notified when a warehouse approaches its capacity limit." },
                    { key: "notifNewOrder", label: "New order notifications", desc: "Receive alerts when a new order is created." },
                    { key: "notifDelivery", label: "Delivery confirmations", desc: "Be informed when a delivery is confirmed." },
                    { key: "notifEmail", label: "Email notifications", desc: "Receive alerts via email." },
                    { key: "notifSms", label: "SMS notifications", desc: "Receive alerts via SMS on your phone." },
                  ] as { key: keyof typeof notifications; label: string; desc: string }[]).map((item, i) => (
                    <div key={item.key}>
                      {i > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Button onClick={() => save("Notifications", notifications)} disabled={saving === "Notifications"}>
                    {saving === "Notifications" && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Users Tab ────────────────────────────────────── */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View and manage application users and their roles.</CardDescription>
                </div>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/users">
                    <UserPlus className="h-4 w-4" />Manage Users
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge className={ROLE_COLORS[user.role] ?? "bg-slate-100 text-slate-800"}>{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            {user.active
                              ? <Badge className="bg-success text-success-foreground">Active</Badge>
                              : <Badge variant="secondary">Inactive</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href="/users" className="gap-2 flex items-center">
                                    <Edit className="h-4 w-4" />Edit in Users page
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
