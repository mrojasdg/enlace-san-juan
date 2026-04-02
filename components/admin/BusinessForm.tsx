'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Business, Category } from '@/types/business';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import {
  Building2,
  MapPin,
  Clock,
  Camera as ImageIcon,
  Star,
  MessageCircle,
  Plus,
  Trash2,
  Globe,
  Save,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Pin as Pinterest,
  Music2 as Tiktok,
  Upload as UploadIcon,
  FileText,
  CheckCircle2,
  X,
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
  Gamepad2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { generateSlug } from '@/utils/slug';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { UberEatsIcon, DidiFoodIcon, RappiIcon } from '@/components/shared/CustomIcons';

const MapPicker = dynamic(
  () => import('./MapPicker').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full bg-green-xpale animate-pulse rounded-3xl flex items-center justify-center text-muted font-black uppercase text-[10px] tracking-widest">
        Cargando Mapa...
      </div>
    ),
  }
);

// Form Schema
const businessSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  slug: z.string().min(3, 'Mínimo 3 caracteres'),
  tagline: z.string().nullable().optional().or(z.literal('')),
  description: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(800, 'Máximo 800 caracteres'),
  category_id: z.string().uuid('Selecciona una categoría'),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(false),
  verified: z.boolean().default(false),
  phone: z.string().nullable().optional().or(z.literal('')),
  whatsapp: z.string().nullable().optional().or(z.literal('')),
  email: z.string().nullable().optional().or(z.literal('')),
  contact_name: z.string().nullable().optional().or(z.literal('')),
  contact_email: z.string().nullable().optional().or(z.literal('')),
  contact_phone: z.string().nullable().optional().or(z.literal('')),
  website: z.string().nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional().or(z.literal('')),
  neighborhood: z.string().nullable().optional().or(z.literal('')),
  city: z.string().default('San Juan del Río'),
  state: z.string().default('Querétaro'),
  maps_embed_url: z.string().nullable().optional().or(z.literal('')),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  in_magazine: z.boolean().default(false),
  magazine_month: z.string().nullable().optional().or(z.literal('')),
  facebook: z.string().nullable().optional().or(z.literal('')),
  instagram: z.string().nullable().optional().or(z.literal('')),
  twitter_x: z.string().nullable().optional().or(z.literal('')),
  youtube: z.string().nullable().optional().or(z.literal('')),
  tiktok: z.string().nullable().optional().or(z.literal('')),
  pinterest: z.string().nullable().optional().or(z.literal('')),
  linkedin: z.string().nullable().optional().or(z.literal('')),
  uber_eats: z.string().nullable().optional().or(z.literal('')),
  didi_food: z.string().nullable().optional().or(z.literal('')),
  rappi: z.string().nullable().optional().or(z.literal('')),
  features: z.array(z.string()).default([]),
  catalog_label: z.string().nullable().optional().default('Menú / Catálogo'),
  search_keywords: z.string().nullable().optional().or(z.literal('')),
  schedule: z
    .record(
      z.object({
        open: z.string().nullable().optional(),
        close: z.string().nullable().optional(),
        closed: z.boolean().default(false),
      })
    )
    .default({
      lunes: { open: '09:00', close: '18:00', closed: false },
      martes: { open: '09:00', close: '18:00', closed: false },
      miercoles: { open: '09:00', close: '18:00', closed: false },
      jueves: { open: '09:00', close: '18:00', closed: false },
      viernes: { open: '09:00', close: '18:00', closed: false },
      sabado: { open: '10:00', close: '14:00', closed: false },
      domingo: { open: '', close: '', closed: true },
    }),
  terms_accepted: z.boolean().default(false),
});

interface BusinessFormProps {
  initialData?: Business;
  categories: Category[];
  isPublicRegistration?: boolean;
}

const ALL_FEATURES = [
  { id: 'Pago con tarjeta', label: 'Pago con tarjeta', icon: CreditCard },
  {
    id: 'Pago con transferencia',
    label: 'Pago con transferencia',
    icon: Banknote,
  },
  {
    id: 'Facturación disponible',
    label: 'Facturación disponible',
    icon: Receipt,
  },
  { id: 'Servicio a domicilio', label: 'Servicio a domicilio', icon: Bike },
  { id: 'Para llevar', label: 'Para llevar', icon: ShoppingBag },
  { id: 'Pueden reservar', label: 'Pueden reservar', icon: CalendarCheck },
  { id: 'Estacionamiento', label: 'Estacionamiento', icon: Car },
  { id: 'Con WiFi', label: 'Con WiFi', icon: Wifi },
  { id: 'Aire acondicionado', label: 'Aire acondicionado', icon: Snowflake },
  { id: 'Pet friendly', label: 'Pet friendly', icon: Dog },
  {
    id: 'Con juegos infantiles',
    label: 'Con juegos infantiles',
    icon: Gamepad2,
  },
];

export const BusinessForm = ({
  initialData,
  categories,
  isPublicRegistration = false,
}: BusinessFormProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Assets State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>(
    initialData?.gallery_urls || []
  );

  // Previews
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo_url || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover_url || null
  );
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(
    initialData?.catalog_pdf_url || null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData
      ? {
        ...initialData,
        is_featured: !!initialData.is_featured,
        is_active: !!initialData.is_active,
        verified: !!initialData.verified,
        in_magazine: !!initialData.in_magazine,
        tagline: initialData.tagline || '',
        phone: initialData.phone || '',
        whatsapp: initialData.whatsapp || '',
        email: initialData.email || '',
        contact_name: initialData.contact_name || '',
        contact_email: initialData.contact_email || '',
        contact_phone: initialData.contact_phone || '',
        website: initialData.website || '',
        address: initialData.address || '',
        neighborhood: initialData.neighborhood || '',
        maps_embed_url: initialData.maps_embed_url || '',
        magazine_month: initialData.magazine_month || '',
        facebook: initialData.facebook || '',
        instagram: initialData.instagram || '',
        twitter_x: initialData.twitter_x || '',
        youtube: initialData.youtube || '',
        catalog_label: initialData.catalog_label || 'Menú / Catálogo',
        search_keywords: initialData.search_keywords || '',
      }
      : {
        name: '',
        slug: '',
        tagline: '',
        description: '',
        category_id: '',
        is_featured: false,
        is_active: false,
        verified: false,
        city: 'San Juan del Río',
        state: 'Querétaro',
        in_magazine: false,
        features: [],
        catalog_label: 'Menú / Catálogo',
        search_keywords: '',
        latitude: 20.3889,
        longitude: -100.0039,
        schedule: {
          lunes: { open: '09:00', close: '18:00', closed: false },
          martes: { open: '09:00', close: '18:00', closed: false },
          miercoles: { open: '09:00', close: '18:00', closed: false },
          jueves: { open: '09:00', close: '18:00', closed: false },
          viernes: { open: '09:00', close: '18:00', closed: false },
          sabado: { open: '10:00', close: '14:00', closed: false },
          domingo: { open: null, close: null, closed: true },
        },
        terms_accepted: false,
      },
  });

  const nameValue = watch('name');
  useEffect(() => {
    if (!initialData && nameValue) {
      setValue('slug', generateSlug(nameValue));
    }
  }, [nameValue, setValue, initialData]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length + existingGallery.length + galleryFiles.length > 20) {
      toast.error('Máximo 20 imágenes en total');
      return;
    }
    setGalleryFiles([...galleryFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...newPreviews]);
  };

  const removeGalleryFile = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingGallery(existingGallery.filter((_, i) => i !== index));
    } else {
      const newFiles = [...galleryFiles];
      newFiles.splice(index, 1);
      setGalleryFiles(newFiles);

      const newPreviews = [...galleryPreviews];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setGalleryPreviews(newPreviews);
    }
  };

  const onSubmit = async (values: z.infer<typeof businessSchema>) => {
    setLoading(true);
    const slug = values.slug;

    try {
      let logo_url = initialData?.logo_url;
      let cover_url = initialData?.cover_url;
      let gallery_urls = [...existingGallery];

      // Upload Logo
      if (logoFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`logos/${slug}-${Date.now()}.png`, logoFile, {
            upsert: true,
          });
        if (uploadError) throw uploadError;
        logo_url = supabase.storage
          .from('business-assets')
          .getPublicUrl(data.path).data.publicUrl;
      }

      // Upload Cover
      if (coverFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`covers/${slug}-${Date.now()}.png`, coverFile, {
            upsert: true,
          });
        if (uploadError) throw uploadError;
        cover_url = supabase.storage
          .from('business-assets')
          .getPublicUrl(data.path).data.publicUrl;
      }

      // Upload Gallery
      for (const file of galleryFiles) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`galleries/${slug}/${Date.now()}-${file.name}`, file, {
            upsert: true,
          });
        if (uploadError) throw uploadError;
        gallery_urls.push(
          supabase.storage.from('business-assets').getPublicUrl(data.path).data
            .publicUrl
        );
      }

      // Upload PDF
      let catalog_pdf_url = pdfUrl;
      if (pdfFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`catalogs/${slug}-${Date.now()}.pdf`, pdfFile, {
            upsert: true,
          });
        if (uploadError) throw uploadError;
        catalog_pdf_url = supabase.storage
          .from('business-assets')
          .getPublicUrl(data.path).data.publicUrl;
      }

      const finalData = {
        ...values,
        logo_url,
        cover_url,
        gallery_urls,
        catalog_pdf_url,
      };

      // Remove terms_accepted from finalData if it exists as it's not a DB column
      const { terms_accepted, ...dbData } = finalData as any;

      if (!initialData && !terms_accepted) {
        toast.error('Debes aceptar los términos y condiciones');
        setLoading(false);
        return;
      }

      if (initialData) {
        const { error } = await supabase
          .from('businesses')
          .update(dbData)
          .eq('id', initialData.id);
        if (error) throw error;
        toast.success('Negocio actualizado correctamente');
        router.push('/admin/negocios');
      } else {
        const { error } = await supabase.from('businesses').insert(dbData);
        if (error) throw error;

        // NOTIFICACIÓN POR CORREO (Solo para registros nuevos)
        try {
          fetch('/api/notify/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: dbData.name,
              category:
                categories.find((c) => c.id === dbData.category_id)?.name ||
                'General',
              contact_name: dbData.contact_name,
              contact_email: dbData.contact_email,
              phone: dbData.phone,
              whatsapp: dbData.whatsapp,
              email: dbData.email,
            }),
          });
        } catch (e) {
          console.error('Error enviando notificación:', e);
        }

        if (isPublicRegistration) {
          toast.success('¡Tu negocio se registró con éxito!');
          router.push('/pago');
        } else {
          toast.success('Negocio creado exitosamente');
          router.push('/admin/negocios');
        }
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const onFormError = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    toast.error(`Error: ${firstError?.message || 'Revisa el formulario'}`);
  };

  const tabs = [
    { id: 'general', label: 'Información General', icon: Info },
    { id: 'images', label: 'Multimedia', icon: ImageIcon },
    { id: 'contact', label: 'Ubicación & Contacto', icon: MapPin },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'extra', label: 'Características & Redes', icon: Star },
  ];

  return (
    <div className={cn(
      "bg-white rounded-[1.5rem] md:rounded-[3rem] relative",
      !isPublicRegistration ? "border border-border shadow-2xl overflow-hidden" : ""
    )}>
      {/* Tab Navigation */}
      <div className="flex bg-[#F4FBF5] border-b border-border overflow-x-auto scrollbar-hide py-2 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[1.5rem] transition-all duration-300 font-jakarta font-black text-[10px] md:text-xs uppercase tracking-widest leading-none whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-white text-green shadow-[0_10px_20px_rgba(42,122,59,0.1)] translate-y-1 md:translate-y-2 ring-1 ring-border'
                : 'text-muted/40 hover:text-green-mid hover:bg-white/50'
            )}
          >
            <tab.icon
              size={14}
              className={activeTab === tab.id ? 'text-green' : 'text-muted/20'}
            />
            {tab.label}
            {activeTab === tab.id && (
              <div className="ml-1 md:ml-2 w-1 md:w-1.5 h-1 md:h-1.5 bg-green rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            )}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onFormError)}
        className="p-4 md:p-14"
      >
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-outfit font-black text-xl md:text-3xl text-green-deeper mb-3 md:mb-4 flex items-center gap-3 md:gap-4">
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-green text-white flex items-center justify-center text-sm md:text-lg">
                  1
                </span>
                Información básica
              </h2>
              <p className="text-muted text-[12px] md:text-sm font-jakarta max-w-lg leading-snug">
                Define el nombre atractivo y la descripción que enganchará a tus
                clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block transition-colors group-focus-within:text-green">
                  Nombre comercial
                </label>
                <input
                  {...register('name')}
                  placeholder="Ej: Pizzas Don Pepe"
                  className={cn(
                    'w-full bg-green-xpale border border-border focus:bg-white focus:border-green focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20',
                    errors.name && 'border-red-500'
                  )}
                />
              </div>
              <div
                className={cn(
                  'space-y-2 group',
                  isPublicRegistration && 'hidden'
                )}
              >
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  SLUG URL
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 text-[12px] font-bold">
                    /
                  </span>
                  <input
                    {...register('slug')}
                    className="w-full bg-green-pale/30 border border-border focus:bg-white focus:border-green outline-none rounded-2xl py-5 pl-8 pr-6 font-mono text-[11px] font-bold text-ink2 transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Eslogan / Frase corta
                </label>
                <input
                  {...register('tagline')}
                  placeholder="La mejor cocina italiana..."
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20"
                />
              </div>
              <div className="md:col-span-2 space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Descripción
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  placeholder="Describe qué hace único a tu negocio..."
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20"
                />
              </div>
              <div
                className={cn(
                  'md:col-span-2 space-y-2 group',
                  isPublicRegistration && 'hidden'
                )}
              >
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block flex items-center gap-2">
                  Palabras Clave de Búsqueda (Solo Interno){' '}
                  <Info size={12} className="text-blue-500" />
                </label>
                <input
                  {...register('search_keywords')}
                  placeholder="tacos, garnachas, comida rapida, economico"
                  className="w-full bg-blue-50/50 border border-blue-100 focus:bg-white focus:border-blue-400 outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-50"
                />
                <p className="text-[9px] text-muted font-bold ml-2">
                  Agrega palabras separadas por comas. Estas palabras ayudarán a
                  que el negocio aparezca en las búsquedas, pero no serán
                  visibles para el público.
                </p>
              </div>

              {/* Contact Person Data (Private) */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 p-6 bg-red-50/50 border border-red-100/50 rounded-3xl mt-4 mb-2">
                <div className="md:col-span-3 flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="font-outfit font-black text-ink text-sm">
                      Datos del Representante (Privado)
                    </h4>
                    <p className="text-[10px] text-muted font-bold tracking-widest uppercase">
                      Solo visible en administración
                    </p>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block transition-colors group-focus-within:text-red-500">
                    Nombre del Contacto
                  </label>
                  <input
                    {...register('contact_name')}
                    placeholder="Nombre completo"
                    className="w-full bg-white border border-border focus:border-red-400 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block transition-colors group-focus-within:text-red-500">
                    Email del Contacto
                  </label>
                  <input
                    type="email"
                    {...register('contact_email')}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-white border border-border focus:border-red-400 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block transition-colors group-focus-within:text-red-500">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    {...register('contact_phone')}
                    placeholder="427 123 4567"
                    className="w-full bg-white border border-border focus:border-red-400 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-20"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Sitio Web Oficial
                </label>
                <input
                  {...register('website')}
                  className="w-full bg-green-xpale border border-border outline-none rounded-2xl py-4 px-6 font-bold text-ink"
                  placeholder="https://mi-empresa.com"
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Categoría
                </label>
                <select
                  {...register('category_id')}
                  className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 font-bold text-sm md:text-base text-ink transition-all appearance-none cursor-pointer"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                className={cn(
                  'md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8',
                  isPublicRegistration && 'hidden'
                )}
              >
                <div className="space-y-2 group flex flex-col">
                  <label className="text-[10px] font-black text-green uppercase tracking-[0.2em] ml-2 block">
                    Estado de Visibilidad
                  </label>
                  <div className="flex items-center gap-4 bg-green-xpale/50 border border-green/20 rounded-2xl py-4 px-6 h-full transition-all hover:bg-white hover:shadow-lg">
                    <Toggle
                      checked={watch('is_active')}
                      onChange={(val) => setValue('is_active', val)}
                      label={watch('is_active') ? 'PÚBLICO' : 'OCULTO'}
                    />
                    <div className="flex-1">
                      <p className="text-[10px] text-ink font-black uppercase tracking-tight">
                        Autorización
                      </p>
                      <p className="text-[9px] text-muted font-bold leading-tight">
                        Si está oculto, no aparecerá en el directorio ni en
                        búsquedas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group flex flex-col">
                  <label className="text-[10px] font-black text-green uppercase tracking-[0.2em] ml-2 block">
                    Destacar Empresa
                  </label>
                  <div className="flex items-center gap-4 bg-green-xpale/50 border border-green/20 rounded-2xl py-4 px-6 h-full transition-all hover:bg-white hover:shadow-lg">
                    <Toggle
                      checked={watch('is_featured')}
                      onChange={(val) => setValue('is_featured', val)}
                      label={watch('is_featured') ? 'SÍ' : 'NO'}
                    />
                    <div className="flex-1">
                      <p className="text-[10px] text-ink font-black uppercase tracking-tight">
                        Carrusel Inicio
                      </p>
                      <p className="text-[9px] text-muted font-bold leading-tight">
                        Aparecerá rotando en la sección principal del sitio web.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4 pt-6 border-t border-border/50">
                <label className="text-[10px] font-black text-green uppercase tracking-[0.2em] ml-2 block">
                  Catálogo / Menú (PDF)
                </label>
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="flex-1 relative">
                    <div
                      className={cn(
                        'w-full bg-green-xpale border border-dashed border-border rounded-2xl py-6 px-8 flex items-center gap-4 transition-all hover:border-green group cursor-pointer',
                        pdfFile || pdfUrl ? 'bg-white border-green' : ''
                      )}
                    >
                      <FileText
                        className={cn(
                          'text-muted transition-colors flex-shrink-0',
                          (pdfFile || pdfUrl) && 'text-green'
                        )}
                        size={32}
                      />
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase text-ink">
                          {pdfFile
                            ? pdfFile.name
                            : pdfUrl
                              ? 'Catálogo subido correctamente'
                              : 'Subir archivo PDF'}
                        </p>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">
                          {pdfFile
                            ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB`
                            : 'Máximo 10MB'}
                        </p>
                      </div>
                      {(pdfFile || pdfUrl) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPdfFile(null);
                            setPdfUrl(null);
                          }}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex-shrink-0 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.type !== 'application/pdf') {
                            toast.error('Solo se permiten archivos PDF');
                            return;
                          }
                          if (file.size > 10 * 1024 * 1024) {
                            toast.error(
                              'El archivo es demasiado grande (Máx 10MB)'
                            );
                            return;
                          }
                          setPdfFile(file);
                        }
                      }}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1 block mb-2">
                      Etiqueta del botón
                    </label>
                    <input
                      {...register('catalog_label')}
                      placeholder="Menú / Catálogo"
                      className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green outline-none rounded-xl py-4 px-4 font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGES */}
        {activeTab === 'images' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Logo */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 block text-center">
                  Logo
                </label>
                <div className="relative aspect-square max-w-[200px] mx-auto rounded-full bg-green-xpale border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-green transition-colors group cursor-pointer shadow-xl">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadIcon size={24} className="text-green-light mb-2" />
                      <p className="font-outfit font-black text-green-deeper uppercase tracking-widest text-[9px]">
                        Logo
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
              {/* Cover */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2 block">
                  Imagen de portada (que sea horizontal)
                </label>
                <div className="relative aspect-video rounded-[2.5rem] bg-green-xpale border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-green transition-colors group cursor-pointer shadow-xl">
                  {coverPreview ? (
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon size={32} className="text-green-light mb-4" />
                      <p className="font-outfit font-black text-green-deeper uppercase tracking-widest text-[11px]">
                        Subir Portada
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block">
                  Galería de imágenes (Máx 20)
                </label>
                <span className="text-[10px] font-bold text-muted">
                  {existingGallery.length + galleryFiles.length} / 20
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* New Upload Button */}
                {existingGallery.length + galleryFiles.length < 20 && (
                  <label className="aspect-square rounded-3xl bg-green-xpale border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-green transition-all group shadow-sm">
                    <Plus
                      size={24}
                      className="text-green-light mb-2 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[9px] font-black text-green-deeper uppercase tracking-widest">
                      Añadir
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      onChange={handleGalleryChange}
                    />
                  </label>
                )}

                {/* Existing Images */}
                {existingGallery.map((url, i) => (
                  <div
                    key={`existing-${i}`}
                    className="aspect-square relative rounded-3xl overflow-hidden border border-border group shadow-sm"
                  >
                    <Image
                      src={url}
                      alt={`Gallery ${i}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryFile(i, true)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* New Files */}
                {galleryPreviews.map((url, i) => (
                  <div
                    key={`new-${i}`}
                    className="aspect-square relative rounded-3xl overflow-hidden border-2 border-green group shadow-sm"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${i}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                      Nueva
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryFile(i, false)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & LOCATION */}
        {activeTab === 'contact' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Teléfono
                </label>
                <input
                  {...register('phone')}
                  className="w-full bg-green-xpale border border-border outline-none rounded-2xl py-4 px-6 font-bold text-ink"
                  placeholder="427 123 4567"
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  WhatsApp
                </label>
                <input
                  {...register('whatsapp')}
                  className="w-full bg-green-xpale border border-border outline-none rounded-2xl py-4 px-6 font-bold text-ink"
                  placeholder="427 123 4567"
                />
              </div>
              <div className="md:col-span-2 space-y-2 group">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">
                  Dirección
                </label>
                <input
                  {...register('address')}
                  className="w-full bg-green-xpale border border-border outline-none rounded-2xl py-4 px-6 font-bold text-ink"
                  placeholder="Calle Hidalgo #10, Centro"
                />
              </div>
            </div>

            {/* Map Picker Section */}
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="font-outfit font-black text-xl text-green-deeper mb-2">
                  Ubicación en el mapa
                </h3>
                <p className="text-muted text-xs font-jakarta">
                  Arrastra el pin o haz click para definir la ubicación exacta
                  que verán los clientes.
                </p>
              </div>
              <MapPicker
                lat={watch('latitude') || 20.3889}
                lng={watch('longitude') || -100.0039}
                onChange={(lat: number, lng: number) => {
                  setValue('latitude', lat);
                  setValue('longitude', lng);
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-muted uppercase tracking-widest">
                    Latitud
                  </span>
                  <span className="text-xs font-bold font-mono text-green">
                    {watch('latitude')?.toFixed(6) || 'N/A'}
                  </span>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[8px] font-black text-muted uppercase tracking-widest">
                    Longitud
                  </span>
                  <span className="text-xs font-bold font-mono text-green">
                    {watch('longitude')?.toFixed(6) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ... TABS 4 & 5 (Schedule & Extra) ... Same as before ... */}
        {activeTab === 'schedule' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-xpale/50 rounded-[2.5rem] border border-border p-8 space-y-4 shadow-inner">
              {[
                'lunes',
                'martes',
                'miercoles',
                'jueves',
                'viernes',
                'sabado',
                'domingo',
              ].map((day) => (
                <div
                  key={day}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border/50 last:border-0 hover:bg-white/40 transition-colors px-4 rounded-xl"
                >
                  <span className="font-outfit font-black text-sm uppercase tracking-widest text-green-deeper min-w-[120px]">
                    {day}
                  </span>
                   <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3">
                      <input
                        type="time"
                        {...register(`schedule.${day}.open`)}
                        disabled={watch(`schedule.${day}.closed`)}
                        className="w-full bg-white border border-border rounded-xl px-4 py-3 text-xs md:text-sm disabled:opacity-30 outline-none focus:border-green"
                      />
                      <span className="text-muted text-[10px] uppercase font-black">a</span>
                      <input
                        type="time"
                        {...register(`schedule.${day}.close`)}
                        disabled={watch(`schedule.${day}.closed`)}
                        className="w-full bg-white border border-border rounded-xl px-4 py-3 text-xs md:text-sm disabled:opacity-30 outline-none focus:border-green"
                      />
                    </div>
                    <div className="flex md:ml-4">
                      <Toggle
                        checked={watch(`schedule.${day}.closed`)}
                        onChange={(val) =>
                          setValue(`schedule.${day}.closed`, val)
                        }
                        label="CERRADO"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'extra' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-12">
              {/* Features Section */}
              <div className="space-y-6">
                <div className="px-2">
                  <h3 className="text-xs font-black text-green uppercase tracking-widest mb-2">
                    Servicios y características del negocio
                  </h3>
                  <p className="text-muted text-[10px] font-medium font-jakarta">
                    Selecciona los servicios que ofrece tu negocio para que
                    aparezcan en el micrositio.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ALL_FEATURES.map((feature) => {
                    const currentFeatures = watch('features') || [];
                    const isSelected = currentFeatures.includes(feature.id);

                    return (
                      <label
                        key={feature.id}
                        className={cn(
                          'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group',
                          isSelected
                            ? 'bg-green/5 border-green shadow-md'
                            : 'bg-white border-border hover:border-green-pale'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                            isSelected
                              ? 'bg-green text-white'
                              : 'bg-green-xpale text-green'
                          )}
                        >
                          <feature.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-xs font-black uppercase tracking-wide leading-none mb-1',
                              isSelected ? 'text-green-deeper' : 'text-ink'
                            )}
                          >
                            {feature.label}
                          </p>
                          <p className="text-[9px] text-muted font-bold uppercase tracking-[0.05em]">
                            Servicio disponible
                          </p>
                        </div>
                        <div
                          className={cn(
                            'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all',
                            isSelected
                              ? 'bg-green border-green'
                              : 'border-border group-hover:border-green-pale'
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setValue('features', [
                                ...currentFeatures,
                                feature.id,
                              ]);
                            } else {
                              setValue(
                                'features',
                                currentFeatures.filter(
                                  (id) => id !== feature.id
                                )
                              );
                            }
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black text-green uppercase tracking-widest px-2 mb-1">
                    Redes Sociales
                  </h3>
                  <p className="text-[10px] font-medium text-muted font-jakarta px-2">
                    (agrega los links de tus redes sociales que si esten
                    activas, las demás dejalas vacías)
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Facebook
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      {...register('facebook')}
                      placeholder="Facebook URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Instagram
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-pink-600 transition-colors"
                      size={18}
                    />
                    <input
                      {...register('instagram')}
                      placeholder="Instagram URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Twitter
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-ink transition-colors"
                      size={18}
                    />
                    <input
                      {...register('twitter_x')}
                      placeholder="Twitter URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Youtube
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-red-600 transition-colors"
                      size={18}
                    />
                    <input
                      {...register('youtube')}
                      placeholder="YouTube URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Tiktok
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-black transition-colors"
                      size={18}
                    />
                    <input
                      {...register('tiktok')}
                      placeholder="TikTok URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Pinterest
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-red-600 transition-colors"
                      size={18}
                    />
                    <input
                      {...register('pinterest')}
                      placeholder="Pinterest URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Linkedin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-blue-700 transition-colors"
                      size={18}
                    />
                    <input
                      {...register('linkedin')}
                      placeholder="LinkedIn URL"
                      className="w-full bg-green-xpale border border-border rounded-2xl py-4 pl-12 pr-6 font-bold text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <UberEatsIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-[#06C167] transition-colors"
                      size={20}
                    />
                    <input
                      {...register('uber_eats')}
                      placeholder="Link Uber Eats o # para solo icono"
                      className="w-full bg-green-xpale border border-border focus:bg-white focus:border-green-600 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 pr-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-50"
                    />
                  </div>
                  <div className="relative group">
                    <DidiFoodIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-[#FF8B00] transition-colors"
                      size={20}
                    />
                    <input
                      {...register('didi_food')}
                      placeholder="Link Didi Food o # para solo icono"
                      className="w-full bg-green-xpale border border-border focus:bg-white focus:border-orange-600 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 pr-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-50"
                    />
                  </div>
                  <div className="relative group">
                    <RappiIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 group-focus-within:text-[#ff441f] transition-colors"
                      size={20}
                    />
                    <input
                      {...register('rappi')}
                      placeholder="Link Rappi o # para solo icono"
                      className="w-full bg-green-xpale border border-border focus:bg-white focus:border-red-600 focus:shadow-xl outline-none rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 pr-6 font-bold text-sm md:text-base text-ink transition-all placeholder:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms and Conditions Acceptance (Only for new registrations) */}
        {!initialData && (
          <div className="mt-12 p-8 bg-green-xpale/50 border border-green-pale rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="flex-1">
              <h4 className="font-outfit font-black text-ink text-sm uppercase tracking-widest mb-1">
                Aceptación Legal
              </h4>
              <p className="text-muted text-[10px] font-bold leading-tight uppercase tracking-wider">
                Para registrar tu micrositio es necesario aceptar nuestro contrato de prestación de servicios.
              </p>
            </div>
            
            <label className="flex items-center gap-4 cursor-pointer group w-full md:w-auto">
              <div className="relative w-8 h-8 rounded-xl border-2 border-green/30 bg-white flex-shrink-0 flex items-center justify-center transition-all group-hover:border-green group-hover:shadow-lg">
                <input 
                  type="checkbox" 
                  {...register('terms_accepted')}
                  className="peer absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-5 h-5 bg-green text-white rounded-md flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform duration-200 shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="text-[11px] font-black text-ink uppercase tracking-[0.05em]">
                Acepto los <Link href="/terminos" target="_blank" className="text-green hover:underline decoration-2">términos y condiciones</Link> así como el <Link href="/terminos" target="_blank" className="text-green hover:underline decoration-2">aviso de privacidad</Link>
              </div>
            </label>
          </div>
        )}

        {/* Footer buttons */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                initialData ? 'bg-green' : 'bg-orange-400'
              )}
            />
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">
              {initialData ? 'Actualizar' : 'Nuevo'}
            </span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-4 rounded-xl text-xs uppercase"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-10 py-4 rounded-xl font-black uppercase tracking-widest flex-1 md:flex-none"
            >
              {loading ? 'Guardando...' : 'Guardar Negocio'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
