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
                  {social.label === 'Instagram' && (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
                  )}
                  {social.label === 'Facebook' && (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  )}
                  {social.label === 'TikTok' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><defs><linearGradient id="tiktok-grad-sm"><stop offset="0%" stopColor="#00f7ef" /><stop offset="100%" stopColor="#ff0050" /></linearGradient></defs><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.82V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 5.26-3.09 6.33 6.33 0 0 0 6.33-6.33v-5.3c1.26.86 2.73 1.5 4.32 1.75v-3.4a4.82 4.82 0 0 1-3.32-1.04z" fill="url(#tiktok-grad-sm)"/></svg>
                  )}
                  {social.label === 'YouTube' && (
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  )}
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
