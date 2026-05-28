/**
 * Hero Section Component
 * Diseño: Espiritualidad Contemporánea Minimalista
 * Layout asimétrico: texto izquierda (55%), foto derecha (45%)
 */

interface HeroSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
  onScrollToResources: () => void;
  onScrollToMentoring: () => void;
}

export default function HeroSection({
  language,
  translations,
  onScrollToResources,
  onScrollToMentoring,
}: HeroSectionProps) {
  const t = translations[language];

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{
        background: 'linear-gradient(to bottom right, var(--color-midnight-blue), var(--color-midnight-blue), var(--color-dark-slate))',
        color: 'var(--color-mist)',
      }}
    >
      {/* Watermark de números */}
      <div className="absolute top-20 right-10 opacity-5 select-none pointer-events-none">
        <div className="text-9xl font-bold font-serif" style={{ color: 'var(--color-teal)' }}>11</div>
      </div>
      <div className="absolute bottom-20 left-10 opacity-5 select-none pointer-events-none">
        <div className="text-9xl font-bold font-serif" style={{ color: 'var(--color-teal)' }}>13</div>
      </div>

      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Contenido Izquierda */}
        <div className="space-y-6 animate-slide-in-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-serif">
            {t.hero_headline}
          </h1>

          <p className="text-lg md:text-xl leading-relaxed max-w-lg" style={{ color: 'var(--color-lavender)' }}>
            {t.hero_subheadline}
          </p>

          {/* Línea decorativa */}
          <div className="h-1 w-20 rounded-full" style={{ background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))' }}></div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onScrollToResources}
              className="btn-primary text-base font-medium"
            >
              {t.cta_free_access}
            </button>
            <a
              href="https://wa.me/573017361157?text=Hola%20Melissa%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20tu%20mentor%C3%ADa%20de%20finanzas%20conscientes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-base transition-all"
              style={{
                background: 'linear-gradient(135deg, #25D366, #20BA5A)',
                color: 'white',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {language === 'es' ? 'Chatea conmigo' : 'Chat with me'}
            </a>
          </div>
        </div>

        {/* Foto Derecha */}
        <div className="relative h-96 md:h-full md:min-h-96 animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-teal/20 rounded-lg overflow-hidden">
            <img
              src="/manus-storage/PXL_20260527_172432868(2)edite_32aae442.webp"
              alt="Melissa Cuartas"
              className="w-full h-full object-contain"
              style={{ objectPosition: 'center' }}
            />
          </div>

          {/* Decoración de esquina */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl" style={{ background: 'rgba(12, 191, 191, 0.1)' }}></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full blur-2xl" style={{ background: 'rgba(123, 92, 231, 0.1)' }}></div>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, transparent, var(--color-teal), transparent)' }}></div>
    </section>
  );
}
