import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { supplier: true, warehouse: true, lines: { include: { article: true } } },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { lines, ...rest } = await req.json();
    const order = await prisma.order.create({
      data: { ...rest, lines: { create: lines ?? [] } },
      include: { supplier: true, warehouse: true, lines: { include: { article: true } } },
    });
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
