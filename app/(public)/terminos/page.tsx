import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FileText, Shield, Scale, AlertCircle, Clock } from 'lucide-react';

export default function TerminosPage() {
  return (
    <main className="min-h-screen pt-20 bg-green-xpale/30">
      <Navbar />
      
      <div className="container mx-auto max-w-4xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green/10 text-green rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm border border-green/20">
            <FileText size={14} />
            Legal & Privacidad
          </div>
          <h1 className="font-outfit font-black text-4xl md:text-6xl text-ink leading-tight">
            Términos y <span className="text-green">Condiciones</span>
          </h1>
          <p className="text-muted font-jakarta text-lg max-w-2xl mx-auto">
            Este contrato regula la relación entre los negocios anunciados y la plataforma Enlace San Juan.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-border space-y-12">
          
          <div className="space-y-6">
            <h2 className="font-outfit font-black text-2xl text-green-deeper flex items-center gap-3">
              <Shield className="text-green" size={24} />
              1. Licencia de Uso
            </h2>
            <p className="text-ink2 font-jakarta leading-relaxed text-lg">
              Enlace San Juan otorga al contratante una <strong>licencia de uso no exclusiva</strong> para la publicación de su micrositio comercial dentro del directorio. Es importante aclarar que este servicio constituye una <strong>licencia de uso y no una venta</strong> de software, espacio web o propiedad digital alguna.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-outfit font-black text-2xl text-green-deeper flex items-center gap-3">
              <Scale className="text-green" size={24} />
              2. Propiedad Intelectual
            </h2>
            <p className="text-ink2 font-jakarta leading-relaxed text-lg">
              Toda la propiedad intelectual relacionada con la plataforma, incluyendo el código fuente, diseño, estructura, logotipos de la plataforma y el nombre comercial <strong>Enlace San Juan</strong>, pertenece exclusivamente al titular de la plataforma. El usuario solo cuenta con derechos sobre su propia información y logotipos que proporcione para su publicación.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-outfit font-black text-2xl text-green-deeper flex items-center gap-3">
              <AlertCircle className="text-green" size={24} />
              3. Responsabilidad Limitada
            </h2>
            <p className="text-ink2 font-jakarta leading-relaxed text-lg">
              Enlace San Juan no será responsable por interrupciones técnicas que resulten de fallas en proveedores externos, caídas de servidores, ataques cibernéticos o cualquier circunstancia fuera de nuestro control directo. Asimismo, no garantizamos ganancias específicas derivadas de la publicidad en el sitio.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-outfit font-black text-2xl text-green-deeper flex items-center gap-3">
              <Clock className="text-green" size={24} />
              4. Renovación y Borrado de Contenido
            </h2>
            <p className="text-ink2 font-jakarta leading-relaxed text-lg">
              El servicio se mantiene activo únicamente mediante el pago de la suscripción o renovación correspondiente. En caso de no efectuarse la renovación al término de la vigencia, el micrositio será desactivado. <strong>Si transcurren 60 días naturales sin renovación, Enlace San Juan procederá al borrado permanente de todo el contenido</strong> relacionado con dicho negocio en nuestros sistemas.
            </p>
          </div>

          <div className="pt-12 border-t border-border mt-12">
            <h3 className="font-outfit font-black text-xl text-ink mb-4 uppercase tracking-widest text-center">
              Aviso de Privacidad
            </h3>
            <p className="text-muted font-jakarta leading-relaxed text-sm text-center">
              Los datos recabados en este sitio son utilizados exclusivamente para la creación de su perfil comercial y contacto administrativo. No compartimos su información con terceros ajenos a la operación de este directorio sin su consentimiento.
            </p>
          </div>

          <div className="text-center pt-8">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
              Última actualización: 29 de Marzo, 2026
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
