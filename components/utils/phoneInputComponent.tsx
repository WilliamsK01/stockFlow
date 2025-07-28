import { cn } from "@/lib/utils";
import React from "react";

export const PhoneInputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full px-3 py-2 rounded-md border text-sm",
                    "bg-white text-black border-gray-300",
                    "dark:bg-slate-900 dark:text-white dark:border-slate-700",
                    className
                )}
                {...props}
            />
        );
    }
);
PhoneInputComponent.displayName = "PhoneInputComponent";
