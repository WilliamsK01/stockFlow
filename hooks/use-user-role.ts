"use client";

import { useSession } from "next-auth/react";
import type { Role } from "@/lib/rbac";
import { ROLE_HIERARCHY } from "@/lib/rbac";

export function useUserRole() {
  const { data: session } = useSession();
  const role = ((session?.user as { role?: string })?.role ?? "VIEWER") as Role;
  const level = ROLE_HIERARCHY[role];

  return {
    role,
    isAdmin:           role === "ADMIN",
    isManager:         level >= ROLE_HIERARCHY.MANAGER,
    isOperator:        level >= ROLE_HIERARCHY.OPERATOR,
    canCreate:         level >= ROLE_HIERARCHY.OPERATOR,
    canEdit:           level >= ROLE_HIERARCHY.OPERATOR,
    canDelete:         level >= ROLE_HIERARCHY.MANAGER,
    canManageResources: level >= ROLE_HIERARCHY.MANAGER,
    canManageUsers:    role === "ADMIN",
  };
}
