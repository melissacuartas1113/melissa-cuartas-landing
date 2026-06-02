/**
 * Social Section Component
 * Links a Instagram, TikTok y YouTube
 */

interface SocialSectionProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function SocialSection({ language, translations }: SocialSectionProps) {
  const t = translations[language];

  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@melissacuartas1113',
      url: 'https://www.instagram.com/melissacuartas1113/',
      color: 'from-pink-500 to-purple',
      image: '/manus-storage/instagram-logo_fcfed5a2.png',
    },
    {
      name: 'Facebook',
      handle: 'Melissa Cuartas 1113',
      url: 'https://www.facebook.com/melissacuartas1113/',
      color: 'from-blue-600 to-blue-500',
      image: '/manus-storage/facebook-f-blue-logo_07e88c7c.png',
    },
    {
      name: 'TikTok',
      handle: '@melissacuartas1113',
      url: 'https://www.tiktok.com/@melissacuartas1113',
      color: 'from-black to-gray-800',
      image: '/manus-storage/tiktok-logo_a0f3e4c0.png',
    },
    {
      name: 'YouTube',
      handle: '@MelissaCuartas1113',
      url: 'https://www.youtube.com/@MelissaCuartas1113',
      color: 'from-red-600 to-red-500',
      image: '/manus-storage/youtube-logo_ed624157.png',
    },
  ];

  return (
    <section
      id="social"
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
            {t.social_title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-lavender)' }}>
            {t.social_subtitle}
          </p>
          <div className="h-1 w-20 rounded-full mx-auto mt-6" style={{ background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))' }}></div>
        </div>

        {/* Grid de Redes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {socialLinks.map((social, index) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative scroll-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative backdrop-blur-sm rounded-lg p-8 h-full transition-all duration-300" style={{ background: 'rgba(26, 40, 71, 0.5)', border: '1px solid rgba(196, 179, 232, 0.2)' }}>
                {/* Gradiente de fondo en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300" style={{ background: `linear-gradient(to bottom right, ${social.color.split(' ')[1]}, ${social.color.split(' ')[3]})` }}></div>

                {/* Contenido */}
                <div className="relative z-10 space-y-4 text-center">
                  {/* Icono */}
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, var(--color-purple), var(--color-teal))' }}>
                    {social.name === 'Instagram' && (
                      <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
                    )}
                    {social.name === 'Facebook' && (
                      <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    )}
                    {social.name === 'TikTok' && (
                      <svg className="w-8 h-8" viewBox="0 0 24 24"><defs><linearGradient id="tiktok-grad"><stop offset="0%" stopColor="#00f7ef" /><stop offset="100%" stopColor="#ff0050" /></linearGradient></defs><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.82V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 5.26-3.09 6.33 6.33 0 0 0 6.33-6.33v-5.3c1.26.86 2.73 1.5 4.32 1.75v-3.4a4.82 4.82 0 0 1-3.32-1.04z" fill="url(#tiktok-grad)"/></svg>
                    )}
                    {social.name === 'YouTube' && (
                      <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    )}
                  </div>

                  {/* Nombre */}
                  <h3 className="text-2xl font-bold font-serif text-mist">
                    {social.name}
                  </h3>

                  {/* Handle */}
                  <p className="text-sm" style={{ color: 'var(--color-lavender)' }}>
                    {social.handle}
                  </p>

                  {/* CTA */}
                  <button className="w-full mt-4 btn-primary text-base font-medium">
                    {t.cta_follow}
                  </button>
                </div>

                {/* Decoración */}
                <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ background: `linear-gradient(to bottom right, ${social.color.split(' ')[1]}, ${social.color.split(' ')[3]})` }}></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
