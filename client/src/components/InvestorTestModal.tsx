/**
 * Investor Test Modal Component
 * Test interactivo: ¿Qué perfil de inversionista eres?
 * 10 preguntas con lógica de puntuación y resultados personalizados
 */

import { useState } from 'react';
import { X } from 'lucide-react';

interface InvestorTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'es' | 'en';
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
      { es: 'Muy básico o nulo. Prefiero lo tradicional y sencillo.', en: 'Very basic or none. I prefer traditional and simple.', points: 1 },
      { es: 'Intermedio. Entiendo cómo funcionan los fondos de inversión y la relación riesgo-retorno.', en: 'Intermediate. I understand how investment funds work and risk-return.', points: 2 },
      { es: 'Avanzado. Sigo los mercados, entiendo la volatilidad y opero en diferentes plataformas.', en: 'Advanced. I follow markets, understand volatility, and operate on different platforms.', points: 3 },
    ],
  },
  {
    id: 6,
    es: '¿De dónde provienen los ingresos que vas a invertir?',
    en: 'Where do the funds you will invest come from?',
    options: [
      { es: 'Es el dinero de mis emergencias o ahorros de toda la vida que no puedo perder.', en: 'It is my emergency fund or lifetime savings that I cannot afford to lose.', points: 1 },
      { es: 'Un excedente de mis ingresos mensuales estables.', en: 'A surplus from my stable monthly income.', points: 2 },
      { es: 'Capital destinado exclusivamente a buscar alto crecimiento; si se pierde, no afecta mi vida.', en: 'Capital exclusively for high growth; if lost, it does not affect my lifestyle.', points: 3 },
    ],
  },
  {
    id: 7,
    es: '¿Qué frase define mejor tu actitud ante la volatilidad?',
    en: 'Which phrase best defines your attitude toward volatility?',
    options: [
      { es: '"No me deja dormir en paz saber que mi dinero está disminuyendo de valor"', en: '"It does not let me sleep knowing my money is losing value"', points: 1 },
      { es: '"Acepto fluctuaciones pequeñas si eso significa ganar más que en una cuenta de ahorros"', en: '"I accept small fluctuations if it means earning more than a savings account"', points: 2 },
      { es: '"La volatilidad es parte del juego y es la única forma de obtener grandes rendimientos"', en: '"Volatility is part of the game and the only way to get big returns"', points: 3 },
    ],
  },
  {
    id: 8,
    es: 'Si tuvieras que elegir entre estas tres opciones de inversión, ¿cuál elegirías?',
    en: 'If you had to choose between three investment options, which would you choose?',
    options: [
      { es: 'Una opción que te garantice un 10% anual fijo, con riesgo cero de pérdida.', en: 'An option guaranteeing 10% annual fixed, with zero loss risk.', points: 1 },
      { es: 'Una opción que promedie un 15% anual, pero que un año malo pueda caer un 5%.', en: 'An option averaging 15% annual, but a bad year could drop 5%.', points: 2 },
      { es: 'Una opción que pueda darte un 30% anual, pero con riesgo de caer un 20% o más.', en: 'An option that could give 30% annual, but risk dropping 20% or more.', points: 3 },
    ],
  },
  {
    id: 9,
    es: '¿Cuál es tu situación laboral y estabilidad de ingresos actual?',
    en: 'What is your employment situation and income stability?',
    options: [
      { es: 'Ingresos variables, inestables o dependo de este capital a corto plazo.', en: 'Variable, unstable income or I depend on this capital short-term.', points: 1 },
      { es: 'Ingresos estables (salario fijo o negocio consolidado), con capacidad de ahorro regular.', en: 'Stable income (fixed salary or established business), with regular savings capacity.', points: 2 },
      { es: 'Ingresos sólidos y múltiples fuentes de ingresos que respaldan mis inversiones.', en: 'Solid income and multiple income sources supporting my investments.', points: 3 },
    ],
  },
  {
    id: 10,
    es: 'En el pasado, cuando has tomado decisiones financieras con riesgo, ¿cómo te has sentido?',
    en: 'In the past, when you made risky financial decisions, how did you feel?',
    options: [
      { es: 'No suelo tomarlos, prefiero la certeza absoluta.', en: 'I usually do not take them, I prefer absolute certainty.', points: 1 },
      { es: 'Con algo de ansiedad al principio, pero me adapto si veo resultados después.', en: 'With some anxiety at first, but I adapt if I see results later.', points: 2 },
      { es: 'Cómodo y emocionado por la oportunidad de ganar más.', en: 'Comfortable and excited about the opportunity to earn more.', points: 3 },
    ],
  },
];

export default function InvestorTestModal({ isOpen, onClose, language }: InvestorTestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const t = language === 'es' ? {
    title: '¿Qué perfil de inversionista eres?',
    subtitle: 'Responde las siguientes 10 preguntas para descubrir tu estrategia ideal.',
    previous: 'Anterior',
    next: 'Siguiente',
    results: 'Ver Resultados',
    restart: 'Volver a hacer el test',
    conservative: 'Perfil Conservador',
    conservative_title: 'Tu norte es la seguridad',
    conservative_desc: 'Tu prioridad principal es preservar tu dinero y la tranquilidad mental sobre las rentabilidades altas. No toleras bien la volatilidad a corto plazo.',
    conservative_options: ['Cuentas de ahorros de alta rentabilidad (neobancos).', 'CDTs digitales a plazos fijos.', 'Fondos de inversión colectiva (FICs) de Renta Fija de bajo riesgo o bonos estatales.'],
    moderate: 'Perfil Moderado',
    moderate_title: 'Buscas el equilibrio perfecto',
    moderate_desc: 'Entiendes que para ganarle a la inflación hay que asumir algo de riesgo, pero mantienes siempre la cautela. Toleras variaciones temporales si sabes que a mediano plazo el capital crecerá.',
    moderate_options: ['Fondos de inversión inmobiliaria (bienes raíces digitales).', 'Portafolios diversificados de plataformas digitales (mezcla Renta Fija y Acciones).', 'ETFs globales indexados estables.'],
    aggressive: 'Perfil Agresivo / Crecimiento',
    aggressive_title: 'Vas por el crecimiento exponencial',
    aggressive_desc: 'Tienes el estómago, el conocimiento y el horizonte de tiempo para entender que las caídas del mercado son simples oportunidades de compra en descuento. Buscas maximizar tu capital a largo plazo.',
    aggressive_options: ['Acciones individuales y ETFs de crecimiento / tecnológicos.', 'Fondos de capital privado y Crowdfunding financiero.', 'Criptoactivos o inversiones fintech de alto riesgo con capital de riesgo controlado.'],
  } : {
    title: 'What investor profile are you?',
    subtitle: 'Answer the following 10 questions to discover your ideal strategy.',
    previous: 'Previous',
    next: 'Next',
    results: 'See Results',
    restart: 'Retake the test',
    conservative: 'Conservative Profile',
    conservative_title: 'Your focus is security',
    conservative_desc: 'Your main priority is preserving your money and peace of mind over high returns. You do not tolerate short-term volatility well.',
    conservative_options: ['High-yield savings accounts (neobanks).', 'Digital fixed-term CDs.', 'Low-risk fixed-income collective investment funds or government bonds.'],
    moderate: 'Moderate Profile',
    moderate_title: 'You seek the perfect balance',
    moderate_desc: 'You understand that to beat inflation you must take some risk, but always maintain caution. You tolerate temporary variations if you know capital will grow medium-term.',
    moderate_options: ['Real estate investment funds (digital real estate).', 'Diversified portfolios from digital platforms (mix fixed income and stocks).', 'Stable global indexed ETFs.'],
    aggressive: 'Aggressive / Growth Profile',
    aggressive_title: 'You are going for exponential growth',
    aggressive_desc: 'You have the stomach, knowledge, and time horizon to understand that market downturns are simply buying opportunities at a discount. You seek to maximize your capital long-term.',
    aggressive_options: ['Individual stocks and growth / technology ETFs.', 'Private equity funds and financial crowdfunding.', 'Crypto assets or high-risk fintech investments with controlled risk capital.'],
  };

  if (!isOpen) return null;

  const handleSelectOption = (points: number) => {
    const newAnswers = { ...answers, [currentQuestion]: points };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
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

  const calculateResults = () => {
    let totalScore = 0;
    for (let i = 0; i < questions.length; i++) {
      totalScore += answers[i] || 0;
    }
    return totalScore;
  };

  const totalScore = calculateResults();
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  let profileType = 'conservative';
  let profileBadge = t.conservative;
  let profileTitle = t.conservative_title;
  let profileDesc = t.conservative_desc;
  let profileOptions = t.conservative_options;

  if (totalScore >= 17 && totalScore <= 24) {
    profileType = 'moderate';
    profileBadge = t.moderate;
    profileTitle = t.moderate_title;
    profileDesc = t.moderate_desc;
    profileOptions = t.moderate_options;
  } else if (totalScore >= 25) {
    profileType = 'aggressive';
    profileBadge = t.aggressive;
    profileTitle = t.aggressive_title;
    profileDesc = t.aggressive_desc;
    profileOptions = t.aggressive_options;
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
              {showResults ? profileBadge : t.title}
            </h2>
            {!showResults && <p style={{ color: 'var(--color-blue-medium)' }} className="text-sm mt-1">{t.subtitle}</p>}
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
          {!showResults ? (
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
                  Pregunta {currentQuestion + 1} de {questions.length}
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
                        borderColor: answers[currentQuestion] === option.points ? 'var(--color-purple)' : 'rgba(196, 179, 232, 0.2)',
                        backgroundColor: answers[currentQuestion] === option.points ? 'rgba(123, 92, 231, 0.1)' : 'transparent',
                        color: 'var(--color-midnight-blue)',
                      }}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)}</span>
                      {language === 'es' ? option.es : option.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4 mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  style={{
                    background: 'rgba(196, 179, 232, 0.2)',
                    color: 'var(--color-midnight-blue)',
                  }}
                >
                  {t.previous}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!(currentQuestion in answers)}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(to right, var(--color-purple), var(--color-teal))',
                  }}
                >
                  {currentQuestion === questions.length - 1 ? t.results : t.next}
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
                  {t.restart}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
