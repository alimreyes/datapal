'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; // Color principal del glow (ej: "1, 155, 119" para verde)
  onClick?: () => void;
  disabled?: boolean;
}

export default function GlowCard({
  children,
  className = '',
  glowColor = '1, 155, 119', // Verde DataPal por defecto
  onClick,
  disabled = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovered) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? `
            radial-gradient(
              400px circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(${glowColor}, 0.1),
              transparent 40%
            ),
            #1a1b16
          `
          : '#1a1b16',
      }}
    >
      {/* Borde con efecto de degradado que sigue el cursor */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `
            radial-gradient(
              300px circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(${glowColor}, 0.6),
              rgba(${glowColor}, 0.2) 40%,
              rgba(182, 182, 182, 0.1) 60%,
              transparent 70%
            )
          `,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Borde por defecto cuando no hay hover */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none border border-[rgba(251,254,242,0.1)] transition-opacity duration-300"
        style={{ opacity: isHovered ? 0 : 1 }}
      />

      {/* Contenido */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
