'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Business, Category } from '@/types/business';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import {
  Info,
  Camera as ImageIcon,
  MapPin,
  Clock,
  Star,
  Plus,
  Trash2,
  Globe,
  Save,
  Coins,
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
  FileText,
  Upload as UploadIcon,
  X,
  CheckCircle2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music2 as Tiktok,
  Pin as Pinterest,
  Linkedin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import {
  UberEatsIcon,
  DidiFoodIcon,
  RappiIcon,
  WellhubIcon,
  TotalPassIcon,
  FitPassIcon,
} from '@/components/shared/CustomIcons';

const MapPicker = dynamic(
  () => import('../admin/MapPicker').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full bg-green-xpale animate-pulse rounded-3xl flex items-center justify-center text-muted font-black uppercase text-[10px] tracking-widest">
        Cargando Mapa...
      </div>
    ),
  }
);

const businessSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  tagline: z.string().nullable().optional().or(z.literal('')),
  description: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(800, 'Máximo 800 caracteres'),
  category_id: z.string().uuid('Selecciona una categoría'),
  phone: z.string().nullable().optional().or(z.literal('')),
  whatsapp: z.string().nullable().optional().or(z.literal('')),
  email: z.string().nullable().optional().or(z.literal('')),
  contact_name: z.string().nullable().optional().or(z.literal('')),
  contact_phone: z.string().nullable().optional().or(z.literal('')),
  website: z.string().nullable().optional().or(z.literal('')),
  address: z.string().nullable().optional().or(z.literal('')),
  neighborhood: z.string().nullable().optional().or(z.literal('')),
  city: z.string().default('San Juan del Río'),
  state: z.string().default('Querétaro'),
  maps_embed_url: z.string().nullable().optional().or(z.literal('')),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  facebook: z.string().nullable().optional().or(z.literal('')),
  instagram: z.string().nullable().optional().or(z.literal('')),
  twitter_x: z.string().nullable().optional().or(z.literal('')),
  youtube: z.string().nullable().optional().or(z.literal('')),
  tiktok: z.string().nullable().optional().or(z.literal('')),
  pinterest: z.string().nullable().optional().or(z.literal('')),
  linkedin: z.string().nullable().optional().or(z.literal('')),
  features: z.array(z.string()).default([]),
  catalog_label: z.string().nullable().optional().default('Menú / Catálogo'),
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
  booking_duration: z.number().default(60),
});

interface PortalBusinessFormProps {
  initialData: Business;
  categories: Category[];
}

const ALL_FEATURES = [
  { id: 'Pago en efectivo', label: 'Pago en efectivo', icon: Coins },
  { id: 'Pago con tarjeta', label: 'Pago con tarjeta', icon: CreditCard },
  { id: 'Pago con transferencia', label: 'Pago con transferencia', icon: Banknote },
  { id: 'Facturación disponible', label: 'Facturación disponible', icon: Receipt },
  { id: 'Servicio a domicilio', label: 'Servicio a domicilio', icon: Bike },
  { id: 'Para llevar', label: 'Para llevar', icon: ShoppingBag },
  { id: 'Pueden reservar', label: 'Pueden reservar', icon: CalendarCheck },
  { id: 'Estacionamiento', label: 'Estacionamiento', icon: Car },
  { id: 'Con WiFi', label: 'Con WiFi', icon: Wifi },
  { id: 'Aire acondicionado', label: 'Aire acondicionado', icon: Snowflake },
  { id: 'Pet friendly', label: 'Pet friendly', icon: Dog },
  { id: 'Con juegos infantiles', label: 'Con juegos infantiles', icon: Gamepad2 },
  { id: 'Uber Eats', label: 'Uber Eats', icon: UberEatsIcon, color: 'text-[#06C167]' },
  { id: 'Didi Food', label: 'Didi Food', icon: DidiFoodIcon, color: 'text-[#FF8B00]' },
  { id: 'Rappi', label: 'Rappi', icon: RappiIcon, color: 'text-[#ff441f]' },
  { id: 'Wellhub', label: 'Wellhub', icon: WellhubIcon, color: 'text-[#f2496b]' },
  { id: 'Total Pass', label: 'Total Pass', icon: TotalPassIcon, color: 'text-[#27d07d]' },
  { id: 'Fit pass', label: 'Fit pass', icon: FitPassIcon, color: 'text-[#09cee9]' },
];

export default function PortalBusinessForm({ initialData, categories }: PortalBusinessFormProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Assets State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>(initialData.gallery_urls || []);

  // Previews
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.logo_url || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData.cover_url || null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialData.catalog_pdf_url || null);

  // Products State
  const [products, setProducts] = useState<Array<{ name: string; price: string; description: string }>>(initialData.products || []);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      ...initialData,
      tagline: initialData.tagline || '',
      phone: initialData.phone || '',
      whatsapp: initialData.whatsapp || '',
      email: initialData.email || '',
      contact_name: initialData.contact_name || '',
      contact_phone: initialData.contact_phone || '',
      website: initialData.website || '',
      address: initialData.address || '',
      neighborhood: initialData.neighborhood || '',
      maps_embed_url: initialData.maps_embed_url || '',
      facebook: initialData.facebook || '',
      instagram: initialData.instagram || '',
      twitter_x: initialData.twitter_x || '',
      youtube: initialData.youtube || '',
      catalog_label: initialData.catalog_label || 'Menú / Catálogo',
      booking_duration: initialData.booking_duration || 60,
    },
  });

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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

  const addProduct = () => {
    if (!newProductName || !newProductPrice) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }
    setProducts([...products, { name: newProductName, price: newProductPrice, description: newProductDesc }]);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
  };

  const removeProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  const onSubmit = async (values: z.infer<typeof businessSchema>) => {
    setLoading(true);
    const slug = initialData.slug;

    try {
      let logo_url = logoPreview;
      let cover_url = coverPreview;
      let gallery_urls = [...existingGallery];

      // Upload Logo
      if (logoFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`logos/${slug}-${Date.now()}.png`, logoFile, { upsert: true });
        if (uploadError) throw uploadError;
        logo_url = supabase.storage.from('business-assets').getPublicUrl(data.path).data.publicUrl;
      }

      // Upload Cover
      if (coverFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`covers/${slug}-${Date.now()}.png`, coverFile, { upsert: true });
        if (uploadError) throw uploadError;
        cover_url = supabase.storage.from('business-assets').getPublicUrl(data.path).data.publicUrl;
      }

      // Upload Gallery
      for (const file of galleryFiles) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`galleries/${slug}/${Date.now()}-${file.name}`, file, { upsert: true });
        if (uploadError) throw uploadError;
        gallery_urls.push(supabase.storage.from('business-assets').getPublicUrl(data.path).data.publicUrl);
      }

      // Upload PDF
      let catalog_pdf_url = pdfUrl;
      if (pdfFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(`catalogs/${slug}-${Date.now()}.pdf`, pdfFile, { upsert: true });
        if (uploadError) throw uploadError;
        catalog_pdf_url = supabase.storage.from('business-assets').getPublicUrl(data.path).data.publicUrl;
      }

      const finalData = {
        ...values,
        logo_url,
        cover_url,
        gallery_urls,
        catalog_pdf_url,
        products,
      };

      const { error } = await supabase
        .from('businesses')
        .update(finalData)
        .eq('id', initialData.id);

      if (error) throw error;
      toast.success('Información del negocio actualizada correctamente');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar cambios');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Info General', icon: Info },
    { id: 'images', label: 'Imágenes', icon: ImageIcon },
    { id: 'contact', label: 'Contacto & Mapa', icon: MapPin },
    { id: 'schedule', label: 'Horarios', icon: Clock },
    { id: 'extra', label: 'Servicios & Redes', icon: Star },
  ];

  return (
    <div className="bg-white rounded-[2rem] border border-border shadow-2xl overflow-hidden relative">
      <div className="flex bg-green-xpale/50 border-b border-border overflow-x-auto py-2.5 px-4 sm:px-6 scrollbar-hide snap-x snap-mandatory gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 font-jakarta font-black text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap snap-center',
              activeTab === tab.id
                ? 'bg-white text-green shadow-sm ring-1 ring-border'
                : 'text-muted/55 hover:text-green'
            )}
          >
            <tab.icon size={13} className={activeTab === tab.id ? 'text-green' : 'text-muted/30'} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 md:p-12">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Nombre comercial</label>
                <input {...register('name')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Categoría</label>
                <select {...register('category_id')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Eslogan / Frase corta</label>
                <input {...register('tagline')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Descripción</label>
                <textarea {...register('description')} rows={5} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" />
              </div>
            </div>

            <div className="pt-6 border-t border-border/55">
              <h3 className="font-outfit font-black text-base text-green-deeper mb-4">Catálogo o Menú en PDF</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <div className={cn('w-full bg-green-xpale border border-dashed border-border rounded-xl py-5 px-6 flex items-center gap-4', (pdfFile || pdfUrl) && 'bg-white border-green')}>
                    <FileText size={24} className={cn('text-muted', (pdfFile || pdfUrl) && 'text-green')} />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-ink">{pdfFile ? pdfFile.name : pdfUrl ? 'Catálogo PDF subido' : 'Subir archivo PDF'}</p>
                    </div>
                    {(pdfFile || pdfUrl) && (
                      <button type="button" onClick={() => { setPdfFile(null); setPdfUrl(null); }} className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X size={12} /></button>
                    )}
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type === 'application/pdf') setPdfFile(file);
                  }} />
                </div>
                <div className="w-full md:w-1/3">
                  <input {...register('catalog_label')} placeholder="Menú / Catálogo" className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGES */}
        {activeTab === 'images' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-4 text-center">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Logo (Cuadrado)</label>
                <div className="relative w-40 h-40 mx-auto rounded-full bg-green-xpale border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <UploadIcon size={24} />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
                  }} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Imagen de portada (Horizontal)</label>
                <div className="relative aspect-video rounded-2xl bg-green-xpale border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                  {coverPreview ? <img src={coverPreview} alt="Portada" className="w-full h-full object-cover" /> : <ImageIcon size={32} />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
                  }} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border/55">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Galería de imágenes (Máx 20)</label>
                <span className="text-xs font-bold">{existingGallery.length + galleryFiles.length} / 20</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {existingGallery.length + galleryFiles.length < 20 && (
                  <label className="aspect-square rounded-2xl bg-green-xpale border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-green transition-all">
                    <Plus size={20} className="text-green mb-1" />
                    <span className="text-[9px] font-black uppercase">Añadir</span>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryChange} />
                  </label>
                )}
                {existingGallery.map((url, i) => (
                  <div key={url} className="aspect-square relative rounded-2xl overflow-hidden border border-border group">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGalleryFile(i, true)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><Trash2 size={12} /></button>
                  </div>
                ))}
                {galleryPreviews.map((url, i) => (
                  <div key={url} className="aspect-square relative rounded-2xl overflow-hidden border-2 border-green group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeGalleryFile(i, false)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Teléfono comercial</label>
                <input {...register('phone')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" placeholder="427 123 4567" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">WhatsApp</label>
                <input {...register('whatsapp')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" placeholder="427 123 4567" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Email Público</label>
                <input {...register('email')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" placeholder="contacto@empresa.com" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Dirección comercial</label>
                <input {...register('address')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" placeholder="Calle Hidalgo #10, Centro" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Colonia</label>
                <input {...register('neighborhood')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Sitio Web</label>
                <input {...register('website')} className="w-full bg-green-xpale border border-border rounded-xl py-4 px-5 font-bold text-sm" placeholder="https://miweb.com" />
              </div>
            </div>

            {/* Map Picker */}
            <div className="space-y-4 pt-6 border-t border-border/55">
              <h3 className="font-outfit font-black text-base text-green-deeper">Ubicación en el Mapa</h3>
              <MapPicker
                lat={watch('latitude') || 20.3889}
                lng={watch('longitude') || -100.0039}
                onChange={(lat, lng) => {
                  setValue('latitude', lat);
                  setValue('longitude', lng);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 4: SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Intervalo de citas */}
            <div className="bg-white border border-border rounded-2xl p-6 space-y-3 max-w-md shadow-sm">
              <label className="text-[10px] font-black text-green uppercase tracking-[0.2em] block">
                Intervalo de Reservas (Duración)
              </label>
              <select
                {...register('booking_duration', { valueAsNumber: true })}
                className="w-full bg-green-xpale border border-border focus:border-green outline-none rounded-xl py-3.5 px-4 font-bold text-xs text-ink transition-all cursor-pointer"
              >
                <option value={30}>30 minutos</option>
                <option value={60}>60 minutos (1 hora)</option>
                <option value={90}>90 minutos (1.5 horas)</option>
                <option value={120}>120 minutos (2 horas)</option>
              </select>
              <p className="text-[9px] text-muted leading-tight font-jakarta">
                Define la duración de cada cita. Esto modificará los bloques de tiempo disponibles en tu página pública.
              </p>
            </div>

            <div className="bg-green-xpale/30 rounded-2xl border border-border p-6 space-y-4">
              <label className="text-[10px] font-black text-green uppercase tracking-[0.2em] ml-2 block">
                Horario de Atención Semanal
              </label>
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((day) => (
                <div key={day} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
                  <span className="font-outfit font-black text-xs uppercase tracking-widest text-green-deeper min-w-[120px]">{day}</span>
                  <div className="flex items-center gap-4 flex-1 md:flex-initial">
                    <input type="time" {...register(`schedule.${day}.open`)} disabled={watch(`schedule.${day}.closed`)} className="bg-white border border-border rounded-lg px-3 py-2 text-xs" />
                    <span className="text-[10px] uppercase font-bold">a</span>
                    <input type="time" {...register(`schedule.${day}.close`)} disabled={watch(`schedule.${day}.closed`)} className="bg-white border border-border rounded-lg px-3 py-2 text-xs" />
                    <Toggle checked={watch(`schedule.${day}.closed`)} onChange={(val) => setValue(`schedule.${day}.closed`, val)} label="CERRADO" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES & PRODUCTS */}
        {activeTab === 'extra' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Features */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Servicios del negocio</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ALL_FEATURES.map((feat) => {
                  const currentList = watch('features') || [];
                  const isChecked = currentList.includes(feat.id);

                  return (
                    <label key={feat.id} className={cn('flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer transition-all', isChecked && 'bg-green/5 border-green')}>
                      <input type="checkbox" className="hidden" checked={isChecked} onChange={(e) => {
                        if (e.target.checked) setValue('features', [...currentList, feat.id]);
                        else setValue('features', currentList.filter(id => id !== feat.id));
                      }} />
                      <feat.icon size={16} className={isChecked ? 'text-green' : 'text-muted'} />
                      <span className="text-xs font-bold text-ink uppercase tracking-wide">{feat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-6 border-t border-border/55">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest block">Redes Sociales</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative"><Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} /><input {...register('facebook')} placeholder="Facebook Link" className="w-full bg-green-xpale border border-border rounded-xl py-3 pl-12 pr-4 font-bold text-xs" /></div>
                <div className="relative"><Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} /><input {...register('instagram')} placeholder="Instagram Link" className="w-full bg-green-xpale border border-border rounded-xl py-3 pl-12 pr-4 font-bold text-xs" /></div>
                <div className="relative"><Tiktok className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} /><input {...register('tiktok')} placeholder="TikTok Link" className="w-full bg-green-xpale border border-border rounded-xl py-3 pl-12 pr-4 font-bold text-xs" /></div>
                <div className="relative"><Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} /><input {...register('youtube')} placeholder="YouTube Link" className="w-full bg-green-xpale border border-border rounded-xl py-3 pl-12 pr-4 font-bold text-xs" /></div>
              </div>
            </div>

            {/* Products / Services Manager */}
            <div className="space-y-4 pt-6 border-t border-border/55">
              <h3 className="font-outfit font-black text-base text-green-deeper">Productos / Servicios Destacados</h3>
              
              <div className="bg-green-xpale/30 border border-border rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input placeholder="Nombre del producto" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full bg-white border border-border rounded-lg py-3 px-4 text-xs font-bold" />
                  <input placeholder="Precio (Ej: $120)" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="w-full bg-white border border-border rounded-lg py-3 px-4 text-xs font-bold" />
                </div>
                <textarea placeholder="Descripción del producto..." value={newProductDesc} onChange={(e) => setNewProductDesc(e.target.value)} rows={2} className="w-full bg-white border border-border rounded-lg py-3 px-4 text-xs font-bold" />
                <Button type="button" onClick={addProduct} className="bg-green text-white hover:bg-green-mid rounded-xl py-3 px-6 text-xs uppercase font-black">Añadir Producto</Button>
              </div>

              {products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {products.map((p, idx) => (
                    <div key={idx} className="bg-white p-5 border border-border rounded-xl flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-outfit font-black text-sm text-ink">{p.name} <span className="text-green text-xs font-bold">({p.price})</span></h4>
                        <p className="text-[11px] text-muted font-jakarta leading-snug mt-1">{p.description}</p>
                      </div>
                      <button type="button" onClick={() => removeProduct(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-12 pt-8 border-t border-border flex items-center justify-end gap-4">
          <Button type="submit" disabled={loading} className="px-10 py-4 rounded-xl font-black uppercase tracking-widest">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
