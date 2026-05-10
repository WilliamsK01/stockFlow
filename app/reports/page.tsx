"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, TrendingUp, Package, Users, Building2, ArrowUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StockArticle { reference: string; designation: string; category: string; stock: number; unitPrice: number; totalValue: number; classification: string; }
interface MovementRow { reference: string; type: string; article: string; quantity: number; warehouse: string; date: string; status: string; }
interface SupplierRow { supplier: string; orders: number; delivered: number; onTime: number; avgDelay: number; rating: number; }
interface WarehouseRow { warehouse: string; code: string; type: string; capacity: number; occupied: number; percent: number; status: string; }

interface ReportsData {
  stock: { articlesCount: number; totalStockValue: number; lowStockCount: number; classACount: number; articles: StockArticle[]; };
  movements: { total: number; entries: number; exits: number; transfers: number; adjustments: number; recent: MovementRow[]; };
  suppliers: { total: number; active: number; avgRating: number; performance: SupplierRow[]; };
  warehouses: { total: number; active: number; totalCapacity: number; avgOccupation: number; utilization: WarehouseRow[]; };
}

const getClassificationBadge = (classification: string) => {
  const colors: Record<string, string> = {
    A: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    B: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    C: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
  return <Badge className={colors[classification] || "bg-slate-100 text-gray-800"}>Class {classification}</Badge>;
};

const getMovementBadge = (type: string) => {
  switch (type) {
    case "ENTRY": return <Badge className="bg-success text-success-foreground">Entry</Badge>;
    case "EXIT": return <Badge variant="destructive">Exit</Badge>;
    case "TRANSFER": return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Transfer</Badge>;
    case "ADJUSTMENT": return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Adjustment</Badge>;
    default: return <Badge variant="outline">{type}</Badge>;
  }
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => toast.error("Failed to load report data"))
      .finally(() => setLoading(false));
  }, []);

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
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">Analytics and performance reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Period" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />Export
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

          {/* ── Tab Stock ──────────────────────────────────────── */}
          <TabsContent value="stock" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.stock.articlesCount ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Articles in catalog</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">XOF {(data?.stock.totalStockValue ?? 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Valued inventory</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">{data?.stock.lowStockCount ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Require replenishment</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">A-Class Items</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.stock.classACount ?? 0}</div>
                  <p className="text-xs text-muted-foreground">High-value articles</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Top Articles by Value</CardTitle>
                <CardDescription>Highest value items in your inventory</CardDescription>
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
                    {(data?.stock.articles ?? []).map((article) => (
                      <TableRow key={article.reference}>
                        <TableCell className="font-medium">{article.reference}</TableCell>
                        <TableCell>{article.designation}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.stock}</TableCell>
                        <TableCell>XOF {article.unitPrice.toLocaleString()}</TableCell>
                        <TableCell>XOF {article.totalValue.toLocaleString()}</TableCell>
                        <TableCell>{getClassificationBadge(article.classification)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab Movements ──────────────────────────────────── */}
          <TabsContent value="movements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.movements.total ?? 0}</div>
                  <p className="text-xs text-muted-foreground">This period</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Entries</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.movements.entries ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Stock receptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Exits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.movements.exits ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Stock outflows</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transfers</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.movements.transfers ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Between warehouses</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Movement History</CardTitle>
                <CardDescription>Recent stock operations</CardDescription>
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
                    {(data?.movements.recent ?? []).map((mvt) => (
                      <TableRow key={mvt.reference}>
                        <TableCell className="font-medium">{mvt.reference}</TableCell>
                        <TableCell>{getMovementBadge(mvt.type)}</TableCell>
                        <TableCell>{mvt.article}</TableCell>
                        <TableCell>
                          <span className={mvt.quantity > 0 ? "text-green-600 font-medium" : mvt.quantity < 0 ? "text-destructive font-medium" : ""}>
                            {mvt.quantity > 0 ? `+${mvt.quantity}` : mvt.quantity}
                          </span>
                        </TableCell>
                        <TableCell>{mvt.warehouse}</TableCell>
                        <TableCell>{mvt.date}</TableCell>
                        <TableCell>
                          <Badge className="bg-success text-success-foreground">{mvt.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab Suppliers ──────────────────────────────────── */}
          <TabsContent value="suppliers" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.suppliers.active ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Registered partners</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.suppliers.total ?? 0}</div>
                  <p className="text-xs text-muted-foreground">In database</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">★ {data?.suppliers.avgRating ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Quality average</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.suppliers.performance.length ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Tracked suppliers</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Delivery and quality metrics per supplier</CardDescription>
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
                    {(data?.suppliers.performance ?? []).map((supplier) => (
                      <TableRow key={supplier.supplier}>
                        <TableCell className="font-medium">{supplier.supplier}</TableCell>
                        <TableCell>{supplier.orders}</TableCell>
                        <TableCell>{supplier.delivered}</TableCell>
                        <TableCell>{supplier.onTime}</TableCell>
                        <TableCell>{supplier.avgDelay}</TableCell>
                        <TableCell><span className="font-medium text-yellow-600">★ {supplier.rating}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Tab Warehouses ─────────────────────────────────── */}
          <TabsContent value="warehouses" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.warehouses.total ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Storage locations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <Building2 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.warehouses.active ?? 0}</div>
                  <p className="text-xs text-muted-foreground">Operational warehouses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(data?.warehouses.totalCapacity ?? 0).toLocaleString()} units</div>
                  <p className="text-xs text-muted-foreground">Combined capacity</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Occupation</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data?.warehouses.avgOccupation ?? 0}%</div>
                  <p className="text-xs text-muted-foreground">Average fill rate</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Utilization</CardTitle>
                <CardDescription>Capacity and occupancy per warehouse</CardDescription>
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
                    {(data?.warehouses.utilization ?? []).map((wh) => (
                      <TableRow key={wh.code}>
                        <TableCell className="font-medium">{wh.warehouse}</TableCell>
                        <TableCell>{wh.code}</TableCell>
                        <TableCell>{wh.type}</TableCell>
                        <TableCell>{wh.capacity.toLocaleString()}</TableCell>
                        <TableCell>{wh.occupied.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={wh.percent >= 90 ? "text-destructive font-bold" : wh.percent >= 75 ? "text-orange-600 font-medium" : "text-green-600"}>
                            {wh.percent}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={wh.status === "Critical" ? "bg-destructive text-destructive-foreground" : wh.status === "Warning" ? "bg-orange-100 text-orange-800" : "bg-success text-success-foreground"}>
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
