import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageResources, forbidden } from "@/lib/rbac";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { lastName: "asc" },
      include: { warehouse: { select: { name: true } } },
    });
    return NextResponse.json(employees);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageResources(session)) return forbidden();
  try {
    const body = await req.json();
    const employee = await prisma.employee.create({ data: body });
    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
