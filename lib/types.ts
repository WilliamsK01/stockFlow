
// types.ts
import type { ReactNode } from "react";

export type Countri = {
  title: string;
  value: string;
  emoji?: string;
  icon?: ReactNode; // par exemple <Globe />
};
