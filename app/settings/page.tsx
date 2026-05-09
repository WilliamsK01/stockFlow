"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Edit, MoreHorizontal, UserPlus } from "lucide-react";

const users = [
  { name: "Williams KOFFI", role: "Admin", email: "williamsk.koffi1@gmail.com", status: "Active" },
  { name: "Marie Dupont", role: "Manager", email: "marie.d@stockairys.ci", status: "Active" },
  { name: "Jean Konan", role: "Operator", email: "j.konan@stockairys.ci", status: "Active" },
  { name: "Sophie Martin", role: "Viewer", email: "s.martin@stockairys.ci", status: "Inactive" },
];

const getRoleBadge = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Operator: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Viewer: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
  };
  return <Badge className={colors[role] ?? "bg-slate-100 text-slate-800"}>{role}</Badge>;
};

const getStatusBadge = (status: string) => {
  if (status === "Active") {
    return <Badge className="bg-success text-success-foreground">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
};

export default function SettingsPage() {
  const [company, setCompany] = useState({
    name: "StockAirys SARL",
    industry: "Manufacturing",
    address: "",
    city: "",
    postalCode: "",
    country: "Côte d'Ivoire",
    email: "",
    phone: "",
  });

  const [preferences, setPreferences] = useState({
    currency: "XOF",
    unitOfMeasure: "Piece",
    lowStockThreshold: "20",
    language: "French",
    dateFormat: "DD/MM/YYYY",
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiry: true,
    capacity: true,
    newOrder: true,
    delivery: true,
    email: false,
    sms: false,
  });

  const handleSaveCompany = () => {
    toast("Company information saved.");
  };

  const handleSavePreferences = () => {
    toast("Preferences saved.");
  };

  const handleSaveNotifications = () => {
    toast("Notification settings saved.");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your application
          </p>
        </div>

        <Tabs defaultValue="company">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Company Tab */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company profile and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={company.name}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={company.industry}
                      onValueChange={(v) => setCompany({ ...company, industry: v })}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue />
                      </SelectTrigger>
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
                  <Textarea
                    id="address"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={company.city}
                      onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={company.postalCode}
                      onChange={(e) => setCompany({ ...company, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={company.country}
                      onChange={(e) => setCompany({ ...company, country: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSaveCompany}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>
                  Customize units, currency, and display settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(v) => setPreferences({ ...preferences, currency: v })}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XOF">XOF - West African Franc</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uom">Default Unit of Measure</Label>
                    <Select
                      value={preferences.unitOfMeasure}
                      onValueChange={(v) => setPreferences({ ...preferences, unitOfMeasure: v })}
                    >
                      <SelectTrigger id="uom">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Piece">Piece</SelectItem>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="Liter">Liter</SelectItem>
                        <SelectItem value="Meter">Meter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold (%)</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      min={0}
                      max={100}
                      value={preferences.lowStockThreshold}
                      onChange={(e) =>
                        setPreferences({ ...preferences, lowStockThreshold: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(v) => setPreferences({ ...preferences, language: v })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(v) => setPreferences({ ...preferences, dateFormat: v })}
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose which alerts and notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low stock alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when an item drops below its minimum threshold.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(v) => setNotifications({ ...notifications, lowStock: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Expiry alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified before a product lot expires.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.expiry}
                      onCheckedChange={(v) => setNotifications({ ...notifications, expiry: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Capacity alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a warehouse approaches its capacity limit.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.capacity}
                      onCheckedChange={(v) => setNotifications({ ...notifications, capacity: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New order notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when a new order is created.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newOrder}
                      onCheckedChange={(v) => setNotifications({ ...notifications, newOrder: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Delivery confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        Be informed when a delivery is confirmed.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.delivery}
                      onCheckedChange={(v) => setNotifications({ ...notifications, delivery: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts via email.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts via SMS on your phone.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(v) => setNotifications({ ...notifications, sms: v })}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={handleSaveNotifications}>
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage application users and their roles.
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent>
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
                      <TableRow key={user.email}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
