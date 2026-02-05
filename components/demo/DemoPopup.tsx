'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Play, FileText } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPortal } from 'react-dom';

interface DemoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoPopup({ isOpen, onClose }: DemoPopupProps) {
  const router = useRouter();
  const { loginDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (popupRef.current && isHovered) {
        const rect = popupRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDemoClick = async () => {
    setIsLoading(true);
    const { success } = await loginDemo();
    if (success) {
      onClose();
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full max-w-4xl bg-[#0a0b08] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: isHovered
            ? `
              radial-gradient(
                600px circle at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(1, 155, 119, 0.08),
                transparent 40%
              ),
              #0a0b08
            `
            : '#0a0b08',
        }}
      >
        {/* Glow border effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `
              radial-gradient(
                400px circle at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(1, 155, 119, 0.5),
                rgba(1, 155, 119, 0.2) 40%,
                transparent 70%
              )
            `,
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Default border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none border border-[#019B77]/30 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0 : 1 }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] text-[#B6B6B6] hover:text-[#FBFEF2] hover:border-[#019B77]/50 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 grid md:grid-cols-2 min-h-[400px]">
          {/* Left side - Illustration */}
          <div className="relative p-8 flex items-center justify-center border-r border-[rgba(251,254,242,0.05)]">
            {/* Palantir-style illustration */}
            <svg
              viewBox="0 0 400 300"
              className="w-full h-auto max-h-[300px]"
              style={{ filter: 'drop-shadow(0 0 20px rgba(1, 155, 119, 0.2))' }}
            >
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="rgba(251, 254, 242, 0.03)"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#019B77" stopOpacity="0" />
                  <stop offset="50%" stopColor="#019B77" stopOpacity="1" />
                  <stop offset="100%" stopColor="#019B77" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="400" height="300" fill="url(#grid)" />

              {/* Left side - Scattered data points */}
              <g className="data-points">
                {/* Data points with pulse animation */}
                {[
                  { cx: 40, cy: 50, delay: 0 },
                  { cx: 70, cy: 90, delay: 0.2 },
                  { cx: 30, cy: 140, delay: 0.4 },
                  { cx: 80, cy: 180, delay: 0.6 },
                  { cx: 50, cy: 220, delay: 0.8 },
                  { cx: 90, cy: 260, delay: 1 },
                  { cx: 60, cy: 30, delay: 0.3 },
                  { cx: 100, cy: 120, delay: 0.5 },
                  { cx: 45, cy: 200, delay: 0.7 },
                  { cx: 85, cy: 70, delay: 0.9 },
                ].map((point, i) => (
                  <g key={i}>
                    <circle
                      cx={point.cx}
                      cy={point.cy}
                      r="4"
                      fill="#019B77"
                      filter="url(#glow)"
                      style={{
                        animation: `pulse 2s ease-in-out ${point.delay}s infinite`,
                      }}
                    />
                    <circle
                      cx={point.cx}
                      cy={point.cy}
                      r="8"
                      fill="none"
                      stroke="#019B77"
                      strokeOpacity="0.3"
                      style={{
                        animation: `ripple 2s ease-out ${point.delay}s infinite`,
                      }}
                    />
                  </g>
                ))}
              </g>

              {/* Center - Processing funnel/cylinder */}
              <g transform="translate(160, 50)">
                {/* Funnel shape */}
                <ellipse
                  cx="40"
                  cy="0"
                  rx="35"
                  ry="10"
                  fill="none"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <ellipse
                  cx="40"
                  cy="200"
                  rx="25"
                  ry="8"
                  fill="none"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                {/* Connecting lines */}
                <line x1="5" y1="0" x2="15" y2="200" stroke="#019B77" strokeWidth="1" strokeOpacity="0.3" />
                <line x1="75" y1="0" x2="65" y2="200" stroke="#019B77" strokeWidth="1" strokeOpacity="0.3" />

                {/* Inner processing lines */}
                <path
                  d="M 40 20 Q 30 100 40 180"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  fill="none"
                  strokeDasharray="4 4"
                  style={{ animation: 'dash 3s linear infinite' }}
                />
                <path
                  d="M 40 20 Q 50 100 40 180"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  fill="none"
                  strokeDasharray="4 4"
                  style={{ animation: 'dash 3s linear infinite reverse' }}
                />

                {/* DataPal text */}
                <text
                  x="40"
                  y="105"
                  textAnchor="middle"
                  fill="#019B77"
                  fontSize="10"
                  fontFamily="monospace"
                  opacity="0.7"
                >
                  DataPal
                </text>

                {/* Processing indicator */}
                <circle
                  cx="40"
                  cy="100"
                  r="15"
                  fill="none"
                  stroke="#019B77"
                  strokeWidth="2"
                  strokeDasharray="20 60"
                  style={{ animation: 'spin 3s linear infinite' }}
                />
              </g>

              {/* Connecting lines from data points to funnel */}
              {[
                { x1: 40, y1: 50, x2: 165, y2: 60 },
                { x1: 70, y1: 90, x2: 165, y2: 80 },
                { x1: 80, y1: 180, x2: 175, y2: 170 },
                { x1: 50, y1: 220, x2: 180, y2: 200 },
                { x1: 90, y1: 260, x2: 185, y2: 230 },
              ].map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  style={{
                    animation: `flowRight 2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}

              {/* Right side - Report document */}
              <g transform="translate(280, 80)">
                {/* Document shape */}
                <rect
                  x="0"
                  y="0"
                  width="80"
                  height="110"
                  rx="4"
                  fill="#1a1b16"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                {/* Document header */}
                <rect x="10" y="10" width="60" height="8" rx="2" fill="#019B77" fillOpacity="0.3" />
                {/* Chart bars */}
                <rect x="10" y="28" width="15" height="30" rx="1" fill="#019B77" fillOpacity="0.6" />
                <rect x="30" y="38" width="15" height="20" rx="1" fill="#019B77" fillOpacity="0.4" />
                <rect x="50" y="33" width="15" height="25" rx="1" fill="#019B77" fillOpacity="0.5" />
                {/* Text lines */}
                <rect x="10" y="68" width="55" height="3" rx="1" fill="#FBFEF2" fillOpacity="0.2" />
                <rect x="10" y="76" width="45" height="3" rx="1" fill="#FBFEF2" fillOpacity="0.15" />
                <rect x="10" y="84" width="50" height="3" rx="1" fill="#FBFEF2" fillOpacity="0.1" />
                <rect x="10" y="92" width="35" height="3" rx="1" fill="#FBFEF2" fillOpacity="0.1" />

                {/* Glow effect on document */}
                <rect
                  x="-5"
                  y="-5"
                  width="90"
                  height="120"
                  rx="6"
                  fill="none"
                  stroke="#019B77"
                  strokeWidth="1"
                  strokeOpacity="0.2"
                  style={{ animation: 'docGlow 2s ease-in-out infinite' }}
                />
              </g>

              {/* Connecting lines from funnel to report */}
              <line
                x1="225"
                y1="150"
                x2="280"
                y2="135"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                style={{ animation: 'flowRight 1.5s ease-in-out infinite' }}
              />

              {/* Labels */}
              <text x="60" y="290" textAnchor="middle" fill="#B6B6B6" fontSize="9" fontFamily="monospace">
                Datos dispersos
              </text>
              <text x="200" y="290" textAnchor="middle" fill="#B6B6B6" fontSize="9" fontFamily="monospace">
                Procesamiento
              </text>
              <text x="320" y="290" textAnchor="middle" fill="#B6B6B6" fontSize="9" fontFamily="monospace">
                Reporte
              </text>
            </svg>

            {/* CSS Animations */}
            <style jsx>{`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.2); }
              }
              @keyframes ripple {
                0% { r: 4; opacity: 0.5; }
                100% { r: 20; opacity: 0; }
              }
              @keyframes dash {
                to { stroke-dashoffset: -20; }
              }
              @keyframes spin {
                to { transform: rotate(360deg); transform-origin: 40px 100px; }
              }
              @keyframes flowRight {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
              }
              @keyframes docGlow {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>

          {/* Right side - Content */}
          <div className="p-8 flex flex-col justify-center">
            {/* Issue number - Palantir style */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#019B77]/30" />
              <span className="text-[10px] tracking-[0.3em] text-[#019B77] font-mono uppercase">
                Demo Interactivo
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#019B77]/30" />
            </div>

            <h2 className="text-3xl font-bold text-[#FBFEF2] mb-3 tracking-tight">
              Descubre el poder
              <br />
              de tus datos →
            </h2>

            <p className="text-[#B6B6B6] mb-2 text-sm leading-relaxed">
              — Transforma datos de Instagram y Facebook en reportes profesionales con insights de IA.
            </p>

            <ul className="text-[#B6B6B6] text-sm space-y-2 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#019B77]" />
                Visualiza métricas clave al instante
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#019B77]" />
                Genera insights con inteligencia artificial
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#019B77]" />
                Exporta reportes profesionales en PDF
              </li>
            </ul>

            {/* CTA Button - Distinctive style */}
            <button
              onClick={handleDemoClick}
              disabled={isLoading}
              className="group relative w-full py-4 px-6 rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #019B77 0%, #017a5e 100%)',
                boxShadow: '0 0 30px rgba(1, 155, 119, 0.3)',
              }}
            >
              {/* Animated border */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                }}
              />

              <span className="relative flex items-center justify-center gap-3 text-[#FBFEF2] font-semibold text-lg">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Cargando demo...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Explorar Dashboard Demo
                  </>
                )}
              </span>

              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </button>

            <p className="text-center text-[#B6B6B6]/60 text-xs mt-4">
              Sin registro · Sin compromiso · Datos de ejemplo
            </p>

            {/* Footer - Palantir style */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[rgba(251,254,242,0.05)]">
              <span className="text-[10px] text-[#B6B6B6]/50 font-mono">DataPal</span>
              <span className="text-[10px] text-[#B6B6B6]/50 font-mono">Analytics + IA</span>
              <span className="text-[10px] text-[#B6B6B6]/50 font-mono">datapal.cl</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
