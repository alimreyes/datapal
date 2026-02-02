'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Shield,
  Bell,
  CreditCard,
  Trash2,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, userData, signOut } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  if (!user) {
    router.push('/dashboard');
    return null;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPro = userData?.subscription === 'pro' || userData?.subscription === 'enterprise';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FBFEF2] mb-2">Configuración</h1>
        <p className="text-[#B6B6B6]">Administra tu cuenta y preferencias</p>
      </div>

      {/* Profile Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#019B77]" />
          Perfil
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Usuario'}
                className="w-16 h-16 rounded-full border-2 border-[#019B77]/50"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#019B77] flex items-center justify-center text-[#11120D] text-2xl font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-[#FBFEF2]">{user.displayName || 'Usuario'}</h3>
              <p className="text-[#B6B6B6] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between py-3 border-t border-[#B6B6B6]/10">
              <div>
                <p className="text-[#FBFEF2] font-medium">Nombre</p>
                <p className="text-sm text-[#B6B6B6]">{user.displayName || 'No especificado'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#B6B6B6]/10">
              <div>
                <p className="text-[#FBFEF2] font-medium">Correo electrónico</p>
                <p className="text-sm text-[#B6B6B6]">{user.email}</p>
              </div>
              <span className="text-xs bg-[#019B77]/20 text-[#019B77] px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verificado
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#B6B6B6]/10">
              <div>
                <p className="text-[#FBFEF2] font-medium">Método de inicio de sesión</p>
                <p className="text-sm text-[#B6B6B6]">Google</p>
              </div>
              <Shield className="w-5 h-5 text-[#019B77]" />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#019B77]" />
          Suscripción
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPro ? 'bg-[#019B77]/20' : 'bg-[#B6B6B6]/20'
              }`}>
                <Sparkles className={`w-6 h-6 ${isPro ? 'text-[#019B77]' : 'text-[#B6B6B6]'}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#FBFEF2]">
                  Plan {isPro ? (userData?.subscription === 'enterprise' ? 'Enterprise' : 'Pro') : 'Gratuito'}
                </h3>
                <p className="text-sm text-[#B6B6B6]">
                  {isPro ? 'Consultas ilimitadas' : '10 consultas de IA por mes'}
                </p>
              </div>
            </div>
            {isPro ? (
              <span className="text-xs bg-[#019B77] text-[#11120D] px-3 py-1 rounded-full font-medium">
                Activo
              </span>
            ) : (
              <Link
                href="/pricing"
                className="text-sm bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Actualizar
              </Link>
            )}
          </div>

          {/* Usage Stats */}
          {!isPro && (
            <div className="bg-[#11120D] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#B6B6B6]">Uso este mes</span>
                <span className="text-sm font-medium text-[#FBFEF2]">
                  {userData?.aiUsageCount || 0}/10 consultas
                </span>
              </div>
              <div className="h-2 bg-[#B6B6B6]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#019B77] transition-all duration-300"
                  style={{ width: `${((userData?.aiUsageCount || 0) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid gap-3 text-sm">
            {userData?.subscriptionStartDate && (
              <div className="flex items-center justify-between py-2 border-t border-[#B6B6B6]/10">
                <span className="text-[#B6B6B6] flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de inicio
                </span>
                <span className="text-[#FBFEF2]">{formatDate(userData.subscriptionStartDate)}</span>
              </div>
            )}
            {userData?.subscriptionPaymentId && (
              <div className="flex items-center justify-between py-2 border-t border-[#B6B6B6]/10">
                <span className="text-[#B6B6B6]">ID de pago</span>
                <span className="text-[#FBFEF2] font-mono text-xs">
                  {userData.subscriptionPaymentId.slice(0, 20)}...
                </span>
              </div>
            )}
          </div>

          {isPro && (
            <div className="mt-4 pt-4 border-t border-[#B6B6B6]/10">
              <a
                href="https://www.paypal.com/myaccount/autopay/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#019B77] hover:text-[#019B77]/80 flex items-center gap-1"
              >
                Administrar suscripción en PayPal
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#019B77]" />
          Notificaciones
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-[#FBFEF2] font-medium">Notificaciones por email</p>
                <p className="text-sm text-[#B6B6B6]">Recibe actualizaciones importantes sobre tu cuenta</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="w-5 h-5 rounded bg-[#11120D] border-[#B6B6B6]/30 text-[#019B77] focus:ring-[#019B77] focus:ring-offset-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-[#B6B6B6]/10 pt-4">
              <div>
                <p className="text-[#FBFEF2] font-medium">Novedades y mejoras</p>
                <p className="text-sm text-[#B6B6B6]">Entérate de nuevas funcionalidades</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.updates}
                onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
                className="w-5 h-5 rounded bg-[#11120D] border-[#B6B6B6]/30 text-[#019B77] focus:ring-[#019B77] focus:ring-offset-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-[#B6B6B6]/10 pt-4">
              <div>
                <p className="text-[#FBFEF2] font-medium">Correos de marketing</p>
                <p className="text-sm text-[#B6B6B6]">Ofertas especiales y promociones</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                className="w-5 h-5 rounded bg-[#11120D] border-[#B6B6B6]/30 text-[#019B77] focus:ring-[#019B77] focus:ring-offset-0"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#019B77]" />
          Seguridad
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <div className="flex items-center gap-4 p-4 bg-[#019B77]/10 border border-[#019B77]/30 rounded-lg mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#019B77]" />
            <div>
              <p className="text-[#FBFEF2] font-medium">Tu cuenta está protegida</p>
              <p className="text-sm text-[#B6B6B6]">
                Inicio de sesión con Google + autenticación de dos factores
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2">
              <span className="text-[#B6B6B6]">Proveedor de autenticación</span>
              <span className="text-[#FBFEF2]">Google</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-[#B6B6B6]/10">
              <span className="text-[#B6B6B6]">Último acceso</span>
              <span className="text-[#FBFEF2]">{formatDate(user.metadata?.lastSignInTime)}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-[#B6B6B6]/10">
              <span className="text-[#B6B6B6]">Cuenta creada</span>
              <span className="text-[#FBFEF2]">{formatDate(user.metadata?.creationTime)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Zona de peligro
        </h2>
        <div className="bg-[#1a1b16] border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#FBFEF2] font-medium">Cerrar sesión</p>
              <p className="text-sm text-[#B6B6B6]">Salir de tu cuenta en este dispositivo</p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FBFEF2] font-medium">Eliminar cuenta</p>
                <p className="text-sm text-[#B6B6B6]">Eliminar permanentemente tu cuenta y todos tus datos</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#FBFEF2]">¿Eliminar cuenta?</h3>
                <p className="text-sm text-[#B6B6B6]">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-[#B6B6B6] mb-6">
              Se eliminarán permanentemente todos tus datos, incluyendo tu historial de consultas y suscripción.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-[#B6B6B6]/10 hover:bg-[#B6B6B6]/20 text-[#FBFEF2] rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // TODO: Implement account deletion
                  alert('Para eliminar tu cuenta, contacta a soporte@datapal.app');
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
