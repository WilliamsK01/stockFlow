"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Bell, CheckCircle, XCircle, Eye, Trash2, MoreHorizontal, Search, Loader2 } from "lucide-react";
import { Alert } from "@/types/type";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

const today = new Date().toISOString().split("T")[0];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { canEdit, canDelete } = useUserRole();

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => setAlerts(data.map((a: any) => ({
        ...a,
        article: a.article
          ? `${a.article.reference} — ${a.article.designation}`
          : a.article,
        warehouse: a.warehouseId ? `Entrepôt #${a.warehouseId}` : a.warehouse,
        createdAt: a.createdAt?.split?.("T")[0] ?? a.createdAt ?? "",
        resolvedAt: a.resolvedAt?.split?.("T")[0] ?? a.resolvedAt,
      }))))
      .catch(() => toast.error("Failed to load alerts"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.article?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (alert.warehouse?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || alert.type === selectedType;
    const matchesLevel = selectedLevel === "all" || alert.level === selectedLevel;
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus;
    return matchesSearch && matchesType && matchesLevel && matchesStatus;
  });

  const activeCount = alerts.filter((a) => a.status === "Active").length;
  const criticalCount = alerts.filter((a) => a.level === "Critical").length;
  const acknowledgedCount = alerts.filter((a) => a.status === "Acknowledged").length;
  const resolvedTodayCount = alerts.filter((a) => a.status === "Resolved" && a.resolvedAt === today).length;

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    return <Badge className={colors[level] ?? "bg-slate-100 text-slate-800"}>{level}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      "Low Stock": "bg-red-50 text-red-700",
      Expiry: "bg-orange-50 text-orange-700",
      Capacity: "bg-purple-50 text-purple-700",
      Threshold: "bg-blue-50 text-blue-700",
    };
    return <Badge className={colors[type] ?? "bg-slate-50 text-slate-700"}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") return <Badge variant="destructive">{status}</Badge>;
    if (status === "Acknowledged") return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{status}</Badge>;
    return <Badge className="bg-success text-success-foreground">{status}</Badge>;
  };

  const handleAcknowledge = async (id: number) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Acknowledged" }),
      });
      setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "Acknowledged" } : a));
    } catch {
      toast.error("Error updating alert");
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Resolved", resolvedAt: new Date().toISOString() }),
      });
      setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "Resolved", resolvedAt: today } : a));
    } catch {
      toast.error("Error resolving alert");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/alerts/${id}`, { method: "DELETE" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Alert deleted");
    } catch {
      toast.error("Error deleting alert");
    }
  };

  const handleClearResolved = async () => {
    const resolved = alerts.filter((a) => a.status === "Resolved");
    await Promise.all(resolved.map((a) => fetch(`/api/alerts/${a.id}`, { method: "DELETE" })));
    setAlerts((prev) => prev.filter((a) => a.status !== "Resolved"));
    toast.success(`${resolved.length} resolved alert(s) cleared`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alerts Management</h1>
            <p className="text-sm text-muted-foreground">Monitor and manage system alerts</p>
          </div>
          {canDelete && (
            <Button variant="outline" onClick={handleClearResolved} className="gap-2">
              <XCircle className="h-4 w-4" />Clear All Resolved
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
              <p className="text-xs text-muted-foreground">High priority alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{acknowledgedCount}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedTodayCount}</div>
              <p className="text-xs text-muted-foreground">Closed today</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Filters and Search</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by reference, article, warehouse, message..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Expiry">Expiry</SelectItem>
                  <SelectItem value="Capacity">Capacity</SelectItem>
                  <SelectItem value="Threshold">Threshold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts list ({filteredAlerts.length})</CardTitle>
            <CardDescription>System-generated alerts based on stock rules and thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Article / Warehouse</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.reference}</TableCell>
                    <TableCell>{getTypeBadge(alert.type)}</TableCell>
                    <TableCell>{getLevelBadge(alert.level)}</TableCell>
                    <TableCell className="font-medium">{alert.article ?? alert.warehouse ?? "—"}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{alert.message}</TableCell>
                    <TableCell className="text-sm">{alert.createdAt}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {canEdit && (
                            <DropdownMenuItem className="gap-2" onClick={() => handleAcknowledge(alert.id)}>
                              <Eye className="h-4 w-4" />Acknowledge
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem className="gap-2" onClick={() => handleResolve(alert.id)}>
                              <CheckCircle className="h-4 w-4" />Resolve
                            </DropdownMenuItem>
                          )}
                          {canDelete && <DropdownMenuSeparator />}
                          {canDelete && (
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(alert.id)}>
                              <Trash2 className="h-4 w-4" />Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
