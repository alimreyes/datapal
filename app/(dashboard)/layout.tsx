'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Sparkles, Menu, X, HelpCircle, DollarSign, LayoutDashboard, FileText, BookOpen, Plug } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import DemoPopup from '@/components/demo/DemoPopup';
import DashboardFooter from '@/components/landing/DashboardFooter';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isDemo } = useAuth();
  const [showDemoPopup, setShowDemoPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] px-3 py-1.5 rounded-lg hover:bg-[#1a1b16] transition-colors cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </span>
              </Link>
              <Link href="/integrations">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] px-3 py-1.5 rounded-lg hover:bg-[#1a1b16] transition-colors cursor-pointer">
                  <Plug className="w-4 h-4" />
                  Integraciones
                </span>
              </Link>
              <Link href="/faq">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] px-3 py-1.5 rounded-lg hover:bg-[#1a1b16] transition-colors cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </span>
              </Link>
              <Link href="/pricing">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] px-3 py-1.5 rounded-lg hover:bg-[#1a1b16] transition-colors cursor-pointer">
                  <DollarSign className="w-4 h-4" />
                  Precios
                </span>
              </Link>
              <Link href="/blog">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] px-3 py-1.5 rounded-lg hover:bg-[#1a1b16] transition-colors cursor-pointer">
                  <BookOpen className="w-4 h-4" />
                  Blog
                </span>
              </Link>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
                MVP Beta
              </span>
              <UserMenu />
            </div>

            {/* Mobile: UserMenu + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#019B77]/20 text-[#019B77] border border-[#019B77]/30">
                Beta
              </span>
              <UserMenu />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
                aria-label="Menú"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="md:hidden bg-[#11120D] border-t border-[rgba(251,254,242,0.1)]">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link
                href="/integrations"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <Plug className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Integraciones</span>
              </Link>
              <Link
                href="/demo"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <Play className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Demo en vivo</span>
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <DollarSign className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Precios</span>
              </Link>
              <Link
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Blog</span>
              </Link>
              <Link
                href="/faq"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Preguntas frecuentes</span>
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#019B77]" />
                <span className="text-sm">Página principal</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <DashboardFooter isAuthenticated={!!user} />
    </div>
  );
}
