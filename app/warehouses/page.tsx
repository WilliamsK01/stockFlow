"use client";

import { useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Thermometer,
  Users,
  Loader2,
} from "lucide-react";
import { WarehouseDialog } from "@/components/warehouses/warehouse-dialog";
import { Warehouse } from "@/types/type";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/use-user-role";

const mockEmplacements = [
  {
    id: 1,
    code: "A1-B2-C3",
    zone: "A",
    aisle: "1",
    span: "B2",
    level: "C3",
    warehouseId: 1,
    occupied: true,
    article: "REF-001",
  },
  {
    id: 2,
    code: "A1-B2-C4",
    zone: "A",
    aisle: "1",
    span: "B2",
    level: "C4",
    warehouseId: 1,
    occupied: false,
    article: null,
  },
  {
    id: 3,
    code: "B2-A1-D1",
    zone: "B",
    aisle: "2",
    span: "A1",
    level: "C4",
    warehouseId: 1,
    occupied: true,
    article: "REF-002",
  },
];

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("warehouses");
  const { canCreate, canEdit, canDelete, canManageResources } = useUserRole();

  useEffect(() => {
    fetch('/api/warehouses')
      .then(r => r.json())
      .then(data => setWarehouses(data))
      .catch(() => toast.error('Error loading warehouses'))
      .finally(() => setLoading(false));
  }, []);

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || warehouse.type === selectedType;
    const matchesStatus = selectedStatus === "all" || warehouse.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.maxCapacity ?? 0), 0);
  const totalOccupation = warehouses.reduce((sum, w) => sum + (w.currentOccupation ?? 0), 0);
  const avgOccupationRate = totalCapacity > 0 ? (totalOccupation / totalCapacity) * 100 : 0;
  const activeCount = warehouses.filter((w) => w.status === "Active").length;

  const getOccupationBadge = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90)
      return <Badge variant="destructive">{percentage.toFixed(0)}%</Badge>;
    if (percentage >= 75)
      return (
        <Badge className="bg-warning text-warning-foreground">
          {percentage.toFixed(0)}%
        </Badge>
      );
    return <Badge variant="secondary">{percentage.toFixed(0)}%</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-success text-success-foreground",
      Inactive: "bg-destructive text-destructive-foreground",
      Maintenance: "bg-warning text-warning-foreground",
    };
    return (
      <Badge className={colors[status] || "bg-slate-100 text-slate-800"}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Main: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Regional: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Specialized: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Transit: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    };
    return (
      <Badge className={colors[type] || "bg-slate-100 text-slate-800"}>
        {type}
      </Badge>
    );
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingWarehouse(undefined);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: Warehouse) => {
    try {
      if (editingWarehouse) {
        const r = await fetch(`/api/warehouses/${editingWarehouse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const updated = await r.json();
        setWarehouses(prev => prev.map(w => w.id === updated.id ? updated : w));
        toast.success('Warehouse updated');
      } else {
        const r = await fetch('/api/warehouses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!r.ok) throw new Error();
        const created = await r.json();
        setWarehouses(prev => [...prev, created]);
        toast.success('Warehouse created');
      }
      setIsDialogOpen(false);
      setEditingWarehouse(undefined);
    } catch {
      toast.error('Error saving warehouse');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/warehouses/${id}`, { method: 'DELETE' });
      setWarehouses(prev => prev.filter(w => w.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Error deleting');
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Warehouses Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your storage sites and locations
            </p>
          </div>
          {canManageResources && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Warehouse
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warehouses.length}</div>
              <p className="text-xs text-muted-foreground">Storage sites</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground">Operational warehouses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCapacity.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Max units</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Occupation</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgOccupationRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Average fill rate</p>
            </CardContent>
          </Card>
        </div>

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
                    placeholder="Search by name, code or manager..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Main">Main</SelectItem>
                  <SelectItem value="Regional">Regional</SelectItem>
                  <SelectItem value="Specialized">Specialized</SelectItem>
                  <SelectItem value="Transit">Transit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="warehouses">
            <Card>
              <CardHeader>
                <CardTitle>Warehouses list ({filteredWarehouses.length})</CardTitle>
                <CardDescription>
                  Manage your storage sites, their capacities and their statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name / Code</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupation %</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.map((warehouse) => (
                      <TableRow key={warehouse.id}>
                        <TableCell>
                          <div className="font-medium">{warehouse.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {warehouse.code}
                          </div>
                        </TableCell>
                        <TableCell>{warehouse.manager}</TableCell>
                        <TableCell>{getTypeBadge(warehouse.type)}</TableCell>
                        <TableCell>
                          {(warehouse.currentOccupation ?? 0).toLocaleString()} /{" "}
                          {(warehouse.maxCapacity ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getOccupationBadge(
                            warehouse.currentOccupation ?? 0,
                            warehouse.maxCapacity ?? 0,
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-3 w-3 text-muted-foreground" />
                            {warehouse.temperature}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
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
                              {canManageResources && (
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() => handleEdit(warehouse)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canDelete && <DropdownMenuSeparator />}
                              {canDelete && (
                                <DropdownMenuItem
                                  className="gap-2 text-destructive"
                                  onClick={() => handleDelete(warehouse.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
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
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Locations ({mockEmplacements.length})</CardTitle>
                <CardDescription>
                  Storage locations and their current occupancy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmplacements.map((emplacement) => {
                      const warehouse = warehouses.find(
                        (w) => w.id === emplacement.warehouseId,
                      );
                      return (
                        <TableRow key={emplacement.id}>
                          <TableCell className="font-medium">
                            {emplacement.code}
                          </TableCell>
                          <TableCell>{emplacement.zone}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {warehouse ? warehouse.name : `#${emplacement.warehouseId}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            {emplacement.occupied ? (
                              <Badge className="bg-destructive text-destructive-foreground">
                                Occupied
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-success text-success-foreground"
                              >
                                Free
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {emplacement.article ?? (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
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
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <WarehouseDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          warehouse={editingWarehouse}
          onSave={handleSave}
        />
      </div>
    </MainLayout>
  );
}
