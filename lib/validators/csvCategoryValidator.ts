import type { CSVCategory } from '@/lib/types';

// Palabras clave para identificar la categoría de un CSV exportado desde Meta/Instagram
const CATEGORY_KEYWORDS: Record<CSVCategory, string[]> = {
  reach: ['alcance', 'reach', 'accounts reached', 'cuentas alcanzadas'],
  impressions: ['visualizaciones', 'impressions', 'impresiones'],
  interactions: ['interacciones', 'interactions', 'post interactions', 'interacciones con publicaciones'],
  followers: ['seguidores', 'followers', 'lifetime', 'nuevos seguidores', 'new followers'],
  visits: ['visitas', 'profile visits', 'page views', 'visitas al perfil', 'visitas a la pagina'],
  content: ['identificador de la publicacion', 'post id', 'tipo de publicacion', 'post type', 'permalink'],
};

const CATEGORY_LABELS: Record<CSVCategory, string> = {
  reach: 'Alcance',
  impressions: 'Visualizaciones',
  interactions: 'Interacciones',
  followers: 'Seguidores',
  visits: 'Visitas',
  content: 'Contenido',
};

export interface CSVValidationResult {
  isCorrectCategory: boolean;
  detectedCategory: CSVCategory | null;
  warningMessage: string | null;
}

/**
 * Valida si el archivo CSV corresponde a la categoría esperada.
 * Solo lee los primeros 2KB para eficiencia.
 * No bloquea la subida — solo devuelve un warning si detecta discrepancia.
 */
export async function validateCSVCategory(
  file: File,
  expectedCategory: CSVCategory
): Promise<CSVValidationResult> {
  try {
    // Leer solo los primeros 2KB — suficiente para título + encabezados
    const slice = file.slice(0, 2048);
    const text = await slice.text();

    // Limpiar BOM, sep= y normalizar
    const cleaned = text
      .replace(/^\ufeff/, '')
      .replace(/^\xff\xfe/, '')
      .replace(/^sep=.*\n/i, '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Quitar tildes para comparar sin problemas

    // Tomar las primeras 5 líneas
    const firstLines = cleaned.split('\n').slice(0, 5).join(' ');

    // ¿Coincide con la categoría esperada?
    const expectedKeywords = CATEGORY_KEYWORDS[expectedCategory].map(kw =>
      kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );
    const matchesExpected = expectedKeywords.some(kw => firstLines.includes(kw));

    if (matchesExpected) {
      return { isCorrectCategory: true, detectedCategory: expectedCategory, warningMessage: null };
    }

    // Intentar detectar qué categoría tiene el archivo
    let detectedCategory: CSVCategory | null = null;
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const normalizedKeywords = keywords.map(kw =>
        kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      );
      if (normalizedKeywords.some(kw => firstLines.includes(kw))) {
        detectedCategory = category as CSVCategory;
        break;
      }
    }

    // No se detectó ninguna categoría conocida → no bloquear (puede ser válido)
    if (!detectedCategory) {
      return { isCorrectCategory: true, detectedCategory: null, warningMessage: null };
    }

    // Se detectó una categoría diferente a la esperada → warning
    return {
      isCorrectCategory: false,
      detectedCategory,
      warningMessage: `⚠️ Este archivo parece ser de "${CATEGORY_LABELS[detectedCategory]}" pero lo estás subiendo en la caja de "${CATEGORY_LABELS[expectedCategory]}". Verifica que sea el archivo correcto antes de continuar.`,
    };
  } catch {
    // Si falla la lectura, no bloquear
    return { isCorrectCategory: true, detectedCategory: null, warningMessage: null };
  }
}

// ==================== VALIDACIÓN DE RANGOS DE FECHAS ====================

export interface DateRangeInfo {
  startDate: Date | null;
  endDate: Date | null;
  category: CSVCategory;
  label: string;
}

/**
 * Extrae el rango de fechas de un archivo CSV leyendo todo su contenido.
 */
export async function extractDateRangeFromCSV(
  file: File,
  category: CSVCategory
): Promise<DateRangeInfo> {
  const label = CATEGORY_LABELS[category];

  // El CSV de contenido tiene formato diferente → omitir
  if (category === 'content') {
    return { startDate: null, endDate: null, category, label };
  }

  try {
    const text = await file.text();

    // Buscar todas las fechas en formato YYYY-MM-DD
    const datePattern = /\d{4}-\d{2}-\d{2}/g;
    const matches = text.match(datePattern);

    if (!matches || matches.length === 0) {
      return { startDate: null, endDate: null, category, label };
    }

    const dates = matches
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      category,
      label,
    };
  } catch {
    return { startDate: null, endDate: null, category, label };
  }
}

/**
 * Compara los rangos de fechas de múltiples archivos.
 * Retorna un mensaje de advertencia si la diferencia entre archivos supera 7 días.
 */
export function validateDateRangeConsistency(dateRanges: DateRangeInfo[]): string | null {
  const valid = dateRanges.filter(r => r.startDate && r.endDate);
  if (valid.length < 2) return null;

  const startTimes = valid.map(r => r.startDate!.getTime());
  const endTimes = valid.map(r => r.endDate!.getTime());

  const maxStartDiff = Math.max(...startTimes) - Math.min(...startTimes);
  const maxEndDiff = Math.max(...endTimes) - Math.min(...endTimes);
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  if (maxStartDiff > sevenDaysMs || maxEndDiff > sevenDaysMs) {
    // Identificar cuál archivo tiene el rango más diferente
    const formattedRanges = valid.map(r => {
      const start = r.startDate!.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
      const end = r.endDate!.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${r.label}: ${start} – ${end}`;
    }).join(', ');

    return `Los archivos subidos tienen rangos de fechas que no coinciden (diferencia mayor a 7 días). Esto puede afectar la precisión del reporte.\n\n${formattedRanges}`;
  }

  return null;
}
