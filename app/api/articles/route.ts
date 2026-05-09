import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        supplier: true,
        barcodes: true,
        stocks: { include: { location: true } },
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
    const item = await prisma.article.create({
      data: {
        reference: body.reference,
        designation: body.designation,
        description: body.description,
        classification: body.classification,
        uniteMesure: body.uniteMesure,
        weight: body.weight,
        volume: body.volume,
        seuilMin: body.seuilMin,
        seuilMax: body.seuilMax,
        unitPrice: body.unitPrice,
        status: body.status,
        categoryId: body.categoryId,
        supplierId: body.supplierId,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
