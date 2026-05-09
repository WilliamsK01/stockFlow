import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const item = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        supplier: true,
        barcodes: true,
        stocks: { include: { location: true } },
      },
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.article.update({
      where: { id: Number(id) },
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
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.article.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
