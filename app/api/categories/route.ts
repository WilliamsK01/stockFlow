import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        parent: true,
        children: true,
        _count: { select: { articles: true } },
      },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const item = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
        parentId: body.parentId,
        seuilRotation: body.seuilRotation,
        autoClassification: body.autoClassification,
        active: body.active,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
