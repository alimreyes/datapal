'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LandingRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Mientras Firebase verifica el estado de auth, mostramos un overlay opaco
  // para evitar que el usuario vea la landing si ya está logueado
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-[#11120D] flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#019B77] border-t-transparent" />
          <p className="text-[#B6B6B6] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Sin usuario → landing visible normalmente para visitantes
  return null;
}
