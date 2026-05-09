"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  Users,
  Building2,
  ArrowUpDown,
} from "lucide-react";

const stockArticles = [
  {
    reference: "REF-002",
    designation: "Huile moteur 5L",
    category: "Lubricant",
    stock: 25,
    unitPrice: 150057,
    totalValue: 3751425,
    classification: "B",
  },
  {
    reference: "REF-003",
    designation: "Roulement SKF",
    category: "Bearings",
    stock: 5,
    unitPrice: 12651,
    totalValue: 63255,
    classification: "A",
  },
  {
    reference: "REF-001",
    designation: "Vis M6x20 Inox",
    category: "Screws",
    stock: 150,
    unitPrice: 25000,
    totalValue: 3750000,
    classification: "A",
  },
];

const movementHistory = [
  {
    reference: "MVT-001",
    type: "Entry",
    article: "Vis M6x20 Inox",
    quantity: 150,
    warehouse: "Entrepôt A",
    date: "2025-05-01",
    status: "Completed",
  },
  {
    reference: "MVT-002",
    type: "Exit",
    article: "Huile moteur 5L SAE",
    quantity: -75,
    warehouse: "Entrepôt B",
    date: "2025-05-03",
    status: "Completed",
  },
  {
    reference: "MVT-003",
    type: "Transfer",
    article: "Roulement SKF 6205",
    quantity: 30,
    warehouse: "Entrepôt A → B",
    date: "2025-05-05",
    status: "Completed",
  },
  {
    reference: "MVT-004",
    type: "Adjustment",
    article: "Filtre à huile",
    quantity: 10,
    warehouse: "Entrepôt C",
    date: "2025-05-07",
    status: "Completed",
  },
];

const supplierPerformance = [
  {
    supplier: "ACM Visserie",
    orders: 24,
    delivered: 23,
    onTime: 20,
    avgDelay: 1.2,
    rating: 4.5,
  },
  {
    supplier: "PetroCI",
    orders: 18,
    delivered: 18,
    onTime: 15,
    avgDelay: 2.1,
    rating: 4.1,
  },
  {
    supplier: "SKF Distribution",
    orders: 12,
    delivered: 11,
    onTime: 10,
    avgDelay: 0.8,
    rating: 4.8,
  },
];

const warehouseUtilization = [
  {
    warehouse: "Entrepôt Principal",
    code: "WH-A",
    type: "Standard",
    capacity: 8000,
    occupied: 6200,
    percent: 77,
    status: "Normal",
  },
  {
    warehouse: "Entrepôt Secondaire",
    code: "WH-B",
    type: "Standard",
    capacity: 5000,
    occupied: 3800,
    percent: 76,
    status: "Normal",
  },
  {
    warehouse: "Entrepôt Froid",
    code: "WH-C",
    type: "Cold",
    capacity: 5000,
    occupied: 2750,
    percent: 55,
    status: "Normal",
  },
];

const getClassificationBadge = (classification: string) => {
  const colors: Record<string, string> = {
    A: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    B: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    C: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
  return (
    <Badge className={colors[classification] || "bg-slate-100 text-gray-800"}>
      Class {classification}
    </Badge>
  );
};

const getMovementBadge = (type: string) => {
  switch (type) {
    case "Entry":
      return <Badge className="bg-success text-success-foreground">Entry</Badge>;
    case "Exit":
      return <Badge variant="destructive">Exit</Badge>;
    case "Transfer":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Transfer
        </Badge>
      );
    case "Adjustment":
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
          Adjustment
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Analytics and performance reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stock">
          <TabsList>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          </TabsList>

          {/* Tab Stock */}
          <TabsContent value="stock" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2 847</div>
                  <p className="text-xs text-muted-foreground">
                    Articles in catalog
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock Value
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">XOF 853 900</div>
                  <p className="text-xs text-muted-foreground">
                    Valued inventory
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Items
                  </CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">3</div>
                  <p className="text-xs text-muted-foreground">
                    Require replenishment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    A-Class Items
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    High-value articles
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Articles by Value</CardTitle>
                <CardDescription>
                  Highest value items in your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Classification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockArticles.map((article) => (
                      <TableRow key={article.reference}>
                        <TableCell className="font-medium">
                          {article.reference}
                        </TableCell>
                        <TableCell>{article.designation}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.stock}</TableCell>
                        <TableCell>
                          XOF {article.unitPrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          XOF {article.totalValue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getClassificationBadge(article.classification)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Movements */}
          <TabsContent value="movements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Movements
                  </CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">
                    This period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entries</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">67</div>
                  <p className="text-xs text-muted-foreground">
                    Stock receptions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">71</div>
                  <p className="text-xs text-muted-foreground">
                    Stock outflows
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transfers
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    Between warehouses
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Movement History</CardTitle>
                <CardDescription>
                  All stock operations for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movementHistory.map((mvt) => (
                      <TableRow key={mvt.reference}>
                        <TableCell className="font-medium">
                          {mvt.reference}
                        </TableCell>
                        <TableCell>{getMovementBadge(mvt.type)}</TableCell>
                        <TableCell>{mvt.article}</TableCell>
                        <TableCell>
                          <span
                            className={
                              mvt.quantity > 0
                                ? "text-green-600 font-medium"
                                : mvt.quantity < 0
                                  ? "text-destructive font-medium"
                                  : ""
                            }
                          >
                            {mvt.quantity > 0 ? `+${mvt.quantity}` : mvt.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{mvt.warehouse}</TableCell>
                        <TableCell>{mvt.date}</TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">
                            {mvt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Suppliers */}
          <TabsContent value="suppliers" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Suppliers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">
                    Registered partners
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Delivery
                  </CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.5 days</div>
                  <p className="text-xs text-muted-foreground">
                    Average lead time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Discount
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    Negotiated discounts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Purchases
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">XOF 2.4M</div>
                  <p className="text-xs text-muted-foreground">
                    This period
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>
                  Delivery and quality metrics per supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>On-Time</TableHead>
                      <TableHead>Avg Delay (days)</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierPerformance.map((supplier) => (
                      <TableRow key={supplier.supplier}>
                        <TableCell className="font-medium">
                          {supplier.supplier}
                        </TableCell>
                        <TableCell>{supplier.orders}</TableCell>
                        <TableCell>{supplier.delivered}</TableCell>
                        <TableCell>{supplier.onTime}</TableCell>
                        <TableCell>{supplier.avgDelay}</TableCell>
                        <TableCell>
                          <span className="font-medium text-yellow-600">
                            ★ {supplier.rating}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Warehouses */}
          <TabsContent value="warehouses" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Warehouses
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Storage locations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Building2 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    Operational warehouses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Capacity
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18 000 units</div>
                  <p className="text-xs text-muted-foreground">
                    Combined capacity
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Occupation
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">71%</div>
                  <p className="text-xs text-muted-foreground">
                    Average fill rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Warehouse Utilization</CardTitle>
                <CardDescription>
                  Capacity and occupancy per warehouse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>%</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warehouseUtilization.map((wh) => (
                      <TableRow key={wh.code}>
                        <TableCell className="font-medium">
                          {wh.warehouse}
                        </TableCell>
                        <TableCell>{wh.code}</TableCell>
                        <TableCell>{wh.type}</TableCell>
                        <TableCell>{wh.capacity.toLocaleString()}</TableCell>
                        <TableCell>{wh.occupied.toLocaleString()}</TableCell>
                        <TableCell>
                          <span
                            className={
                              wh.percent >= 90
                                ? "text-destructive font-bold"
                                : wh.percent >= 75
                                  ? "text-orange-600 font-medium"
                                  : "text-green-600"
                            }
                          >
                            {wh.percent}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">
                            {wh.status}
                          </Badge>
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
