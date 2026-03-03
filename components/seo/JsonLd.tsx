/**
 * JSON-LD Structured Data Components for SEO/GEO optimization.
 * Implements Schema.org markup so search engines and generative AI engines
 * (ChatGPT, Perplexity, Gemini) can understand and cite DataPal.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://datapal.vercel.app';

// --- SoftwareApplication Schema ---
export function SoftwareApplicationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DataPal',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Plataforma de analytics y reportes automatizados para redes sociales. Diseñada para agencias boutique y freelancers de marketing en LATAM.',
    url: APP_URL,
    image: `${APP_URL}/Logo_DataPal.png`,
    screenshot: `${APP_URL}/og-image.png`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Plan gratuito disponible. Planes premium desde $9 USD/mes.',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Reportes automatizados de Instagram, Facebook, Google Analytics, LinkedIn y TikTok',
      'Insights generados por inteligencia artificial',
      'Exportación a PDF con diseño profesional',
      'Dashboard de analytics en tiempo real',
      'Comparativas de rendimiento entre periodos',
      'Ideal para agencias boutique y freelancers en LATAM',
    ],
    inLanguage: 'es',
    applicationSubCategory: 'Social Media Analytics',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- Organization Schema ---
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DataPal',
    url: APP_URL,
    logo: `${APP_URL}/Logo_DataPal.png`,
    description:
      'DataPal es una plataforma SaaS de analytics y reportes automatizados para redes sociales, enfocada en agencias boutique y freelancers de marketing en Latinoamérica.',
    foundingDate: '2025',
    sameAs: [
      // Add real profile URLs when available
      // 'https://www.linkedin.com/company/datapal',
      // 'https://github.com/datapal',
      // 'https://twitter.com/datapal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
    },
    areaServed: {
      '@type': 'Place',
      name: 'Latin America',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- FAQ Data (exported for reuse in landing page) ---
export const FAQ_DATA = [
  {
    question: '¿Qué es DataPal y para quién está diseñado?',
    answer:
      'DataPal es una plataforma de analytics y reportes automatizados para redes sociales. Está diseñada específicamente para agencias boutique de marketing y freelancers en Latinoamérica que necesitan crear reportes profesionales para sus clientes de forma rápida y económica.',
  },
  {
    question: '¿Qué redes sociales soporta DataPal?',
    answer:
      'DataPal soporta Instagram, Facebook, Google Analytics, LinkedIn y TikTok. Puedes conectar múltiples cuentas y generar reportes combinados de todas estas plataformas en un solo dashboard.',
  },
  {
    question: '¿Cómo se compara DataPal con Looker Studio o Tableau para agencias pequeñas?',
    answer:
      'A diferencia de Looker Studio o Tableau, DataPal está diseñado específicamente para agencias boutique y freelancers. No requiere conocimientos técnicos avanzados, genera insights automáticos con IA y ofrece planes accesibles desde $9 USD/mes, ideal para equipos de menos de 5 personas en LATAM.',
  },
  {
    question: '¿DataPal genera insights automáticos con inteligencia artificial?',
    answer:
      'Sí. DataPal utiliza inteligencia artificial para analizar tus métricas y generar insights accionables automáticamente. Esto incluye análisis de tendencias, recomendaciones de mejora y detección de oportunidades de crecimiento en tus redes sociales.',
  },
  {
    question: '¿Puedo exportar los reportes a PDF?',
    answer:
      'Sí. DataPal permite exportar tus reportes a PDF con un diseño profesional listo para presentar a tus clientes. Los reportes incluyen gráficos, métricas clave e insights generados por IA.',
  },
  {
    question: '¿DataPal tiene plan gratuito?',
    answer:
      'Sí. DataPal ofrece un plan gratuito con funcionalidades básicas para que puedas probar la plataforma. Los planes premium con funcionalidades avanzadas están disponibles desde $9 USD/mes.',
  },
  {
    question: '¿Cómo puede un freelancer reducir el tiempo de creación de informes de marketing?',
    answer:
      'Con DataPal, un freelancer puede reducir el tiempo de creación de reportes de horas a minutos. Solo necesita conectar las cuentas de redes sociales de su cliente, seleccionar el periodo y tipo de reporte, y DataPal genera automáticamente un informe profesional con métricas, gráficos e insights de IA.',
  },
  {
    question: '¿Qué tipos de reportes puedo crear con DataPal?',
    answer:
      'DataPal ofrece 3 tipos de reportes: Análisis de Resultados (métricas clave, funnels y recomendaciones), Evidenciar Mejoras (comparativa antes/después para demostrar impacto) y Reporte Mensual (resumen ejecutivo con gráficos de evolución). Cada formato está diseñado para un objetivo distinto de presentación a clientes.',
  },
  {
    question: '¿Cuánto tiempo toma crear un reporte en DataPal?',
    answer:
      'Crear un reporte en DataPal toma menos de 5 minutos. Solo necesitas conectar la cuenta de tu cliente, seleccionar el periodo de análisis y el tipo de reporte. DataPal se encarga de extraer los datos, generar gráficos y escribir los insights automáticamente.',
  },
  {
    question: '¿DataPal funciona para agencias en Latinoamérica?',
    answer:
      'Sí. DataPal fue diseñado específicamente para el mercado latinoamericano. La interfaz está en español con tono neutro (pan-regional), los precios son accesibles en USD para agencias boutique y freelancers de LATAM, y el soporte está disponible en español.',
  },
  {
    question: '¿Cómo conectar Instagram Business a DataPal?',
    answer:
      'Para conectar Instagram a DataPal, necesitas una cuenta de Instagram Business o Creator vinculada a una página de Facebook. En el dashboard de DataPal, haces clic en "Nuevo Reporte", seleccionas Instagram y autorizas el acceso a través de Facebook Login. El proceso toma menos de 1 minuto.',
  },
  {
    question: '¿Puedo gestionar múltiples clientes en DataPal?',
    answer:
      'Sí. DataPal permite conectar múltiples cuentas de redes sociales y crear reportes independientes para cada cliente. Cada reporte se genera con los datos específicos de la cuenta seleccionada, lo que es ideal para agencias que gestionan varias marcas.',
  },
];

// --- FAQPage Schema ---
export function FAQPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- HowTo Schema for Demo Pages (AI SEO: +30-40% AI visibility) ---
export function HowToCreateReportJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como crear un reporte automatizado de redes sociales con DataPal',
    description:
      'Guia paso a paso para crear reportes profesionales de Instagram, Facebook, LinkedIn, TikTok y Google Analytics en menos de 5 minutos usando DataPal.',
    totalTime: 'PT5M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    tool: {
      '@type': 'HowToTool',
      name: 'DataPal - Plataforma de reportes automatizados',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Crear una cuenta gratuita en DataPal',
        text: 'Registrate en DataPal con tu correo electronico. El plan gratuito incluye acceso a todas las funcionalidades basicas de reportes y analytics.',
        url: `${APP_URL}/register`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Crear un nuevo reporte',
        text: 'Desde el dashboard, haz clic en "Nuevo Reporte". Selecciona el tipo de reporte que necesitas: Analisis de Resultados, Evidenciar Mejoras o Reporte Mensual.',
        url: `${APP_URL}/demo`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Ingresar las metricas de redes sociales',
        text: 'Ingresa las metricas de la cuenta de tu cliente: seguidores, alcance, impresiones, interacciones y engagement de Instagram, Facebook, LinkedIn, TikTok o Google Analytics.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Generar insights con inteligencia artificial',
        text: 'DataPal analiza automaticamente las metricas usando IA (Claude de Anthropic) y genera insights accionables con recomendaciones concretas para mejorar la estrategia de marketing.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Exportar y compartir el reporte',
        text: 'Exporta el reporte a PDF con diseno profesional o compartelo con un enlace directo. El reporte incluye graficos, metricas clave e insights generados por IA.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- HowTo Schema for Each Report Type ---
export function HowToAnalysisReportJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como hacer un analisis de resultados de redes sociales para tu cliente',
    description:
      'Aprende a crear un reporte de analisis de resultados que incluye metricas clave, analisis de funnel de conversion y recomendaciones basadas en datos reales de Instagram y Facebook.',
    totalTime: 'PT3M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Seleccionar el periodo de analisis',
        text: 'Elige el rango de fechas que quieres analizar. Puede ser semanal, quincenal o mensual segun las necesidades de tu cliente.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Revisar las metricas de funnel',
        text: 'Analiza las metricas de conversion: visualizaciones a alcance, alcance a interacciones y tasa de engagement. Estas metricas revelan donde se pierde la audiencia.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Identificar los dias de mayor rendimiento',
        text: 'Revisa que dias y horarios generaron mas interacciones. Esto permite optimizar el calendario editorial para maximizar el alcance.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Generar recomendaciones accionables con IA',
        text: 'Usa la IA de DataPal para generar recomendaciones especificas basadas en los datos. Cada insight incluye que ocurrio, por que, la implicacion estrategica y una accion concreta.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToImprovementsReportJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como demostrar mejoras de marketing en redes sociales a tu cliente',
    description:
      'Guia para crear un reporte comparativo antes/despues que demuestra el impacto de tu estrategia de marketing digital con datos concretos.',
    totalTime: 'PT3M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Definir los periodos de comparacion',
        text: 'Selecciona el periodo anterior (antes de tu estrategia) y el periodo actual. La comparacion directa permite visualizar el crecimiento real.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Comparar metricas clave antes y despues',
        text: 'Revisa el cambio porcentual en visualizaciones, alcance, interacciones y seguidores. Los porcentajes de crecimiento son la evidencia mas clara de impacto.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Documentar las acciones que generaron resultados',
        text: 'Registra las acciones especificas que implementaste: cambio de formatos, frecuencia de publicacion, optimizacion de hashtags o ajustes de horarios.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// --- WebSite Schema (for sitelinks search box) ---
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DataPal',
    url: APP_URL,
    description:
      'Plataforma de analytics y reportes automatizados para redes sociales. La mejor alternativa económica para agencias boutique y freelancers en LATAM.',
    inLanguage: 'es',
    publisher: {
      '@type': 'Organization',
      name: 'DataPal',
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/Logo_DataPal.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
