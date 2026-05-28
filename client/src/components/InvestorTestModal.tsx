/**
 * Investor Test Modal Component
 * Test interactivo: ¿Qué perfil de inversionista eres?
 * 10 preguntas con lógica de puntuación y resultados personalizados
 * + Formulario de leads antes del test
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export interface LeadFormData {
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  acceptTerms: boolean;
  resourceType: string;
  timestamp: string;
}

interface InvestorTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
  onSubmitLead?: (data: LeadFormData) => Promise<void>;
}

const questions = [
  {
    id: 1,
    es: '¿Cuál es tu principal objetivo al invertir?',
    en: 'What is your main investment objective?',
    options: [
      { es: 'Proteger mi dinero de la inflación sin correr riesgos; mantenerlo seguro.', en: 'Protect my money from inflation without taking risks; keep it safe.', points: 1 },
      { es: 'Lograr un equilibrio entre seguridad y un crecimiento moderado a mediano plazo.', en: 'Achieve a balance between security and moderate growth in the medium term.', points: 2 },
      { es: 'Maximizar las ganancias a largo plazo, asumiendo que puedo tener pérdidas en el camino.', en: 'Maximize long-term gains, assuming I can have losses along the way.', points: 3 },
    ],
  },
  {
    id: 2,
    es: '¿Por cuánto tiempo planeas mantener tu inversión antes de retirar el dinero?',
    en: 'How long do you plan to hold your investment before withdrawing?',
    options: [
      { es: 'Menos de 1 año (Corto plazo).', en: 'Less than 1 year (Short term).', points: 1 },
      { es: 'Entre 1 y 5 años (Mediano plazo).', en: 'Between 1 and 5 years (Medium term).', points: 2 },
      { es: 'Más de 5 años (Largo plazo).', en: 'More than 5 years (Long term).', points: 3 },
    ],
  },
  {
    id: 3,
    es: '¿Qué porcentaje de tus ingresos mensuales o ahorros estás dispuesto a destinar a la inversión?',
    en: 'What percentage of your monthly income or savings are you willing to invest?',
    options: [
      { es: 'Menos del 10% (Solo un pequeño extra).', en: 'Less than 10% (Just a small extra).', points: 1 },
      { es: 'Entre el 10% y el 30%.', en: 'Between 10% and 30%.', points: 2 },
      { es: 'Más del 30% (Estoy enfocado en construir capital).', en: 'More than 30% (I am focused on building capital).', points: 3 },
    ],
  },
  {
    id: 4,
    es: 'Imagina que inviertes $1,000 USD. A los pocos meses, tu inversión baja a $850 USD. ¿Qué haces?',
    en: 'Imagine you invest $1,000 USD. After a few months, it drops to $850 USD. What do you do?',
    options: [
      { es: 'Me asusto y retiro todo de inmediato para no seguir perdiendo.', en: 'I get scared and withdraw everything immediately to avoid further losses.', points: 1 },
      { es: 'No hago nada; espero a que el mercado se recupere, pero sigo monitoreando con nerviosismo.', en: 'I do nothing; I wait for the market to recover, but I keep monitoring nervously.', points: 2 },
      { es: 'Compro más, ya que considero que los activos están "en descuento" y subirán a largo plazo.', en: 'I buy more, as I consider assets are "on discount" and will rise long-term.', points: 3 },
    ],
  },
  {
    id: 5,
    es: '¿Cómo describirías tu conocimiento sobre productos financieros?',
    en: 'How would you describe your knowledge of financial products?',
    options: [
      { es: 'Muy básico; prefiero que alguien me guíe.', en: 'Very basic; I prefer someone to guide me.', points: 1 },
      { es: 'Tengo conocimiento moderado; he invertido antes.', en: 'Moderate knowledge; I have invested before.', points: 2 },
      { es: 'Avanzado; he estudiado y experimentado bastante.', en: 'Advanced; I have studied and experimented a lot.', points: 3 },
    ],
  },
  {
    id: 6,
    es: '¿Cuál es tu situación financiera actual?',
    en: 'What is your current financial situation?',
    options: [
      { es: 'Tengo deudas y poco ahorro.', en: 'I have debts and little savings.', points: 1 },
      { es: 'Tengo ahorros estables pero sin mucho capital extra.', en: 'I have stable savings but not much extra capital.', points: 2 },
      { es: 'Tengo capital disponible para invertir sin afectar mis gastos.', en: 'I have capital available to invest without affecting my expenses.', points: 3 },
    ],
  },
  {
    id: 7,
    es: '¿Qué tan importante es para ti tener acceso rápido a tu dinero?',
    en: 'How important is it for you to have quick access to your money?',
    options: [
      { es: 'Muy importante; necesito liquidez inmediata.', en: 'Very important; I need immediate liquidity.', points: 1 },
      { es: 'Moderadamente importante; puedo esperar algunos meses.', en: 'Moderately important; I can wait a few months.', points: 2 },
      { es: 'No es importante; puedo dejar el dinero bloqueado años.', en: 'Not important; I can leave the money locked for years.', points: 3 },
    ],
  },
  {
    id: 8,
    es: '¿Cómo reaccionas ante cambios en el mercado?',
    en: 'How do you react to market changes?',
    options: [
      { es: 'Me pongo nervioso y quiero vender.', en: 'I get nervous and want to sell.', points: 1 },
      { es: 'Me mantengo neutral y observo.', en: 'I stay neutral and observe.', points: 2 },
      { es: 'Veo oportunidades y quiero comprar más.', en: 'I see opportunities and want to buy more.', points: 3 },
    ],
  },
  {
    id: 9,
    es: '¿Cuál es tu horizonte de inversión ideal?',
    en: 'What is your ideal investment horizon?',
    options: [
      { es: 'Corto (menos de 1 año).', en: 'Short (less than 1 year).', points: 1 },
      { es: 'Mediano (1-5 años).', en: 'Medium (1-5 years).', points: 2 },
      { es: 'Largo (más de 5 años).', en: 'Long (more than 5 years).', points: 3 },
    ],
  },
  {
    id: 10,
    es: '¿Qué esperas lograr con tus inversiones?',
    en: 'What do you hope to achieve with your investments?',
    options: [
      { es: 'Proteger mi patrimonio de la inflación.', en: 'Protect my assets from inflation.', points: 1 },
      { es: 'Generar ingresos complementarios.', en: 'Generate supplementary income.', points: 2 },
      { es: 'Crear riqueza y libertad financiera.', en: 'Create wealth and financial freedom.', points: 3 },
    ],
  },
];

export default function InvestorTestModal({
  isOpen,
  onClose,
  language,
  onSubmitLead,
}: InvestorTestModalProps) {
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    whatsapp: '',
    countryCode: '+57',
    acceptTerms: false,
    resourceType: 'test',
    timestamp: new Date().toISOString(),
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const handleSelectOption = (points: number) => {
    setAnswers({ ...answers, [currentQuestion]: points });
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = language === 'es' ? 'Campo requerido' : 'Required field';
    if (!formData.email.trim()) newErrors.email = language === 'es' ? 'Campo requerido' : 'Required field';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = language === 'es' ? 'Email inválido' : 'Invalid email';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = language === 'es' ? 'Campo requerido' : 'Required field';
    if (!formData.acceptTerms) newErrors.acceptTerms = language === 'es' ? 'Debes aceptar los términos' : 'You must accept the terms';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const captureLead = trpc.leads.capture.useMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoadingForm(true);
    try {
      // Send lead to backend
      await captureLead.mutateAsync({
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        country: formData.countryCode,
        source: 'investor-test',
      });

      if (onSubmitLead) {
        await onSubmitLead(formData);
      }
      setShowLeadForm(false);

      toast.success(
        language === 'es'
          ? '¡Lead capturado exitosamente!'
          : 'Lead captured successfully!'
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        language === 'es'
          ? 'Error al capturar el lead'
          : 'Error capturing lead'
      );
    } finally {
      setIsLoadingForm(false);
    }
  };

  if (!isOpen) return null;

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  let profileType = 'conservative';
  let profileBadge = language === 'es' ? 'Perfil Conservador' : 'Conservative Profile';
  let profileTitle = language === 'es' ? 'Inversionista Conservador' : 'Conservative Investor';
  let profileDesc = language === 'es' 
    ? 'Buscas seguridad y estabilidad. Prefieres inversiones de bajo riesgo que protejan tu capital.'
    : 'You seek security and stability. You prefer low-risk investments that protect your capital.';
  let profileOptions = language === 'es' 
    ? ['Fondos de inversión de renta fija', 'Bonos del gobierno', 'Cuentas de ahorro de alto rendimiento']
    : ['Fixed income investment funds', 'Government bonds', 'High-yield savings accounts'];

  if (totalScore >= 17 && totalScore <= 24) {
    profileType = 'moderate';
    profileBadge = language === 'es' ? 'Perfil Moderado' : 'Moderate Profile';
    profileTitle = language === 'es' ? 'Inversionista Moderado' : 'Moderate Investor';
    profileDesc = language === 'es'
      ? 'Buscas equilibrio entre seguridad y crecimiento. Estás dispuesto a asumir riesgos moderados.'
      : 'You seek balance between security and growth. You are willing to take moderate risks.';
    profileOptions = language === 'es'
      ? ['Fondos indexados', 'Acciones de empresas consolidadas', 'Criptomonedas de bajo riesgo']
      : ['Index funds', 'Established company stocks', 'Low-risk cryptocurrencies'];
  } else if (totalScore >= 25) {
    profileType = 'aggressive';
    profileBadge = language === 'es' ? 'Perfil Agresivo' : 'Aggressive Profile';
    profileTitle = language === 'es' ? 'Inversionista Agresivo' : 'Aggressive Investor';
    profileDesc = language === 'es'
      ? 'Buscas máximo crecimiento. Estás preparado para volatilidad y posibles pérdidas a corto plazo.'
      : 'You seek maximum growth. You are prepared for volatility and possible short-term losses.';
    profileOptions = language === 'es'
      ? ['Acciones de alto crecimiento', 'Startups y emprendimientos', 'Criptomonedas emergentes']
      : ['High-growth stocks', 'Startups and ventures', 'Emerging cryptocurrencies'];
  }

  const badgeColors = {
    conservative: 'bg-red-100 text-red-700',
    moderate: 'bg-amber-100 text-amber-700',
    aggressive: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ background: 'var(--color-mist)' }}>
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b" style={{ borderColor: 'rgba(196, 179, 232, 0.2)' }}>
          <div>
            <h2 className="text-2xl font-bold font-serif" style={{ color: 'var(--color-midnight-blue)' }}>
              {showLeadForm ? (language === 'es' ? 'Acceso al Test' : 'Test Access') : (showResults ? profileBadge : (language === 'es' ? 'Test de Perfil' : 'Profile Test'))}
            </h2>
            {!showLeadForm && !showResults && <p style={{ color: 'var(--color-blue-medium)' }} className="text-sm mt-1">{language === 'es' ? '10 preguntas para descubrir tu perfil' : '10 questions to discover your profile'}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} style={{ color: 'var(--color-midnight-blue)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showLeadForm ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-midnight-blue)' }}>
                  {language === 'es' ? 'Nombre completo' : 'Full name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: formErrors.name ? '#ef4444' : 'rgba(196, 179, 232, 0.3)', color: 'var(--color-midnight-blue)', backgroundColor: '#ffffff' }}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-midnight-blue)' }}>
                  {language === 'es' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{ borderColor: formErrors.email ? '#ef4444' : 'rgba(196, 179, 232, 0.3)', color: 'var(--color-midnight-blue)', backgroundColor: '#ffffff' }}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="flex gap-2">
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                  style={{ borderColor: 'rgba(196, 179, 232, 0.3)', color: 'var(--color-midnight-blue)', backgroundColor: '#ffffff' }}
                >
                  <option value="+1">+1 US/CA</option>
                  <option value="+34">+34 ES</option>
                  <option value="+57">+57 CO</option>
                  <option value="+55">+55 BR</option>
                  <option value="+52">+52 MX</option>
                  <option value="+44">+44 UK</option>
                </select>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder={language === 'es' ? 'Tu número' : 'Your number'}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: formErrors.whatsapp ? '#ef4444' : 'rgba(196, 179, 232, 0.3)', color: 'var(--color-midnight-blue)', backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>
              {formErrors.whatsapp && <p className="text-red-500 text-xs">{formErrors.whatsapp}</p>}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm" style={{ color: 'var(--color-midnight-blue)' }}>
                  {language === 'es' ? 'Acepto recibir información sobre mentoría y finanzas conscientes' : 'I accept to receive information about mentoring and conscious finances'}
                </span>
              </label>
              {formErrors.acceptTerms && <p className="text-red-500 text-xs">{formErrors.acceptTerms}</p>}
              <button
                type="submit"
                disabled={isLoadingForm}
                className="w-full px-6 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                style={{
                  background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))',
                }}
              >
                {isLoadingForm ? (language === 'es' ? 'Cargando...' : 'Loading...') : (language === 'es' ? 'Comenzar Test' : 'Start Test')}
              </button>
            </form>
          ) : !showResults ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))',
                    }}
                  ></div>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-blue-medium)' }}>
                  {language === 'es' ? `Pregunta ${currentQuestion + 1} de ${questions.length}` : `Question ${currentQuestion + 1} of ${questions.length}`}
                </p>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-midnight-blue)' }}>
                  {language === 'es' ? questions[currentQuestion].es : questions[currentQuestion].en}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option.points)}
                      className="w-full p-4 text-left border-2 rounded-lg transition-all"
                      style={{
                        borderColor: answers[currentQuestion] === option.points ? 'var(--color-teal)' : 'rgba(196, 179, 232, 0.3)',
                        background: answers[currentQuestion] === option.points ? 'rgba(0, 200, 200, 0.1)' : 'transparent',
                        color: 'var(--color-midnight-blue)',
                      }}
                    >
                      {language === 'es' ? option.es : option.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    color: 'var(--color-midnight-blue)',
                  }}
                >
                  {language === 'es' ? 'Anterior' : 'Previous'}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!(currentQuestion in answers)}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))',
                  }}
                >
                  {currentQuestion === questions.length - 1 ? (language === 'es' ? 'Ver Resultados' : 'See Results') : (language === 'es' ? 'Siguiente' : 'Next')}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="text-center">
                <div
                  className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-4 ${badgeColors[profileType as keyof typeof badgeColors]}`}
                >
                  {profileBadge}
                </div>
                <h2 className="text-3xl font-bold font-serif mb-4" style={{ color: 'var(--color-midnight-blue)' }}>
                  {profileTitle}
                </h2>
                <p className="text-base mb-6 p-4 rounded-lg" style={{ background: 'rgba(196, 179, 232, 0.1)', color: 'var(--color-midnight-blue)' }}>
                  <strong>{profileDesc}</strong>
                </p>

                <div className="text-left mb-6">
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--color-midnight-blue)' }}>
                    {language === 'es' ? 'Tus alternativas ideales:' : 'Your ideal alternatives:'}
                  </h4>
                  <ul className="space-y-2">
                    {profileOptions.map((option, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3" style={{ color: 'var(--color-teal)' }}>✓</span>
                        <span style={{ color: 'var(--color-midnight-blue)' }}>{option}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleRestart}
                  className="w-full px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  style={{
                    background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))',
                  }}
                >
                  {language === 'es' ? 'Hacer de Nuevo' : 'Try Again'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
