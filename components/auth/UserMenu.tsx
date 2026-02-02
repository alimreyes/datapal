'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sparkles, CreditCard, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';

export default function UserMenu() {
  const { user, userData, loading, signOut, aiUsageRemaining, canUseAI } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#B6B6B6]/20 animate-pulse" />
    );
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#019B77] hover:bg-[#019B77]/90 text-[#11120D] font-semibold rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          Iniciar sesión
        </button>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          reason="required"
        />
      </>
    );
  }

  // Usuario autenticado
  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors"
      >
        {/* Avatar */}
        <div className="relative">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Usuario'}
              className="w-10 h-10 rounded-full border-2 border-[#019B77]/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#019B77] flex items-center justify-center text-[#11120D] font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}

          {/* AI Usage Badge */}
          {userData?.subscription === 'free' && (
            <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              aiUsageRemaining > 3
                ? 'bg-[#019B77] text-[#11120D]'
                : aiUsageRemaining > 0
                ? 'bg-yellow-500 text-black'
                : 'bg-red-500 text-white'
            }`}>
              {aiUsageRemaining}
            </div>
          )}
        </div>

        {/* Name & Plan (hidden on mobile) */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-[#FBFEF2] line-clamp-1">
            {user.displayName || 'Usuario'}
          </p>
          <p className="text-xs text-[#B6B6B6]">
            Plan {userData?.subscription === 'free' ? 'Gratis' : 'Pro'}
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-[#B6B6B6] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1b16] border border-[#B6B6B6]/20 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="p-4 border-b border-[#B6B6B6]/10">
            <p className="font-medium text-[#FBFEF2]">{user.displayName}</p>
            <p className="text-sm text-[#B6B6B6]">{user.email}</p>
          </div>

          {/* AI Usage Status */}
          {userData?.subscription === 'free' && (
            <div className="p-4 border-b border-[#B6B6B6]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#B6B6B6] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#019B77]" />
                  Consultas de IA
                </span>
                <span className={`text-sm font-medium ${
                  aiUsageRemaining > 3 ? 'text-[#019B77]' : aiUsageRemaining > 0 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {aiUsageRemaining}/10
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-[#B6B6B6]/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    aiUsageRemaining > 3 ? 'bg-[#019B77]' : aiUsageRemaining > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(aiUsageRemaining / 10) * 100}%` }}
                />
              </div>

              {aiUsageRemaining <= 3 && (
                <p className="mt-2 text-xs text-[#B6B6B6]">
                  {aiUsageRemaining === 0
                    ? 'Has alcanzado el límite mensual'
                    : `Te quedan ${aiUsageRemaining} consultas este mes`
                  }
                </p>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="p-2">
            {userData?.subscription === 'free' && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/pricing');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-[#FBFEF2] hover:bg-[#019B77]/10 rounded-lg transition-colors"
              >
                <CreditCard className="w-4 h-4 text-[#019B77]" />
                <span>Actualizar a Pro</span>
                <span className="ml-auto text-xs bg-[#019B77] text-[#11120D] px-2 py-0.5 rounded-full font-medium">
                  Ilimitado
                </span>
              </button>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push('/settings');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[#FBFEF2] hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-[#B6B6B6]" />
              <span>Configuración</span>
            </button>

            <div className="my-2 border-t border-[#B6B6B6]/10" />

            <button
              onClick={() => {
                setIsMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
