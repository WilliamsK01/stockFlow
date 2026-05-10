import type { Session } from "next-auth";
import { NextResponse } from "next/server";

export type Role = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 4,
  MANAGER: 3,
  OPERATOR: 2,
  VIEWER: 1,
};

export function getRole(session: Session): Role {
  return ((session.user as { role?: string })?.role ?? "VIEWER") as Role;
}

// CREATE: ADMIN, MANAGER, OPERATOR
export function canCreate(session: Session): boolean {
  return ROLE_HIERARCHY[getRole(session)] >= ROLE_HIERARCHY.OPERATOR;
}

// UPDATE: ADMIN, MANAGER, OPERATOR
export function canUpdate(session: Session): boolean {
  return ROLE_HIERARCHY[getRole(session)] >= ROLE_HIERARCHY.OPERATOR;
}

// DELETE: ADMIN, MANAGER
export function canDelete(session: Session): boolean {
  return ROLE_HIERARCHY[getRole(session)] >= ROLE_HIERARCHY.MANAGER;
}

// Warehouse & Employee management: ADMIN, MANAGER
export function canManageResources(session: Session): boolean {
  return ROLE_HIERARCHY[getRole(session)] >= ROLE_HIERARCHY.MANAGER;
}

// Users & Settings: ADMIN only
export function canManageUsers(session: Session): boolean {
  return getRole(session) === "ADMIN";
}

// Reusable 403 response
export function forbidden() {
  return NextResponse.json({ error: "Forbidden — insufficient role" }, { status: 403 });
}
