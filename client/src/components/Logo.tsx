/**
 * Logo Component - Monograma MC con gradiente púrpura → teal
 * Diseño: Espiritualidad Contemporánea Minimalista
 * Usado en header, footer y elementos de marca
 */

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  className?: string;
}

export default function Logo({ size = 'md', variant = 'dark', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const dimension = sizeMap[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradientMC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7B5CE7" />
          <stop offset="100%" stopColor="#0CBFBF" />
        </linearGradient>
      </defs>

      {/* Círculo exterior */}
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke={variant === 'dark' ? '#0CBFBF' : '#0D1B3E'}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Letra M */}
      <g>
        <path
          d="M 12 42 L 12 18 M 12 18 L 20 30 L 28 18 M 28 18 L 28 42"
          stroke="url(#gradientMC)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Letra C */}
      <g>
        <path
          d="M 44 20 Q 36 20 36 32 Q 36 44 44 44 Q 52 44 52 32"
          stroke="url(#gradientMC)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Números 11 y 13 dentro de la C */}
      <text
        x="44"
        y="28"
        fontSize="7"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill={variant === 'dark' ? '#0CBFBF' : '#0D1B3E'}
        textAnchor="middle"
      >
        11
      </text>
      <text
        x="44"
        y="40"
        fontSize="7"
        fontWeight="bold"
        fontFamily="Georgia, serif"
        fill={variant === 'dark' ? '#0CBFBF' : '#0D1B3E'}
        textAnchor="middle"
      >
        13
      </text>

      {/* Nombre debajo */}
      <text
        x="32"
        y="56"
        fontSize="5"
        fontWeight="600"
        fontFamily="DM Sans, sans-serif"
        fill={variant === 'dark' ? '#0CBFBF' : '#0D1B3E'}
        textAnchor="middle"
        letterSpacing="1"
      >
        MELISSA
      </text>
    </svg>
  );
}
