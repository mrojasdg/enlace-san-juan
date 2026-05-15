import { Business } from "@/types/business";
import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import {
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Pin as Pinterest,
    Linkedin,
    Music2 as Tiktok,
    Share2,
    FileText,
    ChevronRight,
    MessageCircle,
    Layers,
    CreditCard,
    Banknote,
    Receipt,
    Bike,
    ShoppingBag,
    CalendarCheck,
    Car,
    Wifi,
    Snowflake,
    Dog,
    Gamepad2
} from "lucide-react";
import { isOpenNow } from "@/utils/schedule";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CTASection } from "@/components/home/CTASection";
import { ViewTracker } from "@/components/business/ViewTracker";
import dynamic from "next/dynamic";

const BusinessGallery = dynamic(() => import("@/components/business/BusinessGallery").then(mod => mod.default), { ssr: false });
const BusinessMap = dynamic(() => import("@/components/business/BusinessMap").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-green-xpale animate-pulse rounded-[1.5rem]" />
});

const ALL_FEATURES = [
    { id: "Pago con tarjeta", label: "Pago con tarjeta", icon: CreditCard },
    { id: "Pago con transferencia", label: "Pago con transferencia", icon: Banknote },
    { id: "Facturación disponible", label: "Facturación disponible", icon: Receipt },
    { id: "Servicio a domicilio", label: "Servicio a domicilio", icon: Bike },
    { id: "Para llevar", label: "Para llevar", icon: ShoppingBag },
    { id: "Pueden reservar", label: "Pueden reservar", icon: CalendarCheck },
    { id: "Estacionamiento", label: "Estacionamiento", icon: Car },
    { id: "Con WiFi", label: "Con WiFi", icon: Wifi },
    { id: "Aire acondicionado", label: "Aire acondicionado", icon: Snowflake },
    { id: "Pet friendly", label: "Pet friendly", icon: Dog },
    { id: "Con juegos infantiles", label: "Con juegos infantiles", icon: Gamepad2 },