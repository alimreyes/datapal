import { Metadata } from 'next';

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
    'social media insights',
    'content analytics',
    'reportes redes sociales',
    'análisis instagram',
    'análisis facebook',
    'reportes automatizados marketing',
    'dashboard agencias marketing',
    'herramientas reporting agencias boutique',
    'alternativa looker studio agencias',
    'automatizar reportes freelancers',
    'KPIs marketing agencias LATAM',
    'métricas ROI agencias marketing',
    'dashboard económico marketing',
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
  verification: {
    google: 'your-google-verification-code', // Add when you have it
    // other: { 'msvalidate.01': 'your-bing-verification-code' }, // Bing Webmaster
  },
  alternates: {
    canonical: APP_URL,
  },
};

// Page-specific metadata generators
export const generateReportMetadata = (reportTitle: string, reportId: string): Metadata => ({
  title: reportTitle,
  description: `Reporte de análisis de redes sociales: ${reportTitle}`,
  openGraph: {
    title: reportTitle,
    description: `Reporte de análisis de redes sociales: ${reportTitle}`,
    url: `${APP_URL}/report/${reportId}`,
    type: 'article',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: reportTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: reportTitle,
    description: `Reporte de análisis de redes sociales: ${reportTitle}`,
    images: [`${APP_URL}/og-image.png`],
  },
});

export const dashboardMetadata: Metadata = {
  title: 'Dashboard',
  description: 'Gestiona tus reportes de redes sociales y analiza el desempeño de tu contenido.',
};

export const loginMetadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en DataPal para acceder a tus reportes automatizados de redes sociales.',
};

export const registerMetadata: Metadata = {
  title: 'Registrarse',
  description: 'Crea tu cuenta gratis en DataPal y comienza a generar reportes automatizados de Instagram, Facebook, LinkedIn, TikTok y Google Analytics.',
};

export const createReportMetadata: Metadata = {
  title: 'Crear Reporte',
  description: 'Crea un nuevo reporte automatizado de analytics para tus redes sociales.',
};

export const demoMetadata: Metadata = {
  title: '¿Qué tipos de reportes de redes sociales puedes crear con DataPal?',
  description: 'Explora los 3 tipos de reportes automatizados que DataPal genera para agencias boutique y freelancers: análisis de resultados, evidenciar mejoras y reporte mensual.',
};

export const landingMetadata: Metadata = {
  title: `${APP_NAME} - Reportes Automatizados de Redes Sociales para Agencias y Freelancers`,
  description: 'DataPal automatiza los reportes de Instagram, Facebook, LinkedIn, TikTok y Google Analytics para agencias boutique y freelancers de marketing en Latinoamérica. Genera reportes profesionales en minutos.',
  openGraph: {
    title: `${APP_NAME} - Reportes Automatizados de Redes Sociales para Agencias y Freelancers`,
    description: 'Automatiza tus reportes de redes sociales. Diseñado para agencias boutique y freelancers de marketing en LATAM.',
    url: APP_URL,
    type: 'website',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Analytics y Reportes para Agencias Boutique en LATAM`,
      },
    ],
  },
  alternates: {
    canonical: APP_URL,
  },
};
