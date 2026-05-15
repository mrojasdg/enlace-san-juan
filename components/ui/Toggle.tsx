import * as React from "react";
import { cn } from "@/utils/cn";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

const Toggle = ({ checked, onChange, label, disabled }: ToggleProps) => {
    return (
        <label className={cn(
            "flex items-center gap-3 cursor-pointer select-none",
            disabled && "opacity-50 pointer-events-none"
        )}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div className={cn(
                    "w-11 h-6 rounded-full transition-colors duration-200",
                    checked ? "bg-green" : "bg-gray-200"
                )} />
                <div className={cn(
                    "absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm",
                    checked && "translate-x-5"
                )} />
            </div>
            {label && <span className="text-sm font-medium text-ink2">{label}</span>}
        </label>
    );
};

export { Toggle };
