import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DAYS = 30;

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

    const articles = await prisma.article.findMany({
      include: {
        category: { select: { name: true } },
        stocks: { select: { quantity: true } },
        movementLines: {
          where: {
            movement: {
              type: "EXIT",
              status: "COMPLETED",
              executionDate: { gte: since },
            },
          },
          select: { quantity: true },
        },
      },
    });

    const forecasts = articles.map((article) => {
      const currentStock = article.stocks.reduce((s, l) => s + l.quantity, 0);
      const totalExited = article.movementLines.reduce((s, l) => s + l.quantity, 0);
      const dailyConsumption = parseFloat((totalExited / DAYS).toFixed(2));

      const daysRemaining =
        dailyConsumption > 0
          ? Math.min(Math.floor(currentStock / dailyConsumption), 999)
          : 999;

      let status: "Critical" | "Low" | "Normal" | "Overstocked";
      if (currentStock <= article.seuilMin) {
        status = "Critical";
      } else if (currentStock <= article.seuilMin * 1.5 || daysRemaining <= 14) {
        status = "Low";
      } else if (article.seuilMax > 0 && currentStock >= article.seuilMax * 0.9) {
        status = "Overstocked";
      } else {
        status = "Normal";
      }

      const recommendedOrderQty =
        status === "Critical" || status === "Low"
          ? Math.max(0, article.seuilMax - currentStock)
          : 0;

      return {
        id: article.id,
        reference: article.reference,
        designation: article.designation,
        category: article.category?.name ?? "",
        currentStock,
        dailyConsumption,
        daysRemaining,
        recommendedOrderQty,
        reorderPoint: article.seuilMin,
        status,
      };
    });

    return NextResponse.json(forecasts);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
