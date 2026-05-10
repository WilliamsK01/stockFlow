import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageResources, canDelete, forbidden } from "@/lib/rbac";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: Number(id) },
      include: { locations: { include: { stocks: { include: { article: true } } } } },
    });
    if (!warehouse) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(warehouse);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageResources(session)) return forbidden();
  const { id } = await params;
  try {
    const body = await req.json();
    const warehouse = await prisma.warehouse.update({ where: { id: Number(id) }, data: body });
    return NextResponse.json(warehouse);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canDelete(session)) return forbidden();
  const { id } = await params;
  try {
    await prisma.warehouse.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
