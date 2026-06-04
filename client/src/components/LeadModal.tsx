/**
 * Lead Modal Component
 * Captura de datos: nombre, email, WhatsApp
 * Validación frontend y envío de formulario
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

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

    setIsLoading(true);
    try {
      // STEP 1: Trigger download IMMEDIATELY (synchronously)
      // This MUST happen before any async operations
      let downloadUrl = '';
      let downloadFilename = '';

      if (resourceType === 'budget') {
        downloadUrl = '/api/download/budget';
        downloadFilename = 'Presupuesto_Consciente_Melissa_Cuartas.xlsx';
      } else if (resourceType === 'beliefs') {
        downloadUrl = '/api/download/beliefs';
        downloadFilename = 'Guia_Creencias_Limitantes_Melissa_Cuartas.xlsx';
      }

      // Download immediately - synchronous, tied to user action
      if (downloadUrl) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = downloadFilename;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // STEP 2: Capture the lead asynchronously (doesn't block download)
      try {
        await captureLead.mutateAsync({
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          country: formData.countryCode,
          source: resourceType,
        });
      } catch (captureError) {
        // Log but don't fail if lead capture fails
        console.error('Lead capture error:', captureError);
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
          ? 'Error al descargar recurso'
          : 'Error downloading resource'
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
