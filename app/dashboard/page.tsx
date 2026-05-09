"use client"
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
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";


// Données statiques pour la démo (à remplacer par des données réelles)
  const kpiData = {
    itemsInStock: 2847,
    stockValue: 853900.06,
    turnoverRate: 4.2,
    activeAlerts: 23,
    lowStockAlerts: 15,
    expirationAlerts: 8,
    activeSuppliers: 47,
    newSuppliersThisMonth: 3,
    warehouses: 8,
    occupancyRate: 78,
    ordersInProgress: 156,
    lateOrders: 23,
  }

  const criticalAlerts = [
    {
      id: "REF-001",
      name: "Screws M6x20",
      stock: 5,
      threshold: 50,
      type: "breakup" as const,
    },
    {
      id: "REF-045",
      name: "5L engine oil",
      expiration: "01/15/2025",
      type: "lowStock" as const,
    }
  ]

  const recentMovements = [
    {
      id: "CMD-2024-001",
      type: "entrance" as const,
      quantity: 150,
      time: "2 hours ago",
    },
    {
      id: "ORD-2024-089",
      type: "exit" as const,
      quantity: -75,
      time: "4 hours ago",
    },
    {
      id: "TRF-2024-015",
      type: "transfer" as const,
      expiration: "01/15/2025",
    }
  ]



export default function DashboardPage() {
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
                {kpiData.itemsInStock.toLocaleString()}
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
                {kpiData.stockValue} XOF
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
                Turnover rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.turnoverRate} x</div>
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
                {kpiData.activeAlerts}
              </div>
              <p className="text-xs text-muted-foreground">
                {kpiData.lowStockAlerts} low stocks, {kpiData.expirationAlerts} expirations
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
              {criticalAlerts.map((alert, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/20"
                >
                  <div className="flex-1">
                    <p className="font-medium">{alert.id} - {alert.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.type === 'breakup' 
                        ? `Stock: ${alert.stock} units (Threshold: ${alert.threshold})`
                        : `Expiration: ${alert.expiration}`}
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
              {recentMovements.map((movement, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`h-2 w-2 rounded-full ${
                    movement.type === 'entrance' ? 'bg-success' :
                    movement.type === 'exit' ? 'bg-info' : 'bg-warning'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {movement.type === 'entrance' ? 'Reception' : 'Exit'} {movement.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {movement.type !== 'transfer'
                        ? `${movement.quantity > 0 ? '+' : ''}${movement.quantity} units ⋅ ${movement.time}`
                        : `Expiration: ${movement.expiration}`}
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
              <div className="text-2xl font-bold">{kpiData.activeSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                {kpiData.newSuppliersThisMonth} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.warehouses}</div>
              <p className="text-xs text-muted-foreground">
                Occupancy rate: {kpiData.occupancyRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Orders in progress
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiData.ordersInProgress}</div>
              <p className="text-xs text-muted-foreground">
                {kpiData.lateOrders} late
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
