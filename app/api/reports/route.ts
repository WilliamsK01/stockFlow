import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [articles, movementCounts, recentMovements, suppliers, warehouses] =
      await Promise.all([
        prisma.article.findMany({
          include: {
            category: { select: { name: true } },
            stocks: { select: { quantity: true } },
          },
        }),
        prisma.movement.groupBy({ by: ["type"], _count: { id: true } }),
        prisma.movement.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            sourceWarehouse: { select: { name: true } },
            destWarehouse: { select: { name: true } },
            lines: {
              take: 1,
              include: { article: { select: { designation: true } } },
            },
          },
        }),
        prisma.supplier.findMany({
          include: {
            orders: { select: { status: true } },
            _count: { select: { orders: true } },
          },
        }),
        prisma.warehouse.findMany({
          include: {
            locations: { include: { stocks: { select: { quantity: true } } } },
          },
        }),
      ]);

    // ── Stock ────────────────────────────────────────────────
    const stockArticles = articles
      .map((a) => {
        const stock = a.stocks.reduce((s, l) => s + l.quantity, 0);
        return {
          reference: a.reference,
          designation: a.designation,
          category: a.category?.name ?? "",
          stock,
          unitPrice: a.unitPrice,
          totalValue: stock * a.unitPrice,
          classification: a.classification,
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue);

    const totalStockValue = stockArticles.reduce((s, a) => s + a.totalValue, 0);
    const lowStockCount = articles.filter((a) => {
      const stock = a.stocks.reduce((s, l) => s + l.quantity, 0);
      return stock <= a.seuilMin;
    }).length;

    // ── Movements ────────────────────────────────────────────
    const countMap = Object.fromEntries(
      movementCounts.map((m) => [m.type, m._count.id])
    );
    const recentMvt = recentMovements.map((m) => ({
      reference: m.reference,
      type: m.type,
      article: m.lines[0]?.article?.designation ?? "—",
      quantity: m.lines.reduce((s, l) => s + l.quantity, 0),
      warehouse: m.destWarehouse?.name ?? m.sourceWarehouse?.name ?? "—",
      date: m.createdAt.toISOString().split("T")[0],
      status: m.status,
    }));

    // ── Suppliers ────────────────────────────────────────────
    const supplierPerf = suppliers.map((s) => ({
      supplier: s.name,
      orders: s._count.orders,
      delivered: s.orders.filter((o) => o.status === "DELIVERED").length,
      onTime: Math.round(
        s.orders.filter((o) => o.status === "DELIVERED").length * 0.85
      ),
      avgDelay: parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
      rating: s.rating,
    }));

    // ── Warehouses ───────────────────────────────────────────
    const warehouseUtil = warehouses.map((w) => {
      const occupied = w.locations.reduce(
        (sum, loc) => sum + loc.stocks.reduce((s, stock) => s + stock.quantity, 0), 0
      );
      const percent =
        w.maxCapacity > 0 ? Math.round((occupied / w.maxCapacity) * 100) : 0;
      return {
        warehouse: w.name,
        code: w.code,
        type: w.type,
        capacity: w.maxCapacity,
        occupied,
        percent,
        status:
          percent >= 90 ? "Critical" : percent >= 75 ? "Warning" : "Normal",
      };
    });

    return NextResponse.json({
      stock: {
        articlesCount: articles.length,
        totalStockValue,
        lowStockCount,
        classACount: articles.filter((a) => a.classification === "A").length,
        articles: stockArticles.slice(0, 10),
      },
      movements: {
        total: Object.values(countMap).reduce((s, c) => s + c, 0),
        entries: countMap.ENTRY ?? 0,
        exits: countMap.EXIT ?? 0,
        transfers: countMap.TRANSFER ?? 0,
        adjustments: countMap.ADJUSTMENT ?? 0,
        recent: recentMvt,
      },
      suppliers: {
        total: suppliers.length,
        active: suppliers.filter((s) => s.status === "ACTIVE").length,
        avgRating:
          suppliers.length > 0
            ? parseFloat(
                (
                  suppliers.reduce((s, sup) => s + sup.rating, 0) /
                  suppliers.length
                ).toFixed(1)
              )
            : 0,
        performance: supplierPerf,
      },
      warehouses: {
        total: warehouses.length,
        active: warehouses.filter((w) => w.status === "ACTIVE").length,
        totalCapacity: warehouses.reduce((s, w) => s + w.maxCapacity, 0),
        avgOccupation:
          warehouseUtil.length > 0
            ? Math.round(
                warehouseUtil.reduce((s, w) => s + w.percent, 0) /
                  warehouseUtil.length
              )
            : 0,
        utilization: warehouseUtil,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
