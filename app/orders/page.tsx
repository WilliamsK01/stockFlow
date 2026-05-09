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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  Clock,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { OrderDialog } from "@/components/orders/order-dialog";
import { Order } from "@/types/type";

// Mock data — à remplacer par l'API
const mockOrders: Order[] = [
  {
    id: 1,
    reference: "ORD-2024-001",
    type: "Purchase",
    supplier: "ACM Visserie",
    warehouse: "Entrepôt Principal",
    orderDate: "2024-01-10",
    expectedDate: "2024-01-20",
    status: "Confirmed",
    totalAmount: 250000,
    notes: "",
    lines: [
      {
        articleRef: "REF-001",
        designation: "Vis M6x20",
        quantity: 1000,
        unitPrice: 250,
      },
    ],
  },
  {
    id: 2,
    reference: "ORD-2024-002",
    type: "Sale",
    supplier: "Client ABC",
    warehouse: "Entrepôt Principal",
    orderDate: "2024-01-12",
    expectedDate: "2024-01-15",
    status: "Delivered",
    totalAmount: 185000,
    notes: "",
    lines: [
      {
        articleRef: "REF-002",
        designation: "Huile moteur",
        quantity: 10,
        unitPrice: 18500,
      },
    ],
  },
  {
    id: 3,
    reference: "ORD-2024-003",
    type: "Purchase",
    supplier: "SKF Distribution",
    warehouse: "Entrepôt Principal",
    orderDate: "2024-01-14",
    expectedDate: "2024-01-25",
    status: "In Progress",
    totalAmount: 384000,
    notes: "",
    lines: [
      {
        articleRef: "REF-003",
        designation: "Roulement SKF",
        quantity: 30,
        unitPrice: 12800,
      },
    ],
  },
  {
    id: 4,
    reference: "ORD-2024-004",
    type: "Sale",
    supplier: "Client XYZ",
    warehouse: "Entrepôt Frigorifique",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-18",
    status: "Draft",
    totalAmount: 95000,
    notes: "",
    lines: [],
  },
  {
    id: 5,
    reference: "ORD-2024-005",
    type: "Purchase",
    supplier: "PetroCI",
    warehouse: "Entrepôt Principal",
    orderDate: "2024-01-08",
    expectedDate: "2024-01-16",
    status: "Cancelled",
    totalAmount: 450000,
    notes: "",
    lines: [],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || order.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Purchase:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Sale: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return (
      <Badge className={colors[type] || "bg-slate-100 text-slate-800"}>
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-slate-100 text-slate-800",
      Confirmed: "bg-blue-100 text-blue-800",
      "In Progress":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    if (status === "Delivered") {
      return (
        <Badge className="bg-success text-success-foreground">Delivered</Badge>
      );
    }
    if (status === "Cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return (
      <Badge className={colors[status] || "bg-slate-100 text-slate-800"}>
        {status}
      </Badge>
    );
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingOrder(undefined);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Orders Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage purchase and sale orders
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
        {/* endHeader */}

        {/* KPI Cards */}
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
        {/* endKPI Cards */}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters and Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by reference or supplier/client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Purchase">Purchase</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
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
        {/* endFilters */}

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders list ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Manage your purchase and sale orders
            </CardDescription>
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
                  <TableHead className="text-right">Total Amount (XOF)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.reference}
                    </TableCell>
                    <TableCell>{getTypeBadge(order.type)}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {order.warehouse}
                    </TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.expectedDate}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            See Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleEdit(order)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Dialog pour ajouter/modifier une commande */}
            <OrderDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              order={editingOrder}
              onSave={(orderData) => {
                if (editingOrder) {
                  setOrders(
                    orders.map((o) =>
                      o.id === editingOrder.id ? { ...o, ...orderData } : o
                    )
                  );
                } else {
                  const newOrder: Order = {
                    ...orderData,
                    id: Math.max(...orders.map((o) => o.id)) + 1,
                  };
                  setOrders([...orders, newOrder]);
                }
                setIsDialogOpen(false);
                setEditingOrder(undefined);
              }}
            />
            {/* endDialog */}
          </CardContent>
        </Card>
        {/* endOrders Table */}
      </div>
    </MainLayout>
  );
}
