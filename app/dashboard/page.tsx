"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Users,
  Building2,
  BarChart3,
  Loader2,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";

interface DashboardData {
  articlesCount: number;
  totalStock: number;
  activeAlerts: number;
  suppliersCount: number;
  warehousesCount: number;
  recentMovements: Array<{
    id: number;
    reference: string;
    type: string;
    createdAt: string;
    sourceWarehouse?: { name: string } | null;
    destWarehouse?: { name: string } | null;
  }>;
  criticalAlerts: Array<{
    id: number;
    reference: string;
    type: string;
    level: string;
    message: string;
    article?: { reference: string; designation: string } | null;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your inventory management
            </p>
          </div>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Items in stock
              </CardTitle>
              <Package className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(data?.articlesCount ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from this month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock value</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(data?.totalStock ?? 0).toLocaleString()} XOF
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2% from this month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Warehouses
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.warehousesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-destructive flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -2.1% from this month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {data?.activeAlerts ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.criticalAlerts?.length ?? 0} critical alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Critical alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Critical alerts
              </CardTitle>
              <CardDescription>
                Items requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.criticalAlerts ?? []).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/20"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {alert.reference} - {alert.article?.designation ?? alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.level}
                    </p>
                  </div>
                  <Badge variant={alert.type === 'breakup' ? "destructive" : "secondary"}>
                    {alert.type === 'breakup' ? 'Breakup' : 'Low Stock'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent movements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent movements</CardTitle>
              <CardDescription>Latest stock operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.recentMovements ?? []).map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`h-2 w-2 rounded-full ${
                    movement.type === 'entrance' ? 'bg-success' :
                    movement.type === 'exit' ? 'bg-info' : 'bg-warning'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {movement.type === 'entrance' ? 'Reception' : movement.type === 'exit' ? 'Exit' : 'Transfer'} {movement.reference}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      movement.type === 'entrance' ? 'bg-success text-success-foreground' :
                      movement.type === 'exit' ? 'bg-info text-info-foreground' :
                      'bg-warning text-warning-foreground'
                    }`}
                  >
                    {movement.type === 'entrance' ? 'Entrance' : movement.type === 'exit' ? 'Exit' : 'Transfer'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Supplementary stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active suppliers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.suppliersCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Suppliers in the system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.warehousesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Active warehouses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Articles
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.articlesCount ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered articles
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
