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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, PackageCheck, Clock, PackageOpen, PackageX, Loader2 } from "lucide-react";
import { ReceptionDialog } from "@/components/receptions/reception-dialog";
import { Reception } from "@/types/type";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

export default function ReceptionsPage() {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReception, setEditingReception] = useState<Reception | undefined>(undefined);
  const { canCreate, canEdit, canDelete } = useUserRole();

  useEffect(() => {
    fetch("/api/receptions")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => setReceptions(data.map((r: any) => ({
        ...r,
        supplier: r.supplier?.name ?? r.supplier ?? "",
        warehouse: r.warehouse?.name ?? r.warehouse ?? "",
        totalValue: r.totalValue ?? r.lines?.reduce(
          (s: number, l: any) => s + (l.receivedQty ?? 0) * (l.unitPrice ?? 0), 0
        ) ?? 0,
      }))))
      .catch(() => toast.error("Failed to load receptions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  const filteredReceptions = receptions.filter((reception) => {
    const matchesSearch =
      reception.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || reception.status === selectedStatus;
    const matchesSupplier = selectedSupplier === "all" || reception.supplier === selectedSupplier;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received": return <Badge className="bg-success text-success-foreground">Received</Badge>;
      case "Pending": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Pending</Badge>;
      case "Partial": return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Partial</Badge>;
      case "Cancelled": return <Badge className="bg-slate-100 text-slate-800">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSave = async (data: Reception) => {
    try {
      if (editingReception) {
        const r = await fetch(`/api/receptions/${editingReception.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const updated = await r.json();
        setReceptions((prev) => prev.map((rec) => rec.id === updated.id ? updated : rec));
        toast.success("Reception updated");
      } else {
        const r = await fetch("/api/receptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const created = await r.json();
        setReceptions((prev) => [...prev, created]);
        toast.success("Reception created");
      }
      setIsDialogOpen(false);
      setEditingReception(undefined);
    } catch {
      toast.error("Error saving reception");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/receptions/${id}`, { method: "DELETE" });
      setReceptions((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reception deleted");
    } catch {
      toast.error("Error deleting reception");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Receptions</h1>
            <p className="text-sm text-muted-foreground">Manage incoming goods and reception orders</p>
          </div>
          {canCreate && (
            <Button onClick={() => { setEditingReception(undefined); setIsDialogOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" />
              New Reception
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receptions</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receptions.length}</div>
              <p className="text-xs text-muted-foreground">All receptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {receptions.filter((r) => r.status === "Pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting receipt</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received this month</CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {receptions.filter((r) => {
                  if (r.status !== "Received" || !r.receivedDate) return false;
                  const d = new Date(r.receivedDate);
                  return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partial</CardTitle>
              <PackageX className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {receptions.filter((r) => r.status === "Partial").length}
              </div>
              <p className="text-xs text-muted-foreground">Incomplete receptions</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Filters and Search</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by reference or supplier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Supplier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="ACM Visserie">ACM Visserie</SelectItem>
                  <SelectItem value="PetroCI">PetroCI</SelectItem>
                  <SelectItem value="SKF Distribution">SKF Distribution</SelectItem>
                  <SelectItem value="SCI Pharma">SCI Pharma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receptions list ({filteredReceptions.length})</CardTitle>
            <CardDescription>View and manage all incoming reception orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceptions.map((reception) => (
                  <TableRow key={reception.id}>
                    <TableCell className="font-medium">{reception.reference}</TableCell>
                    <TableCell>{reception.supplier}</TableCell>
                    <TableCell>{reception.warehouse}</TableCell>
                    <TableCell>{reception.expectedDate}</TableCell>
                    <TableCell>{reception.receivedDate ?? "—"}</TableCell>
                    <TableCell>{reception.lines.length}</TableCell>
                    <TableCell>XOF {reception.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(reception.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" />View Details</DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem className="gap-2" onClick={() => { setEditingReception(reception); setIsDialogOpen(true); }}>
                              <Edit className="h-4 w-4" />Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && <DropdownMenuSeparator />}
                          {canDelete && (
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(reception.id)}>
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
            <ReceptionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} reception={editingReception} onSave={handleSave} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
