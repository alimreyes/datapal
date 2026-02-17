'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#11120D] p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
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

      <div className="w-full max-w-md">
        {children}
      </div>

      {/* Footer link back */}
      <p className="mt-8 text-xs text-[#B6B6B6]">
        <Link href="/" className="hover:text-[#019B77] transition-colors">
          ← Volver a la página principal
        </Link>
      </p>
    </div>
  );
}
