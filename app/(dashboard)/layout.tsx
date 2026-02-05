'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Play, Sparkles } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isDemo, loginDemo } = useAuth();

  const handleDemoClick = async () => {
    if (!user) {
      // Si no está logueado, hacer login demo
      const { success } = await loginDemo();
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#11120D]">
      {/* Demo Banner - Solo para usuarios no autenticados */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">¿Primera vez aquí?</span>
            <button
              onClick={handleDemoClick}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:no-underline"
            >
              <Play className="h-3 w-3" />
              Mira un reporte de prueba
            </button>
            <span className="hidden sm:inline">— Sin registro, sin compromiso</span>
          </div>
        </div>
      )}

      {/* Demo Mode Indicator - Para usuarios demo */}
      {isDemo && (
        <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-black py-1.5 px-4">
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
