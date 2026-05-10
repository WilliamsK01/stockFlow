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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ShoppingCart, Clock, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { OrderDialog } from "@/components/orders/order-dialog";
import { Order } from "@/types/type";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
  const { canCreate, canEdit, canDelete } = useUserRole();

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => setOrders(data.map((o: any) => ({
        ...o,
        supplier: o.supplier?.name ?? o.client ?? o.supplier ?? "",
        warehouse: o.warehouse?.name ?? o.warehouse ?? "",
        totalAmount: o.totalAmount ?? o.lines?.reduce(
          (s: number, l: any) => s + (l.quantity ?? 0) * (l.unitPrice ?? 0), 0
        ) ?? 0,
      }))))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || order.type === selectedType;
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Purchase: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Sale: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return <Badge className={colors[type] || "bg-slate-100 text-slate-800"}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-slate-100 text-slate-800",
      Confirmed: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    if (status === "Delivered") return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
    if (status === "Cancelled") return <Badge variant="destructive">Cancelled</Badge>;
    return <Badge className={colors[status] || "bg-slate-100 text-slate-800"}>{status}</Badge>;
  };

  const handleSave = async (data: Order) => {
    try {
      if (editingOrder) {
        const r = await fetch(`/api/orders/${editingOrder.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const updated = await r.json();
        setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o));
        toast.success("Order updated");
      } else {
        const r = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const created = await r.json();
        setOrders((prev) => [...prev, created]);
        toast.success("Order created");
      }
      setIsDialogOpen(false);
      setEditingOrder(undefined);
    } catch {
      toast.error("Error saving order");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted");
    } catch {
      toast.error("Error deleting order");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
            <p className="text-sm text-muted-foreground">Manage purchase and sale orders</p>
          </div>
          {canCreate && (
            <Button onClick={() => { setEditingOrder(undefined); setIsDialogOpen(true); }} className="gap-2">
              <Plus className="h-4 w-4" />New Order
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">All orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "In Progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "Draft").length}
              </div>
              <p className="text-xs text-muted-foreground">Pending validation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((o) => o.status === "Delivered").length}
              </div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Filters and Search</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by reference or supplier/client..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders list ({filteredOrders.length})</CardTitle>
            <CardDescription>Manage your purchase and sale orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Supplier / Client</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total (XOF)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.reference}</TableCell>
                    <TableCell>{getTypeBadge(order.type)}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell className="max-w-[160px] truncate">{order.warehouse}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.expectedDate}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right font-medium">{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" />See Details</DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem className="gap-2" onClick={() => { setEditingOrder(order); setIsDialogOpen(true); }}>
                              <Edit className="h-4 w-4" />Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && <DropdownMenuSeparator />}
                          {canDelete && (
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(order.id)}>
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
            <OrderDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} order={editingOrder} onSave={handleSave} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
