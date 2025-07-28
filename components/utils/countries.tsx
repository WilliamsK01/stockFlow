import { allCOUNTRIES } from "@/lib/allCountries";
import { getFlagEmoji } from "@/lib/getFlagEmoji";
import { Countri } from "@/lib/types";
import { Globe } from "lucide-react";


export const COUNTRIES: Countri[] = allCOUNTRIES.map((c) => ({
  title: c.title,
  value: c.value,
  emoji: getFlagEmoji(c.value),
}));

export const FILTER_COUNTRIES: Countri[] = [
  {
    title: "All countries",
    value: "all",
    icon: <Globe className="w-4 h-4 text-muted-foreground" />,
  },
  ...COUNTRIES,
];
