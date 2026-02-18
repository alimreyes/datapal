import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  SoftwareApplicationJsonLd,
  OrganizationJsonLd,
  FAQPageJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd";

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

const APP_NAME = 'DataPal';
const APP_DESCRIPTION = 'Plataforma de analytics y reportes automatizados para redes sociales. Diseñada para agencias boutique y freelancers de marketing en LATAM. Conecta Instagram, Facebook, Google Analytics, LinkedIn y TikTok.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Reportes Automatizados de Redes Sociales para Agencias y Freelancers`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'social media analytics',
    'instagram analytics',
    'facebook analytics',
    'google analytics dashboard',
    'linkedin analytics',
    'tiktok analytics',
    'social media reports',
    'engagement rate',
    'analytics dashboard',
    'reportes redes sociales',
    'análisis instagram',
    'análisis facebook',
    'reportes automatizados marketing',
    'dashboard agencias marketing',
    'herramientas reporting agencias boutique',
    'alternativa looker studio agencias',
    'automatizar reportes freelancers',
    'KPIs marketing agencias LATAM',
    'social media insights',
  ],
  authors: [{ name: 'DataPal Team' }],
  creator: 'DataPal',
  publisher: 'DataPal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} - Reportes Automatizados de Redes Sociales para Agencias y Freelancers`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Analytics y Reportes para Agencias Boutique en LATAM`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Reportes Automatizados de Redes Sociales`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: '@datapal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: '63uqCNzpTR16TGbS-KNcJ1Xx3Re2eOxwYwmGUtOi7jk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <SoftwareApplicationJsonLd />
        <OrganizationJsonLd />
        <FAQPageJsonLd />
        <WebSiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}