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
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div className={cn(
                    "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-pale rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green",
                    disabled && "opacity-50"
                )}></div>
            </div>
            {label && <span className="text-sm font-medium text-ink">{label}</span>}
        </label>
    );
};

export { Toggle };
