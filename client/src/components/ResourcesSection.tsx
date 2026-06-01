/**
 * Resources Section Component
 * 3 Lead Magnets: Presupuesto, Test de Inversión, Guía de Creencias
 * Grid responsive con modales de captura
 */

import { FileText, BarChart3, Heart } from 'lucide-react';
import { useState } from 'react';
import LeadModal, { LeadFormData } from './LeadModal';
import InvestorTestModal from './InvestorTestModal';

interface ResourcesSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function ResourcesSection({ language, translations }: ResourcesSectionProps) {
  const t = translations[language];
  const [openModal, setOpenModal] = useState<'budget' | 'beliefs' | null>(null);
  const [showInvestorTest, setShowInvestorTest] = useState(false);

  const resources = [
    {
      id: 'budget',
      icon: FileText,
      title: t.resource_1_title,
      description: t.resource_1_description,
      cta: t.cta_download,
    },
    {
      id: 'test',
      icon: BarChart3,
      title: t.resource_2_title,
      description: t.resource_2_description,
      cta: t.cta_take_test,
    },
    {
      id: 'beliefs',
      icon: Heart,
      title: t.resource_3_title,
      description: t.resource_3_description,
      cta: t.cta_access_guide,
    },
  ];

  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      console.log('Lead data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Descargar el recurso según el tipo
      if (data.resourceType === 'budget') {
        const link = document.createElement('a');
        link.href = '/manus-storage/presupuesto_consciente_melissa_cuartas_1c4b6977.xlsx';
        link.download = 'Presupuesto_Consciente_Melissa_Cuartas.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (data.resourceType === 'beliefs') {
        const link = document.createElement('a');
        link.href = '/manus-storage/guia_creencias_limitantes_melissa_cuartas(2)_c03e7a38.xlsx';
        link.download = 'Guia_Creencias_Limitantes_Melissa_Cuartas.xlsx';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      alert(
        language === 'es'
          ? '¡Perfecto! Tu plantilla se está descargando. Revisa tu correo para más información.'
          : 'Perfect! Your template is downloading. Check your email for more information.'
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
                <div
                  className="relative backdrop-blur-sm rounded-lg p-8 h-full transition-all duration-300 hover:shadow-2xl"
                  style={{
                    background: 'rgba(26, 40, 71, 0.5)',
                    border: '1px solid rgba(196, 179, 232, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'var(--color-teal)';
                    el.style.boxShadow = '0 0 30px rgba(12, 191, 191, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'rgba(196, 179, 232, 0.2)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Contenido */}
                  <div className="relative z-10 space-y-4">
                    {/* Icono */}
                    <div
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(to bottom right, var(--color-purple), var(--color-teal))' }}
                    >
                      <Icon size={32} className="text-white" />
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold font-serif" style={{ color: 'var(--color-mist)' }}>
                      {resource.title}
                    </h3>

                    {/* Descripción */}
                    <p className="leading-relaxed" style={{ color: 'var(--color-lavender)' }}>
                      {resource.description}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => {
                        if (resource.id === 'test') {
                          setShowInvestorTest(true);
                        } else {
                          setOpenModal(resource.id as 'budget' | 'beliefs');
                        }
                      }}
                      className="w-full mt-6 btn-primary text-base font-medium"
                    >
                      {resource.cta}
                    </button>
                  </div>

                  {/* Decoración de esquina */}
                  <div
                    className="absolute -top-2 -right-2 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(12, 191, 191, 0.1)' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modales */}
      {['budget', 'beliefs'].map((resourceType) => (
        <LeadModal
          key={resourceType}
          isOpen={openModal === resourceType}
          onClose={() => setOpenModal(null)}
          resourceType={resourceType as 'budget' | 'beliefs'}
          language={language}
          translations={translations}
          onSubmit={handleFormSubmit}
        />
      ))}

      {/* Investor Test Modal */}
      <InvestorTestModal
        isOpen={showInvestorTest}
        onClose={() => setShowInvestorTest(false)}
        language={language}
        onSubmitLead={handleFormSubmit}
      />
    </section>
  );
}
