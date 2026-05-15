import * as React from "react";
import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "green" | "gold" | "gray" | "blue";
}

const Badge = ({ className, variant = "green", ...props }: BadgeProps) => {
    const variants = {
        green: "bg-green-pale text-green",
        gold: "bg-gold text-white",
        gray: "bg-green-xpale text-muted",
        blue: "bg-blue-50 text-blue-600",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

export { Badge };
