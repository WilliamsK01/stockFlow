import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [
      articlesCount,
      stockValue,
      activeAlerts,
      suppliersCount,
      warehousesCount,
      recentMovements,
      criticalAlerts,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.stock.aggregate({ _sum: { quantity: true } }),
      prisma.alert.count({ where: { status: "ACTIVE" } }),
      prisma.supplier.count({ where: { status: "ACTIVE" } }),
      prisma.warehouse.count({ where: { status: "ACTIVE" } }),
      prisma.movement.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { sourceWarehouse: true, destWarehouse: true },
      }),
      prisma.alert.findMany({
        where: { status: "ACTIVE", level: { in: ["CRITICAL", "HIGH"] } },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { article: true },
      }),
    ]);

    return NextResponse.json({
      articlesCount,
      totalStock: stockValue._sum.quantity ?? 0,
      activeAlerts,
      suppliersCount,
      warehousesCount,
      recentMovements,
      criticalAlerts,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
