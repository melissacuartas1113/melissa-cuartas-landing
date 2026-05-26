/**
 * Resources Section Component
 * 3 Lead Magnets: Presupuesto, Test de Inversión, Guía de Creencias
 * Grid responsive con modales de captura
 */

import { FileText, BarChart3, Heart } from 'lucide-react';
import { useState } from 'react';
import LeadModal, { LeadFormData } from './LeadModal';

interface ResourcesSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function ResourcesSection({ language, translations }: ResourcesSectionProps) {
  const t = translations[language];
  const [openModal, setOpenModal] = useState<'budget' | 'test' | 'beliefs' | null>(null);

  const resources = [
    {
      id: 'budget',
      icon: FileText,
      title: t.resource_1_title,
      description: t.resource_1_description,
      cta: t.cta_download,
      color: 'from-purple to-teal',
    },
    {
      id: 'test',
      icon: BarChart3,
      title: t.resource_2_title,
      description: t.resource_2_description,
      cta: t.cta_take_test,
      color: 'from-teal to-blue-medium',
    },
    {
      id: 'beliefs',
      icon: Heart,
      title: t.resource_3_title,
      description: t.resource_3_description,
      cta: t.cta_access_guide,
      color: 'from-blue-medium to-purple',
    },
  ];

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      // Aquí se enviaría a un backend o servicio de email
      console.log('Lead data:', data);

      // Simulación de envío
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar éxito (en una app real, usar toast)
      alert(
        language === 'es'
          ? '¡Perfecto! Revisa tu correo para descargar tu recurso.'
          : 'Perfect! Check your email to download your resource.'
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(language === 'es' ? 'Hubo un error. Intenta de nuevo.' : 'There was an error. Try again.');
    }
  };

  return (
    <section
      id="resources"
      className="py-20 md:py-32"
      style={{
        background: 'linear-gradient(to bottom right, var(--color-midnight-blue), var(--color-midnight-blue), var(--color-dark-slate))',
        color: 'var(--color-mist)',
      }}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            {t.resources_title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-lavender)' }}>
            {t.resources_subtitle}
          </p>
          <div className="h-1 w-20 rounded-full mx-auto mt-6" style={{ background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))' }}></div>
        </div>

        {/* Grid de Recursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.id}
                className="group relative scroll-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div className="relative bg-dark-slate/50 backdrop-blur-sm border border-lavender/20 rounded-lg p-8 h-full transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/20">
                  {/* Gradiente de fondo en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300" style={{ background: `linear-gradient(to bottom right, ${resource.color.split(' ')[1]}, ${resource.color.split(' ')[3]})` }}></div>

                  {/* Contenido */}
                  <div className="relative z-10 space-y-4">
                    {/* Icono */}
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(to bottom right, var(--color-purple), var(--color-teal))` }}>
                      <Icon size={32} className="text-white" />
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold font-serif text-mist">
                      {resource.title}
                    </h3>

                    {/* Descripción */}
                    <p className="leading-relaxed" style={{ color: 'var(--color-lavender)' }}>
                      {resource.description}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => setOpenModal(resource.id as 'budget' | 'test' | 'beliefs')}
                      className="w-full mt-6 btn-primary text-base font-medium"
                    >
                      {resource.cta}
                    </button>
                  </div>

                  {/* Decoración de esquina */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(12, 191, 191, 0.1)' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modales */}
      {['budget', 'test', 'beliefs'].map((resourceType) => (
        <LeadModal
          key={resourceType}
          isOpen={openModal === resourceType}
          onClose={() => setOpenModal(null)}
          resourceType={resourceType as 'budget' | 'test' | 'beliefs'}
          language={language}
          translations={translations}
          onSubmit={handleFormSubmit}
        />
      ))}
    </section>
  );
}
