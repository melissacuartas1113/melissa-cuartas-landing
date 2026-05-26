/**
 * About Section Component
 * Diseño: Espiritualidad Contemporánea Minimalista
 * Layout: foto izquierda, texto derecha, pilares debajo
 */

import { Brain, Sparkles, TrendingUp } from 'lucide-react';

interface AboutSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function AboutSection({ language, translations }: AboutSectionProps) {
  const t = translations[language];

  const pillars = [
    {
      icon: Brain,
      label: t.about_pillar_1,
      color: '#7B5CE7',
    },
    {
      icon: Sparkles,
      label: t.about_pillar_2,
      color: '#0CBFBF',
    },
    {
      icon: TrendingUp,
      label: t.about_pillar_3,
      color: '#5A8FE0',
    },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32"
      style={{ background: 'var(--color-mist)', color: 'var(--color-midnight-blue)' }}
    >
      <div className="container mx-auto px-4">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-16">
          {/* Foto Izquierda */}
          <div className="relative h-96 md:h-full md:min-h-96 order-2 md:order-1 scroll-reveal">
            <div
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom right, rgba(123, 92, 231, 0.1), rgba(12, 191, 191, 0.1))',
              }}
            >
              <img
                src="/manus-storage/480497138_1177570940384292_4646939084578123503_n(1)_3e28daf9.png"
                alt="Melissa Cuartas"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decoración */}
            <div
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-2xl"
              style={{ background: 'rgba(12, 191, 191, 0.1)' }}
            ></div>
            <div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full blur-2xl"
              style={{ background: 'rgba(123, 92, 231, 0.1)' }}
            ></div>
          </div>

          {/* Contenido Derecha */}
          <div className="space-y-6 order-1 md:order-2 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
              {t.about_title}
            </h2>

            {/* Línea decorativa */}
            <div
              className="h-1 w-20 rounded-full"
              style={{ background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))' }}
            ></div>

            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-midnight-blue)' }}>
              {t.about_description}
            </p>

            <p className="text-base italic" style={{ color: 'var(--color-blue-medium)' }}>
              {language === 'es'
                ? '"La transformación financiera comienza cuando sanamos nuestra relación con el dinero"'
                : '"Financial transformation begins when we heal our relationship with money"'}
            </p>
          </div>
        </div>

        {/* Pilares de Trabajo */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-16 pt-16"
          style={{ borderTop: '1px solid var(--color-light-gray)' }}
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 scroll-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="p-4 rounded-full border-2"
                  style={{
                    background: 'var(--color-mist)',
                    borderColor: 'var(--color-light-gray)',
                    color: pillar.color,
                  }}
                >
                  <Icon size={32} />
                </div>
                <h3 className="text-lg font-semibold font-serif" style={{ color: 'var(--color-midnight-blue)' }}>
                  {pillar.label}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
