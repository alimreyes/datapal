'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle, BarChart3, Sparkles, DollarSign, Play, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#11120D]/80 backdrop-blur-md border-b border-[rgba(251,254,242,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/Logo_DataPal.png"
                alt="DataPal"
                width={36}
                height={36}
                className="object-contain invert"
              />
              <span className="text-xl font-bold text-[#FBFEF2] font-[var(--font-roboto-mono)] tracking-tight">
                DataPal
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/demo">
              <Button variant="ghost" size="sm" className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]">
                Demo
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]">
                Precios
              </Button>
            </Link>
            <Link href="/#faq">
              <Button variant="ghost" size="sm" className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]">
                FAQ
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-[#019B77]/50 text-[#019B77] hover:bg-[#019B77]/10">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">
                Empezar gratis
              </Button>
            </Link>
          </div>

          {/* Mobile: Auth buttons + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-[#019B77]/50 text-[#019B77] hover:bg-[#019B77]/10 text-xs px-3">
                Login
              </Button>
            </Link>
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
            {/* Sección principal */}
            <p className="text-[10px] uppercase tracking-widest text-[#B6B6B6]/50 px-3 pt-2 pb-1">
              Navegación
            </p>
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
              href="/#faq"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#019B77]" />
              <span className="text-sm">Preguntas frecuentes</span>
            </Link>

            {/* Plataformas */}
            <p className="text-[10px] uppercase tracking-widest text-[#B6B6B6]/50 px-3 pt-4 pb-1">
              Plataformas
            </p>
            <Link
              href="/plataformas/instagram"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <Instagram className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Instagram</span>
            </Link>
            <Link
              href="/plataformas/facebook"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Facebook</span>
            </Link>
            <Link
              href="/plataformas/linkedin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              <span className="text-sm">LinkedIn</span>
            </Link>
            <Link
              href="/plataformas/tiktok"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm">TikTok</span>
            </Link>
            <Link
              href="/plataformas/google-analytics"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16] transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Google Analytics</span>
            </Link>

            {/* CTA */}
            <div className="pt-4 border-t border-[rgba(251,254,242,0.1)] mt-2">
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]">
                  Empezar gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
