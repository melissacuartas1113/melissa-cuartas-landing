/**
 * Header Component - Navegación principal
 * Diseño: Espiritualidad Contemporánea Minimalista
 * Sticky, con menú hamburguesa en móvil y selector de idioma
 */

import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  language: 'es' | 'en';
  onLanguageChange: (lang: 'es' | 'en') => void;
  translations: Record<string, Record<string, string>>;
}

export default function Header({ language, onLanguageChange, translations }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: t.nav_about, id: 'about' },
    { label: t.nav_resources, id: 'resources' },
    { label: t.nav_mentoring, id: 'mentoring' },
    { label: t.nav_contact, id: 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Logo size="sm" variant="dark" />
          <span className="hidden sm:inline font-bold text-sm tracking-wider text-foreground">
            MELISSA CUARTAS 11 13
          </span>
        </button>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-150"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controles Derecha */}
        <div className="flex items-center gap-4">
          {/* Selector de Idioma */}
          <div className="flex items-center gap-2 bg-secondary rounded-md p-1">
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                language === 'es'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:text-accent'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                language === 'en'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:text-accent'
              }`}
            >
              EN
            </button>
          </div>

          {/* CTA Principal Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollToSection('resources')}
              className="btn-primary text-sm"
            >
              {t.cta_free_resource}
            </button>
            <a
              href="https://wa.me/573017361157?text=Hola%20Melissa%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20tu%20mentor%C3%ADa%20de%20finanzas%20conscientes."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all"
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

          {/* Menú Hamburguesa Móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <X size={24} className="text-foreground" />
            ) : (
              <Menu size={24} className="text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                onClick={() => scrollToSection('resources')}
                className="btn-primary text-sm w-full"
              >
                {t.cta_free_resource}
              </button>
              <a
                href="https://wa.me/573017361157?text=Hola%20Melissa%2C%20me%20gustar%C3%ADa%20conocer%20m%C3%A1s%20sobre%20tu%20mentor%C3%ADa%20de%20finanzas%20conscientes."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all w-full"
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
          </nav>
        </div>
      )}
    </header>
  );
}
