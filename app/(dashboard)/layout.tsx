'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/Logo_DataPal.png"
                  alt="DataPal"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-[var(--font-roboto-mono)]">
                  DataPal
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                MVP Beta
              </span>
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