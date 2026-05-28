/**
 * Social Section Component
 * Links a Instagram, TikTok y YouTube
 */

import { Instagram, Music, Facebook, Youtube } from 'lucide-react';

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
      icon: Instagram,
      color: 'from-pink-500 to-purple',
    },
    {
      name: 'Facebook',
      handle: 'Melissa Cuartas 1113',
      url: 'https://www.facebook.com/melissacuartas1113/',
      icon: Facebook,
      color: 'from-blue-600 to-blue-500',
    },
    {
      name: 'TikTok',
      handle: '@melissacuartas1113',
      url: 'https://www.tiktok.com/@melissacuartas1113',
      icon: Music,
      color: 'from-black to-gray-800',
    },
    {
      name: 'YouTube',
      handle: '@MelissaCuartas1113',
      url: 'https://www.youtube.com/@MelissaCuartas1113',
      icon: Youtube,
      color: 'from-red-600 to-red-500',
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
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
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
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto" style={{ background: `linear-gradient(to bottom right, ${social.color.split(' ')[1]}, ${social.color.split(' ')[3]})` }}>
                      <Icon size={32} className="text-white" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
