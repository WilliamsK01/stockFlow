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
            generate report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Items in stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
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
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">XOF 853,900.06</div>
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
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 x</div>
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
                Active alert
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">23</div>
              <p className="text-xs text-muted-foreground">
                15 low stocks, 8 expirations
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
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/20">
                <div className="flex-1">
                  <p className="font-medium">REF-001 - Screws M6x20</p>
                  <p className="text-xs text-muted-foreground">
                    Stock: 5 units (Threshold: 50)
                  </p>
                </div>
                <Badge variant="destructive">Breackup</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
                <div className="flex-1">
                  <p className="font-medium">REF-045 - 5L engine oil</p>
                  <p className="text-xs text-muted-foreground">
                    Expiration: 01/15/2025
                  </p>
                </div>
                <Badge variant="secondary">Low Stock</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recents movements*/}
          <Card>
            <CardHeader>
              <CardTitle>Recent movements</CardTitle>
              <CardDescription>Latest stock operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <div className="flex-1">
                  <p className="font-medium">Reception CMD-2024-001</p>
                  <p className="text-xs text-muted-foreground">
                    +150 units ⋅ 2 hours ago
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-success text-success-foreground"
                >
                  Entrance
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-info"></div>
                <div className="flex-1">
                  <p className="font-medium">Exit ORD-2024-089</p>
                  <p className="text-xs text-muted-foreground">
                    {" "}
                    -75 units ⋅ 4 hour ago
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-info text-info-foreground"
                >
                  Exit
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-warning"></div>
                <div className="flex-1">
                  <p className="font-medium">Exit ORD-2024-089</p>
                  <p className="text-xs text-muted-foreground">
                    Expiration: 01/15/2025
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-warning text-warning-foreground"
                >
                  Transfert
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats supplementary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active suppliers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">3 news this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Occupancy rate: 78%
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
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">23 late</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
