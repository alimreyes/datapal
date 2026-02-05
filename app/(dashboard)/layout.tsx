'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Sparkles } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import DemoPopup from '@/components/demo/DemoPopup';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isDemo } = useAuth();
  const [showDemoPopup, setShowDemoPopup] = useState(false);

  // Mostrar popup automáticamente para usuarios no autenticados después de 1.5s
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        // Solo mostrar si no se ha mostrado antes en esta sesión
        const hasSeenPopup = sessionStorage.getItem('datapal_demo_popup_seen');
        if (!hasSeenPopup) {
          setShowDemoPopup(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowDemoPopup(false);
    sessionStorage.setItem('datapal_demo_popup_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-[#11120D]">
      {/* Demo Popup */}
      <DemoPopup isOpen={showDemoPopup} onClose={handleClosePopup} />

      {/* Demo Banner - Link to /demo for non-authenticated users */}
      {!user && (
        <Link
          href="/demo"
          className="block w-full bg-gradient-to-r from-[#019B77] to-[#02c494] text-[#FBFEF2] py-2 px-4 hover:from-[#02c494] hover:to-[#019B77] transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">¿Primera vez aquí?</span>
            <span className="inline-flex items-center gap-1 font-bold underline underline-offset-2">
              <Play className="h-3 w-3" />
              Mira un reporte de prueba
            </span>
            <span className="hidden sm:inline">— Sin registro, sin compromiso</span>
          </div>
        </Link>
      )}

      {/* Demo Mode Indicator - Para usuarios demo */}
      {isDemo && (
        <div className="bg-gradient-to-r from-[#019B77]/90 to-[#02c494]/90 text-[#FBFEF2] py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Modo Demo</span>
            <span className="hidden sm:inline">— Estás viendo datos de ejemplo</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-[#11120D] border-b border-[rgba(251,254,242,0.1)] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <Image
                  src="/Logo_DataPal.png"
                  alt="DataPal"
                  width={40}
                  height={40}
                  className="object-contain invert"
                />
                <span className="text-xl font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] tracking-tight group-hover:text-[#019B77] transition-colors">
                  DataPal
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
                MVP Beta
              </span>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
