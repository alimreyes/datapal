'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { auth as firebaseAuth } from '@/lib/firebase/config';
import { Loader2, Sparkles, FileText, BarChart3, CheckCircle2 } from 'lucide-react';
import AccessCodeInput from '@/components/auth/AccessCodeInput';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginGoogle, loading } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redimir código de acceso pendiente después del registro
  const redeemPendingCode = async (userId: string) => {
    const pendingCode = sessionStorage.getItem('pendingAccessCode');
    if (!pendingCode) return;
    sessionStorage.removeItem('pendingAccessCode');
    try {
      await fetch('/api/access-code/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pendingCode, userId }),
      });
    } catch {
      // No bloquear el registro si falla la redención
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    const { success, error } = await register(
      formData.email,
      formData.password,
      formData.displayName
    );

    if (!success) {
      setError(error || 'Error al crear la cuenta');
      setIsLoading(false);
      return;
    }

    if (firebaseAuth.currentUser) {
      await redeemPendingCode(firebaseAuth.currentUser.uid);
    }
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    const { success, error } = await loginGoogle();

    if (!success) {
      setError(error || 'Error al registrarse con Google');
      setIsLoading(false);
      return;
    }

    if (firebaseAuth.currentUser) {
      await redeemPendingCode(firebaseAuth.currentUser.uid);
    }
    router.push('/dashboard');
  };

  const benefits = [
    { icon: Sparkles, text: '10 consultas de IA gratis al mes' },
    { icon: FileText, text: 'Reportes ilimitados' },
    { icon: BarChart3, text: 'Análisis detallados' },
    { icon: CheckCircle2, text: 'Exportación a PDF' },
  ];

  return (
    <div className="bg-[#1a1b16] rounded-2xl border border-[rgba(251,254,242,0.1)] overflow-hidden shadow-2xl">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#FBFEF2] mb-2">
            Crear cuenta en DataPal
          </h1>
          <p className="text-[#B6B6B6]">
            Comienza a crear reportes profesionales en minutos
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-8 space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-[#FBFEF2]/80">
              <div className="w-8 h-8 bg-[#019B77]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-4 h-4 text-[#019B77]" />
              </div>
              <span className="text-sm">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Google Sign Up - Primary */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FBFEF2] hover:bg-[#FBFEF2]/90 text-[#11120D] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mb-6"
        >
          {isLoading || loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Registrarse con Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[rgba(251,254,242,0.1)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1b16] px-3 text-[#B6B6B6]">O con email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium text-[#FBFEF2]">
              Nombre completo
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#11120D] border border-[rgba(251,254,242,0.15)] rounded-xl text-[#FBFEF2] placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#FBFEF2]">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#11120D] border border-[rgba(251,254,242,0.15)] rounded-xl text-[#FBFEF2] placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[#FBFEF2]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              minLength={6}
              className="w-full px-4 py-3 bg-[#11120D] border border-[rgba(251,254,242,0.15)] rounded-xl text-[#FBFEF2] placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-[#B6B6B6]/60">Mínimo 6 caracteres</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#FBFEF2]">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-[#11120D] border border-[rgba(251,254,242,0.15)] rounded-xl text-[#FBFEF2] placeholder:text-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] focus:ring-1 focus:ring-[#019B77] transition-colors disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2] font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || loading}
          >
            {isLoading || loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* Access Code */}
        <div className="mt-6 pt-6 border-t border-[rgba(251,254,242,0.05)]">
          <AccessCodeInput />
        </div>

        {/* Terms */}
        <p className="mt-4 text-xs text-center text-[#B6B6B6]/60">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="/terms" className="text-[#019B77] hover:underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-[#019B77] hover:underline">
            Política de Privacidad
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[#B6B6B6]">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-[#019B77] hover:text-[#02c494] hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
