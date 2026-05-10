import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canUpdate, canDelete, forbidden } from "@/lib/rbac";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const reception = await prisma.reception.findUnique({
      where: { id: Number(id) },
      include: { supplier: true, warehouse: true, lines: { include: { article: true } } },
    });
    if (!reception) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(reception);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canUpdate(session)) return forbidden();
  const { id } = await params;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { lines, ...body } = await req.json();
    const reception = await prisma.reception.update({ where: { id: Number(id) }, data: body });
    return NextResponse.json(reception);
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
    await prisma.reception.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
