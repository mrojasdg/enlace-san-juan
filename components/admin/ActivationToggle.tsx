"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/utils/cn";

interface ActivationToggleProps {
    businessId: string;
    initialStatus: boolean;
}

export const ActivationToggle = ({ businessId, initialStatus }: ActivationToggleProps) => {
    const [isActive, setIsActive] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (checked: boolean) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("businesses")
                .update({ is_active: checked })
                .eq("id", businessId);

            if (error) throw error;

            setIsActive(checked);
            toast.success(checked ? "Negocio activado correctamente" : "Negocio desactivado correctamente", {
                style: {
                    borderRadius: '1rem',
                    background: '#2A7A3B',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error al actualizar el estado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <Toggle checked={isActive} onChange={handleToggle} disabled={isLoading} />
            <div className={cn(
                "px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest",
                isActive ? "bg-green-pale text-green" : "bg-red-50 text-red-500"
            )}>
                {isActive ? "Público" : "Oculto"}
            </div>
        </div>
    );
};
