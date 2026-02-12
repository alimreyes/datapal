'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingNav() {
  return (
    <nav className="bg-[#11120D]/80 backdrop-blur-md border-b border-[rgba(251,254,242,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
          <div className="flex items-center gap-3">
            <Link href="/demo" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]">
                Demo
              </Button>
            </Link>
            <Link href="/pricing" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-[#B6B6B6] hover:text-[#FBFEF2] hover:bg-[#1a1b16]">
                Precios
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
        </div>
      </div>
    </nav>
  );
}
