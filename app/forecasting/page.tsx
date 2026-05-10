"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  ShoppingCart,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ForecastItem {
  id: number;
  reference: string;
  designation: string;
  category: string;
  currentStock: number;
  dailyConsumption: number;
  daysRemaining: number;
  recommendedOrderQty: number;
  reorderPoint: number;
  status: "Critical" | "Low" | "Normal" | "Overstocked";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _mockForecasts: ForecastItem[] = [
  {
    id: 1,
    reference: "REF-001",
    designation: "Vis M6x20 Inox",
    category: "Screws",
    currentStock: 150,
    dailyConsumption: 8.5,
    daysRemaining: 17,
    recommendedOrderQty: 340,
    reorderPoint: 85,
    status: "Low",
  },
  {
    id: 2,
    reference: "REF-002",
    designation: "Huile moteur 5L SAE",
    category: "Lubricant",
    currentStock: 25,
    dailyConsumption: 3.2,
    daysRemaining: 7,
    recommendedOrderQty: 120,
    reorderPoint: 32,
    status: "Critical",
  },
  {
    id: 3,
    reference: "REF-003",
    designation: "Roulement SKF 6205",
    category: "Bearings",
    currentStock: 5,
    dailyConsumption: 1.8,
    daysRemaining: 2,
    recommendedOrderQty: 90,
    reorderPoint: 18,
    status: "Critical",
  },
  {
    id: 4,
    reference: "REF-004",
    designation: "Filtre à huile",
    category: "Filters",
    currentStock: 80,
    dailyConsumption: 2.1,
    daysRemaining: 38,
    recommendedOrderQty: 0,
    reorderPoint: 21,
    status: "Normal",
  },
  {
    id: 5,
    reference: "REF-005",
    designation: "Joint torique 50mm",
    category: "Seals",
    currentStock: 320,
    dailyConsumption: 4.0,
    daysRemaining: 80,
    recommendedOrderQty: 0,
    reorderPoint: 40,
    status: "Overstocked",
  },
  {
    id: 6,
    reference: "REF-006",
    designation: "Câble électrique 2.5mm",
    category: "Electrical",
    currentStock: 42,
    dailyConsumption: 5.5,
    daysRemaining: 7,
    recommendedOrderQty: 200,
    reorderPoint: 55,
    status: "Critical",
  },
];

const getStatusBadge = (status: ForecastItem["status"]) => {
  switch (status) {
    case "Critical":
      return <Badge variant="destructive">Critical</Badge>;
    case "Low":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          Low
        </Badge>
      );
    case "Normal":
      return (
        <Badge className="bg-success text-success-foreground">Normal</Badge>
      );
    case "Overstocked":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Overstocked
        </Badge>
      );
  }
};

const getDaysCell = (days: number) => (
  <span
    className={
      days < 7
        ? "text-destructive font-bold"
        : days < 30
          ? "text-orange-600 font-medium"
          : "text-green-600"
    }
  >
    {days} days
  </span>
);

export default function ForecastingPage() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/forecasting")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setForecasts(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Failed to load forecast data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <MainLayout>
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </MainLayout>
  );

  const filteredForecasts = forecasts.filter((item) => {
    const matchesSearch =
      item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const itemsToReplenish = forecasts.filter(
    (i) => i.status === "Critical" || i.status === "Low",
  ).length;
  const criticalCount = forecasts.filter(
    (i) => i.status === "Critical",
  ).length;
  const overstockedCount = forecasts.filter(
    (i) => i.status === "Overstocked",
  ).length;
  const avgDailyConsumption = forecasts.length > 0
    ? (forecasts.reduce((sum, i) => sum + i.dailyConsumption, 0) / forecasts.length).toFixed(1)
    : "0.0";

  const replenishmentItems = forecasts.filter(
    (i) => i.status === "Critical" || i.status === "Low",
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Stock Forecasting
            </h1>
            <p className="text-sm text-muted-foreground">
              Predictive analysis and replenishment recommendations
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Items to Replenish
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsToReplenish}</div>
              <p className="text-xs text-muted-foreground">
                Requires urgent order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Daily Consumption
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDailyConsumption}</div>
              <p className="text-xs text-muted-foreground">
                units/day across all items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {criticalCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Less than 7 days remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overstocked</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overstockedCount}</div>
              <p className="text-xs text-muted-foreground">
                Excess inventory detected
              </p>
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
                    placeholder="Search by reference or designation..."
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
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Overstocked">Overstocked</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Screws">Screws</SelectItem>
                  <SelectItem value="Lubricant">Lubricant</SelectItem>
                  <SelectItem value="Bearings">Bearings</SelectItem>
                  <SelectItem value="Filters">Filters</SelectItem>
                  <SelectItem value="Seals">Seals</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Forecast Overview ({filteredForecasts.length})
            </CardTitle>
            <CardDescription>
              Stock levels and consumption predictions for all items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Daily Consumption</TableHead>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Recommended Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForecasts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.reference}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.designation}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.currentStock}</TableCell>
                    <TableCell>{item.dailyConsumption} unit/day</TableCell>
                    <TableCell>{getDaysCell(item.daysRemaining)}</TableCell>
                    <TableCell>{item.reorderPoint}</TableCell>
                    <TableCell>
                      {item.status === "Normal" || item.status === "Overstocked"
                        ? "—"
                        : item.recommendedOrderQty}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Replenishment Plan
            </CardTitle>
            <CardDescription>
              Summary of articles requiring immediate ordering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Recommended Qty</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replenishmentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.reference}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.designation}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{item.recommendedOrderQty}</TableCell>
                    <TableCell>
                      XOF{" "}
                      {(item.recommendedOrderQty * 1000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.status === "Critical" ? (
                        <Badge variant="destructive">Critical</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                          High
                        </Badge>
                      )}
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
