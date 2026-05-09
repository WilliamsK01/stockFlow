import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const movements = await prisma.movement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sourceWarehouse: true,
        destWarehouse: true,
        user: { select: { name: true } },
        lines: { include: { article: true } },
      },
    });
    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { lines, ...rest } = await req.json();
    const movement = await prisma.movement.create({
      data: { ...rest, lines: { create: lines ?? [] } },
      include: { lines: { include: { article: true } } },
    });
    return NextResponse.json(movement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
