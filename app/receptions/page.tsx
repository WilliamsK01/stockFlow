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
  PackageCheck,
  Clock,
  PackageOpen,
  PackageX,
} from "lucide-react";
import { ReceptionDialog } from "@/components/receptions/reception-dialog";
import { Reception } from "@/types/type";

const mockReceptions: Reception[] = [
  {
    id: 1,
    reference: "REC-2024-001",
    supplier: "ACM Visserie",
    warehouse: "Entrepôt Principal",
    expectedDate: "2024-01-15",
    receivedDate: "2024-01-14",
    status: "Received",
    lines: [
      {
        articleRef: "REF-001",
        designation: "Vis M6x20",
        orderedQty: 500,
        receivedQty: 498,
        unitPrice: 250,
      },
    ],
    notes: "",
    totalValue: 124500,
  },
  {
    id: 2,
    reference: "REC-2024-002",
    supplier: "PetroCI",
    warehouse: "Entrepôt Principal",
    expectedDate: "2024-01-20",
    receivedDate: undefined,
    status: "Pending",
    lines: [
      {
        articleRef: "REF-002",
        designation: "Huile moteur",
        orderedQty: 50,
        receivedQty: 0,
        unitPrice: 15000,
      },
    ],
    notes: "",
    totalValue: 750000,
  },
  {
    id: 3,
    reference: "REC-2024-003",
    supplier: "SKF Distribution",
    warehouse: "Entrepôt Principal",
    expectedDate: "2024-01-18",
    receivedDate: "2024-01-18",
    status: "Partial",
    lines: [
      {
        articleRef: "REF-003",
        designation: "Roulement SKF",
        orderedQty: 30,
        receivedQty: 15,
        unitPrice: 12000,
      },
    ],
    notes: "",
    totalValue: 180000,
  },
  {
    id: 4,
    reference: "REC-2024-004",
    supplier: "SCI Pharma",
    warehouse: "Entrepôt Frigorifique",
    expectedDate: "2024-01-25",
    receivedDate: undefined,
    status: "Cancelled",
    lines: [],
    notes: "",
    totalValue: 0,
  },
];

export default function ReceptionsPage() {
  const [receptions, setReceptions] = useState<Reception[]>(mockReceptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReception, setEditingReception] = useState<Reception | undefined>(undefined);

  const filteredReceptions = receptions.filter((reception) => {
    const matchesSearch =
      reception.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || reception.status === selectedStatus;
    const matchesSupplier =
      selectedSupplier === "all" || reception.supplier === selectedSupplier;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received":
        return (
          <Badge className="bg-success text-success-foreground">Received</Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Pending
          </Badge>
        );
      case "Partial":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Partial
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-slate-100 text-slate-800">Cancelled</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = (reception: Reception) => {
    setEditingReception(reception);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingReception(undefined);
    setIsDialogOpen(true);
  };

  const handleSave = (receptionData: Reception) => {
    if (editingReception) {
      setReceptions(
        receptions.map((r) =>
          r.id === editingReception.id ? { ...r, ...receptionData } : r
        )
      );
    } else {
      setReceptions([...receptions, { ...receptionData, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingReception(undefined);
  };

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Receptions
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage incoming goods and reception orders
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            New Reception
          </Button>
        </div>
        {/* endHeader */}

        {/* KPI Cards */}
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
                {
                  receptions.filter((r) => {
                    if (r.status !== "Received" || !r.receivedDate) return false;
                    const d = new Date(r.receivedDate);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                  }).length
                }
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
                    placeholder="Search by reference or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
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
        {/* endFilters */}

        {/* Receptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Receptions list ({filteredReceptions.length})</CardTitle>
            <CardDescription>
              View and manage all incoming reception orders
            </CardDescription>
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
                    <TableCell className="font-medium">
                      {reception.reference}
                    </TableCell>
                    <TableCell>{reception.supplier}</TableCell>
                    <TableCell>{reception.warehouse}</TableCell>
                    <TableCell>{reception.expectedDate}</TableCell>
                    <TableCell>
                      {reception.receivedDate ?? "—"}
                    </TableCell>
                    <TableCell>{reception.lines.length}</TableCell>
                    <TableCell>
                      XOF {reception.totalValue.toLocaleString()}
                    </TableCell>
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
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleEdit(reception)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() =>
                              setReceptions(receptions.filter((r) => r.id !== reception.id))
                            }
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

            <ReceptionDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              reception={editingReception}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
        {/* endReceptions Table */}
      </div>
    </MainLayout>
  );
}
