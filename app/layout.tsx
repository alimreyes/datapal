import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// ⭐ NUEVO: Importar metadata profesional
const APP_NAME = 'DataPal';
const APP_DESCRIPTION = 'Analiza el desempeño de tus redes sociales con reportes profesionales. Instagram y Facebook analytics con visualizaciones avanzadas, insights automáticos y exportación PDF.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Social Media Analytics & Reports`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'social media analytics',
    'instagram analytics',
    'facebook analytics',
    'social media reports',
    'engagement rate',
    'analytics dashboard',
    'reportes redes sociales',
  ],
  authors: [{ name: 'DataPal Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Social Media Analytics & Reports`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Social Media Analytics`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Social Media Analytics & Reports`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} antialiased`}
      >
        {/* ⭐ NUEVO: Envolver con ErrorBoundary para capturar errores */}
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}