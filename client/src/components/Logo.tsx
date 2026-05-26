/**
 * Logo Component - Logo profesional de Melissa Cuartas 11:13
 * Imagen PNG con gradiente púrpura → teal
 * Diseño: Espiritualidad Contemporánea Minimalista
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
    <img
      src="/manus-storage/5_bde559c8.png"
      alt="Melissa Cuartas 11:13"
      width={dimension}
      height={dimension}
      className={`${className} object-contain`}
      style={{ aspectRatio: '1 / 1' }}
    />
  );
}
