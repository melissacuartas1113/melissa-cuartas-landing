/**
 * Home Page - Landing Page Principal
 * Integra todas las secciones: Header, Hero, About, Resources, Mentoring, Social, Footer
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ResourcesSection from '@/components/ResourcesSection';
import MentoringSection from '@/components/MentoringSection';
import SocialSection from '@/components/SocialSection';
import Footer from '@/components/Footer';
import { translations } from '@/lib/translations';

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user, loading, error, isAuthenticated, logout } = useAuth();

  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // Detectar idioma del navegador al cargar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLanguage(browserLang === 'en' ? 'en' : 'es');
    }
  }, []);

  // Guardar idioma en localStorage cuando cambia
  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Funciones de scroll
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Efecto de scroll reveal para elementos
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      {/* Hero Section */}
      <HeroSection
        language={language}
        translations={translations}
        onScrollToResources={() => scrollToSection('resources')}
        onScrollToMentoring={() => scrollToSection('mentoring')}
      />

      {/* About Section */}
      <AboutSection language={language} translations={translations} />

      {/* Resources Section */}
      <ResourcesSection language={language} translations={translations} />

      {/* Mentoring Section */}
      <MentoringSection language={language} translations={translations} />

      {/* Social Section */}
      <SocialSection language={language} translations={translations} />

      {/* Footer */}
      <Footer
        language={language}
        translations={translations}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}
