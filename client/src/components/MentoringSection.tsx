/**
 * Mentoring Section Component
 * Descripción de acompañamiento personalizado con CTA a WhatsApp
 */

import { MessageCircle } from 'lucide-react';

interface MentoringSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function MentoringSection({ language, translations }: MentoringSectionProps) {
  const t = translations[language];

  const mentorshipItems = [
    t.mentoring_item_1,
    t.mentoring_item_2,
    t.mentoring_item_3,
    t.mentoring_item_4,
  ];

  const whatsappLink =
    'https://wa.me/573017361157?text=' +
    encodeURIComponent(
      language === 'es'
        ? 'Hola Melissa, quiero saber más sobre la mentoría'
        : 'Hi Melissa, I want to know more about mentoring'
    );

  return (
    <section id="mentoring" className="py-20 md:py-32" style={{ background: 'var(--color-mist)', color: 'var(--color-midnight-blue)' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Contenido Izquierda */}
          <div className="space-y-8 scroll-reveal">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                {t.mentoring_title}
              </h2>

              {/* Línea decorativa */}
              <div className="h-1 w-20 rounded-full" style={{ background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))' }}></div>
            </div>

            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-midnight-blue)' }}>
              {t.mentoring_description}
            </p>

            {/* Items */}
            <div className="space-y-3">
              {mentorshipItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 scroll-reveal"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ background: 'linear-gradient(to bottom right, var(--color-purple), var(--color-teal))' }}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-base" style={{ color: 'var(--color-midnight-blue)' }}>{item}</p>
                </div>
              ))}
            </div>

            {/* CTA WhatsApp */}
            <button
              onClick={() => window.open(whatsappLink, '_blank')}
              className="inline-flex items-center gap-2 btn-primary text-base font-medium mt-4"
            >
              <MessageCircle size={20} />
              {t.cta_know_more}
            </button>
          </div>

          {/* Imagen/Decoración Derecha */}
          <div className="relative h-96 md:h-full md:min-h-96 scroll-reveal">
            <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(123, 92, 231, 0.1), rgba(12, 191, 191, 0.1))' }}>
              <img
                src="/manus-storage/YOUTUBEPORTA_2f15c558.webp"
                alt="Melissa Cuartas 11:13"
                className="w-full h-full object-contain"
                style={{ objectPosition: 'center' }}
              />
            </div>

            {/* Decoración */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl" style={{ background: 'rgba(12, 191, 191, 0.1)' }}></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full blur-2xl" style={{ background: 'rgba(123, 92, 231, 0.1)' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
