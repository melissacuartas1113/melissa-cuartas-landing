/**
 * Lead Modal Component
 * Captura de datos: nombre, email, WhatsApp
 * Validación frontend y envío de formulario
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
// Detect if running in TikTok in-app browser
const isTikTokBrowser = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('tiktok') || ua.includes('bytedance');
};


interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceType: 'budget' | 'test' | 'beliefs';
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
  onSubmit: (data: LeadFormData) => Promise<void>;
}

export interface LeadFormData {
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  acceptTerms: boolean;
  resourceType: string;
  timestamp: string;
}

const countryCodes = [
  { code: '+1', label: 'US/CA' },
  { code: '+34', label: 'ES' },
  { code: '+57', label: 'CO' },
  { code: '+55', label: 'BR' },
  { code: '+52', label: 'MX' },
  { code: '+44', label: 'UK' },
];

export default function LeadModal({
  isOpen,
  onClose,
  resourceType,
  language,
  translations,
  onSubmit,
}: LeadModalProps) {
  const t = translations[language];
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    whatsapp: '',
    countryCode: '+57',
    acceptTerms: false,
    resourceType,
    timestamp: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.validation_required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.validation_required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.validation_email;
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = t.validation_required;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t.validation_required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const captureLead = trpc.leads.capture.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if in TikTok browser
    if (isTikTokBrowser()) {
      toast.info(
        language === 'es'
          ? 'Por favor, abre este link en tu navegador (no en TikTok) para descargar'
          : 'Please open this link in your browser (not in TikTok) to download'
      );
      return;
    }

    setIsLoading(true);
    try {
      // STEP 1: Capture the lead FIRST (send email)
      try {
        await captureLead.mutateAsync({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          country: formData.countryCode,
          source: resourceType,
        });
      } catch (captureError) {
        console.error('Lead capture error:', captureError);
      }

      // STEP 2: Trigger download AFTER lead is captured
      let downloadUrl = '';

      if (resourceType === 'budget') {
        downloadUrl = '/api/download/budget';
      } else if (resourceType === 'beliefs') {
        downloadUrl = '/api/download/beliefs';
      }

      // Try window.open() first (works in Instagram)
      // If it fails or returns null, use window.location (fallback for TikTok)
      if (downloadUrl) {
        try {
          const newWindow = window.open(downloadUrl, '_blank');
          if (!newWindow) {
            window.location.href = downloadUrl;
          }
        } catch (e) {
          console.warn('window.open() failed, using fallback:', e);
          window.location.href = downloadUrl;
        }
      }

      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        countryCode: '+57',
        acceptTerms: false,
        resourceType,
        timestamp: new Date().toISOString(),
      });
      setErrors({});
      onClose();

      toast.success(
        language === 'es'
          ? '¡Gracias! Revisa tu correo.'
          : 'Thanks! Check your email.'
      );
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(
        language === 'es'
          ? 'Error al procesar tu solicitud'
          : 'Error processing your request'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-foreground">
            {language === 'es' ? 'Acceso Gratis' : 'Free Access'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-md transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.form_name}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-card text-foreground"
              placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.form_email}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-card text-foreground"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t.form_whatsapp}
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-card text-foreground text-sm"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.label})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-card text-foreground"
                placeholder="3001234567"
              />
            </div>
            {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
          </div>


          {/* TikTok Warning */}
          {isTikTokBrowser() && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                {language === 'es'
                  ? '⚠️ Estás en TikTok. Después de llenar este formulario, abre el link en tu navegador para descargar.'
                  : '⚠️ You are on TikTok. After filling this form, open the link in your browser to download.'}
              </p>
            </div>
          )}

          {/* Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-border focus:ring-2 focus:ring-accent cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-foreground/80 cursor-pointer">
              {t.form_accept_terms}
            </label>
          </div>
          {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : t.form_submit}
          </button>

          {/* Honeypot field (anti-bot) */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
