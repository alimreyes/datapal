'use client';

import { useState, useRef } from 'react';
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
  ExternalLink,
  Palette,
  Upload,
  X,
  Save,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { uploadClientLogo } from '@/lib/cloudinary/upload';
import { DEFAULT_BRANDING, DEFAULT_MONITORING, type BrandingConfig, type MonitoringPreferences, type Report } from '@/lib/types';
import { getDeletedReports, restoreReport, permanentDeleteReport } from '@/lib/firebase/firestore';

// ==================== COMPONENTE PAPELERA ====================
function TrashSection({ userId }: { userId: string }) {
  const [deletedReports, setDeletedReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadTrash = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { data } = await getDeletedReports(userId);
      if (data) {
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        // Auto-eliminar permanentemente los que superan 7 días
        const toDelete = (data as Report[]).filter(r => {
          const deletedAt = (r.deletedAt as any)?.toDate?.()?.getTime?.() || 0;
          return deletedAt && now - deletedAt > sevenDaysMs;
        });
        await Promise.all(toDelete.map(r => permanentDeleteReport(r.id)));

        // Conservar solo los activos en papelera
        const active = (data as Report[]).filter(r => {
          const deletedAt = (r.deletedAt as any)?.toDate?.()?.getTime?.() || 0;
          return deletedAt && now - deletedAt <= sevenDaysMs;
        });
        setDeletedReports(active);
      }
    } catch (e) {
      console.error('Error cargando papelera:', e);
    }
    setIsLoading(false);
    setIsLoaded(true);
  };

  const handleRestore = async (reportId: string) => {
    setActionLoading(reportId + '-restore');
    await restoreReport(reportId);
    setDeletedReports(prev => prev.filter(r => r.id !== reportId));
    setActionLoading(null);
  };

  const handlePermanentDelete = async (reportId: string, title: string) => {
    if (!confirm(`¿Eliminar permanentemente "${title}"? Esta acción no se puede deshacer.`)) return;
    setActionLoading(reportId + '-delete');
    await permanentDeleteReport(reportId);
    setDeletedReports(prev => prev.filter(r => r.id !== reportId));
    setActionLoading(null);
  };

  return (
    <section id="papelera" className="mb-8 scroll-mt-8">
      <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
        <Trash2 className="w-5 h-5 text-[#019B77]" />
        Papelera
      </h2>
      <div className="bg-[#1a1b16] border border-[rgba(251,254,242,0.1)] rounded-xl p-6">
        <p className="text-sm text-[#B6B6B6] mb-4">
          Los reportes eliminados se conservan aquí durante <strong className="text-[#FBFEF2]">7 días</strong> antes de ser borrados permanentemente. Puedes recuperarlos o eliminarlos antes de ese plazo.
        </p>

        {!isLoaded ? (
          <button
            onClick={loadTrash}
            className="text-sm px-4 py-2 bg-[#019B77]/20 text-[#019B77] rounded-lg hover:bg-[#019B77]/30 transition-colors"
          >
            Ver reportes eliminados
          </button>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#B6B6B6]">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#019B77] border-t-transparent" />
            Cargando papelera...
          </div>
        ) : deletedReports.length === 0 ? (
          <p className="text-sm text-[#B6B6B6] italic">La papelera está vacía.</p>
        ) : (
          <div className="space-y-3">
            {deletedReports.map((report) => {
              const deletedAtMs = (report.deletedAt as any)?.toDate?.()?.getTime?.() || 0;
              const daysRemaining = Math.max(0, 7 - Math.floor((Date.now() - deletedAtMs) / (24 * 60 * 60 * 1000)));
              const deletedAtDate = deletedAtMs ? new Date(deletedAtMs).toLocaleDateString('es-CL') : '—';

              return (
                <div key={report.id} className="flex items-center justify-between p-3 bg-[#11120D] rounded-lg border border-[rgba(251,254,242,0.1)]">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-sm font-medium text-[#FBFEF2] truncate">{report.title}</p>
                    <p className="text-xs text-[#B6B6B6]">
                      Eliminado el {deletedAtDate} · <span className={daysRemaining <= 1 ? 'text-red-400' : 'text-yellow-400'}>{daysRemaining} día(s) restante(s)</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRestore(report.id)}
                      disabled={actionLoading === report.id + '-restore'}
                      className="text-xs px-3 py-1.5 bg-[#019B77]/20 text-[#019B77] rounded-lg hover:bg-[#019B77]/30 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === report.id + '-restore' ? 'Recuperando...' : 'Recuperar'}
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(report.id, report.title)}
                      disabled={actionLoading === report.id + '-delete'}
                      className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === report.id + '-delete' ? 'Eliminando...' : 'Eliminar definitivamente'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const { user, userData, signOut, updateBranding, updateMonitoring } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  // Branding state
  const [brandingForm, setBrandingForm] = useState<BrandingConfig>(
    userData?.branding || { ...DEFAULT_BRANDING }
  );
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [brandingSaved, setBrandingSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Monitoring state
  const [monitoringForm, setMonitoringForm] = useState<MonitoringPreferences>(
    userData?.monitoring || { ...DEFAULT_MONITORING }
  );
  const [isSavingMonitoring, setIsSavingMonitoring] = useState(false);
  const [monitoringSaved, setMonitoringSaved] = useState(false);

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

      {/* Brand Customization Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#019B77]" />
          Personalización de Marca
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <p className="text-sm text-[#B6B6B6] mb-6">
            Personaliza los reportes PDF con tu propia marca. El logo, nombre y colores se aplicarán al exportar.
          </p>

          {/* Company Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
              <Building2 className="w-4 h-4 inline mr-1.5 text-[#019B77]" />
              Nombre de la empresa
            </label>
            <input
              type="text"
              value={brandingForm.companyName}
              onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
              placeholder="DataPal"
              className="w-full px-4 py-2.5 bg-[#11120D] border border-[#B6B6B6]/20 rounded-lg text-[#FBFEF2] placeholder-[#B6B6B6]/50 focus:outline-none focus:border-[#019B77] transition-colors"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
                Color principal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingForm.brandColor}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brandColor: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-[#B6B6B6]/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={brandingForm.brandColor}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setBrandingForm({ ...brandingForm, brandColor: val });
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#11120D] border border-[#B6B6B6]/20 rounded-lg text-[#FBFEF2] font-mono text-sm focus:outline-none focus:border-[#019B77] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
                Color secundario
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brandingForm.brandColorSecondary}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brandColorSecondary: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-[#B6B6B6]/20 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={brandingForm.brandColorSecondary}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                      setBrandingForm({ ...brandingForm, brandColorSecondary: val });
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#11120D] border border-[#B6B6B6]/20 rounded-lg text-[#FBFEF2] font-mono text-sm focus:outline-none focus:border-[#019B77] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#FBFEF2] mb-2">
              Logo de la empresa
            </label>
            <div className="flex items-center gap-4">
              {brandingForm.companyLogoUrl ? (
                <div className="relative w-16 h-16 rounded-lg border border-[#B6B6B6]/20 overflow-hidden bg-[#11120D] flex items-center justify-center">
                  <Image
                    src={brandingForm.companyLogoUrl}
                    alt="Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                  <button
                    onClick={() => setBrandingForm({ ...brandingForm, companyLogoUrl: null })}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-[#B6B6B6]/30 flex items-center justify-center bg-[#11120D]">
                  <Building2 className="w-6 h-6 text-[#B6B6B6]/50" />
                </div>
              )}
              <div>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-[#11120D] border border-[#B6B6B6]/20 rounded-lg text-sm text-[#FBFEF2] hover:border-[#019B77] transition-colors disabled:opacity-50"
                >
                  {isUploadingLogo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#019B77] border-t-transparent" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Subir logo
                    </>
                  )}
                </button>
                <p className="text-xs text-[#B6B6B6] mt-1">PNG, JPG o SVG. Máx 2MB.</p>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    alert('El archivo es muy grande. Máximo 2MB.');
                    return;
                  }
                  setIsUploadingLogo(true);
                  const { url, error } = await uploadClientLogo(file, 'branding');
                  if (url) {
                    setBrandingForm({ ...brandingForm, companyLogoUrl: url });
                  } else {
                    alert(error || 'Error al subir logo');
                  }
                  setIsUploadingLogo(false);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 rounded-lg border border-[#B6B6B6]/10 bg-[#11120D]">
            <p className="text-xs text-[#B6B6B6] mb-3 uppercase tracking-wider">Vista previa del header del PDF</p>
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#11120D', border: `2px solid ${brandingForm.brandColor}` }}>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {brandingForm.companyLogoUrl ? (
                    <Image src={brandingForm.companyLogoUrl} alt="Logo" width={24} height={24} className="object-contain" />
                  ) : (
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: brandingForm.brandColor + '33' }}>
                      <Building2 className="w-6 h-6 p-0.5" style={{ color: brandingForm.brandColor }} />
                    </div>
                  )}
                  <span className="text-sm font-bold" style={{ color: brandingForm.brandColor }}>
                    {brandingForm.companyName || 'DataPal'}
                  </span>
                </div>
                <span className="text-xs text-[#B6B6B6]">Hoja 1 de 2</span>
              </div>
              <div className="h-0.5" style={{ backgroundColor: brandingForm.brandColor }} />
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[#FBFEF2]">Mi Reporte de Ejemplo</span>
                <span className="text-[10px] text-[#B6B6B6]">{new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Save / Reset buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsSavingBranding(true);
                const success = await updateBranding(brandingForm);
                setIsSavingBranding(false);
                if (success) {
                  setBrandingSaved(true);
                  setTimeout(() => setBrandingSaved(false), 2500);
                } else {
                  alert('Error al guardar la configuración de marca');
                }
              }}
              disabled={isSavingBranding}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#019B77] hover:bg-[#02c494] text-[#11120D] font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSavingBranding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#11120D] border-t-transparent" />
              ) : brandingSaved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {brandingSaved ? '¡Guardado!' : 'Guardar marca'}
            </button>
            <button
              onClick={() => setBrandingForm({ ...DEFAULT_BRANDING })}
              className="px-4 py-2.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] border border-[#B6B6B6]/20 rounded-lg transition-colors"
            >
              Restaurar valores predeterminados
            </button>
          </div>
        </div>
      </section>

      {/* Monitoring Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#FBFEF2] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#019B77]" />
          Monitoreo Inteligente
        </h2>
        <div className="bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl p-6">
          <p className="text-sm text-[#B6B6B6] mb-6">
            DataPal analiza tus reportes y te avisa cuando detecta caídas o crecimientos significativos en tus métricas.
          </p>

          {/* Enable toggle */}
          <label className="flex items-center justify-between p-4 bg-[#11120D] rounded-lg border border-[#B6B6B6]/10 mb-5 cursor-pointer">
            <div>
              <span className="text-sm font-medium text-[#FBFEF2]">Activar monitoreo</span>
              <p className="text-xs text-[#B6B6B6] mt-0.5">Muestra alertas en el dashboard cuando hay cambios importantes</p>
            </div>
            <input
              type="checkbox"
              checked={monitoringForm.enabled}
              onChange={(e) => setMonitoringForm({ ...monitoringForm, enabled: e.target.checked })}
              className="w-5 h-5 rounded bg-[#11120D] border-[#B6B6B6]/30 text-[#019B77] focus:ring-[#019B77] focus:ring-offset-0"
            />
          </label>

          {monitoringForm.enabled && (
            <>
              <h4 className="text-sm font-medium text-[#FBFEF2] mb-3">Umbrales de alerta (%)</h4>
              <p className="text-xs text-[#B6B6B6] mb-4">
                Define el porcentaje mínimo de cambio para recibir una alerta. Valores más bajos = más alertas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { key: 'reachDrop' as const, label: 'Caída de alcance', icon: '📉' },
                  { key: 'impressionsDrop' as const, label: 'Caída de impresiones', icon: '📉' },
                  { key: 'interactionsDrop' as const, label: 'Caída de interacciones', icon: '📉' },
                  { key: 'followersDrop' as const, label: 'Caída de seguidores', icon: '📉' },
                  { key: 'significantGrowth' as const, label: 'Crecimiento notable', icon: '📈' },
                ].map(({ key, label, icon }) => (
                  <div key={key}>
                    <label className="block text-xs text-[#B6B6B6] mb-1.5">
                      {icon} {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={monitoringForm.thresholds[key]}
                        onChange={(e) =>
                          setMonitoringForm({
                            ...monitoringForm,
                            thresholds: {
                              ...monitoringForm.thresholds,
                              [key]: parseInt(e.target.value),
                            },
                          })
                        }
                        className="flex-1 accent-[#019B77]"
                      />
                      <span className="text-sm font-mono text-[#FBFEF2] w-10 text-right">
                        {monitoringForm.thresholds[key]}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsSavingMonitoring(true);
                const success = await updateMonitoring(monitoringForm);
                setIsSavingMonitoring(false);
                if (success) {
                  setMonitoringSaved(true);
                  setTimeout(() => setMonitoringSaved(false), 2500);
                } else {
                  alert('Error al guardar configuración de monitoreo');
                }
              }}
              disabled={isSavingMonitoring}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#019B77] hover:bg-[#02c494] text-[#11120D] font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isSavingMonitoring ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#11120D] border-t-transparent" />
              ) : monitoringSaved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {monitoringSaved ? '¡Guardado!' : 'Guardar monitoreo'}
            </button>
            <button
              onClick={() => setMonitoringForm({ ...DEFAULT_MONITORING })}
              className="px-4 py-2.5 text-sm text-[#B6B6B6] hover:text-[#FBFEF2] border border-[#B6B6B6]/20 rounded-lg transition-colors"
            >
              Restaurar valores predeterminados
            </button>
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

      {/* Papelera */}
      <TrashSection userId={user?.uid || ''} />

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
