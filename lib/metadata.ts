import { Metadata } from 'next';

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
    'social media insights',
    'content analytics',
    'reportes redes sociales',
    'análisis instagram',
    'análisis facebook',
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
  description: 'Inicia sesión en DataPal para acceder a tus reportes de redes sociales.',
};

export const registerMetadata: Metadata = {
  title: 'Registrarse',
  description: 'Crea tu cuenta en DataPal y comienza a analizar tus redes sociales.',
};

export const createReportMetadata: Metadata = {
  title: 'Crear Reporte',
  description: 'Crea un nuevo reporte de análisis para tus redes sociales.',
};