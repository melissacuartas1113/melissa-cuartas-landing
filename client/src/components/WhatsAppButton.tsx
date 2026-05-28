/**
 * WhatsApp Floating Button Component
 * Botón flotante de WhatsApp con animación
 */

import { MessageCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '573212345678', // Reemplazar con número real
  message = 'Hola Melissa, me gustaría conocer más sobre tu mentoría.' 
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar botón después de 1 segundo
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleWhatsAppClick}
          className="fixed bottom-24 right-6 z-40 group"
          style={{
            animation: 'slideUp 0.5s ease-out',
          }}
          title="Contactar por WhatsApp"
        >
          {/* Fondo animado */}
          <div 
            className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #25D366, #20BA5A)',
              width: '60px',
              height: '60px',
            }}
          />

          {/* Botón principal */}
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #25D366, #20BA5A)',
            }}
          >
            {/* WhatsApp Logo SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.537 0-2.852-.503-3.822-1.496-.976-.999-1.514-2.327-1.514-3.782 0-1.454.538-2.783 1.514-3.782.97-.993 2.285-1.496 3.822-1.496 1.537 0 2.852.503 3.822 1.496.976.999 1.514 2.328 1.514 3.782 0 1.454-.538 2.783-1.514 3.782-.97.993-2.285 1.496-3.822 1.496M20.067 3.507c-1.358-1.327-3.158-2.057-5.067-2.057-1.909 0-3.709.73-5.067 2.057C7.6 4.834 6.822 6.622 6.822 8.61s.778 3.776 2.111 5.103c1.358 1.327 3.158 2.057 5.067 2.057 1.909 0 3.709-.73 5.067-2.057 1.333-1.327 2.111-3.115 2.111-5.103s-.778-3.776-2.111-5.103"/>
            </svg>
          </div>

          {/* Tooltip */}
          <div
            className="absolute right-16 bottom-4 bg-midnight-blue text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none"
            style={{
              background: 'var(--color-midnight-blue)',
              color: 'var(--color-mist)',
            }}
          >
            ¿Preguntas? Escríbeme
          </div>
        </button>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          button {
            bottom: 80px !important;
            right: 4px !important;
          }
        }
      `}</style>
    </>
  );
}
