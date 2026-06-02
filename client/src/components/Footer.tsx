/**
 * Footer Component
 * Links, redes sociales, contacto y política de privacidad
 */

import { Mail } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
  onLanguageChange: (lang: 'es' | 'en') => void;
}

export default function Footer({ language, translations, onLanguageChange }: FooterProps) {
  const t = translations[language];

  const navLinks = [
    { label: t.nav_about, id: 'about' },
    { label: t.nav_resources, id: 'resources' },
    { label: t.nav_calculator, id: 'calculator' },
    { label: t.nav_mentoring, id: 'mentoring' },
    { label: t.footer_contact, id: 'contact' },
  ];

  const socialLinks = [
    { image: '/manus-storage/instagram-logo_fcfed5a2.png', url: 'https://www.instagram.com/melissacuartas1113/', label: 'Instagram' },
    { image: '/manus-storage/facebook-f-blue-logo_07e88c7c.png', url: 'https://www.facebook.com/melissacuartas1113/', label: 'Facebook' },
    { image: '/manus-storage/tiktok-logo_a0f3e4c0.png', url: 'https://www.tiktok.com/@melissacuartas1113', label: 'TikTok' },
    { image: '/manus-storage/youtube-logo_ed624157.png', url: 'https://www.youtube.com/@MelissaCuartas1113', label: 'YouTube' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="border-t" style={{ background: 'var(--color-midnight-blue)', color: 'var(--color-mist)', borderColor: 'rgba(196, 179, 232, 0.2)' }}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Columna 1: Logo y Descripción */}
          <div className="space-y-4">
            <Logo size="md" variant="dark" />
            <a
              href="https://wa.me/573017361157?text=Hola%20Melissa%2C%20me%20gustaría%20conocer%20más%20sobre%20tu%20mentoría%20de%20finanzas%20conscientes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-lg font-medium text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #25D366, #20BA5A)',
                color: 'white',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {language === 'es' ? 'Chatea conmigo' : 'Chat with me'}
            </a>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-lavender)' }}>
              <Mail size={16} />
              <a href="mailto:melissacuartas1113@gmail.com" className="transition-colors" style={{ color: 'var(--color-lavender)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-teal)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lavender)'}>
                melissacuartas1113@gmail.com
              </a>
            </div>
          </div>

          {/* Columna 2: Links de Navegación */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-mist">
              {language === 'es' ? 'Navegación' : 'Navigation'}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
              <button
                onClick={() => scrollToSection(link.id)}
                className="transition-colors text-sm"
                style={{ color: 'var(--color-lavender)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-teal)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lavender)'}
              >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-serif text-mist">
              {language === 'es' ? 'Sígueme' : 'Follow me'}
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-purple), var(--color-teal))',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  title={social.label}
                >
                  <img src={social.image} alt={social.label} className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px my-12" style={{ background: 'linear-gradient(to right, transparent, rgba(196, 179, 232, 0.3), transparent)' }}></div>

        {/* Footer Inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright y Tagline */}
          <div className="text-center md:text-left space-y-2">
            <p className="text-sm" style={{ color: 'var(--color-lavender)' }}>
              © 2025 Melissa Cuartas 11:13 · {t.footer_all_rights}
            </p>
            <p className="text-xs tracking-widest" style={{ color: 'rgba(196, 179, 232, 0.4)' }}>
              {t.footer_tagline}
            </p>
          </div>

          {/* Política de Privacidad y Selector de Idioma */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <a
              href="/manus-storage/politica-privacidad_c0002241.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{ color: 'var(--color-lavender)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-teal)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-lavender)'}
            >
              {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            </a>

            {/* Selector de Idioma */}
            <div className="flex items-center gap-2 rounded-md p-1" style={{ background: 'var(--color-dark-slate)' }}>
              <button
                onClick={() => onLanguageChange('es')}
                className="px-3 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background: language === 'es' ? 'var(--color-teal)' : 'transparent',
                  color: language === 'es' ? 'var(--color-midnight-blue)' : 'var(--color-lavender)',
                }}
              >
                ES
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className="px-3 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background: language === 'en' ? 'var(--color-teal)' : 'transparent',
                  color: language === 'en' ? 'var(--color-midnight-blue)' : 'var(--color-lavender)',
                }}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
