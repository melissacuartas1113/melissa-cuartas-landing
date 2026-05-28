/**
 * WhatsApp Floating Button Component
 * Botón flotante de WhatsApp con animación
 */

import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = '573017361157',
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
            {/* Burbuja de mensaje - Chat */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
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
