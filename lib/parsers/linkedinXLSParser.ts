import * as XLSX from 'xlsx';
import { DataPoint, ContentData, PlatformData, DataStats } from '@/lib/types';

/**
 * LinkedIn XLS Parser
 * Parses LinkedIn export files (.xls/.xlsx) with 2 sheets:
 * 1. "Indicadores" - Time-series metrics
 * 2. "Todas las publicaciones" - Individual post content
 */

export interface LinkedInXLSResult {
  metrics: PlatformData;
  content: ContentData[];
}

// Column mappings for "Indicadores" sheet (Spanish column names from LinkedIn export)
const METRICS_COLUMNS = {
  date: 'Fecha',
  impressionsTotal: 'Impresiones totales',
  impressionsOrganic: 'Impresiones (orgánicas)',
  impressionsSponsored: 'Impresiones (patrocinadas)',
  uniqueImpressions: 'Impresiones únicas (orgánicas)',
  clicksTotal: 'Clics (Totales)',
  clicksOrganic: 'Clics (orgánicos)',
  clicksSponsored: 'Clics (patrocinados)',
  reactionsTotal: 'Reacciones (total)',
  reactionsOrganic: 'Reacciones (generales)',
  reactionsSponsored: 'Reacciones (patrocinadas)',
  commentsTotal: 'Comentarios (totales)',
  commentsOrganic: 'Comentarios (orgánicos)',
  commentsSponsored: 'Comentarios (patrocinados)',
  sharesTotal: 'Veces compartido (total)',
  sharesOrganic: 'Veces compartido (orgánico)',
  sharesSponsored: 'Veces compartido (patrocinado)',
  engagementTotal: 'Tasa de interacción (total)',
  engagementOrganic: 'Tasa de interacción (orgánica)',
  engagementSponsored: 'Tasa de interacción (patrocinada)',
};

// Column mappings for "Todas las publicaciones" sheet
const CONTENT_COLUMNS = {
  title: 'Título de la publicación',
  url: 'Enlace de la publicación',
  type: 'Tipo de publicación',
  campaignName: 'Nombre de la campaña',
  advertisedBy: 'Anunciado por',
  createdDate: 'Fecha de creación',
  campaignStart: 'Fecha de inicio de campaña',
  campaignEnd: 'Fecha de finalización de campaña',
  audience: 'Público',
  impressions: 'Impresiones',
  views: 'Visualizaciones',
  offSiteViews: 'Visualizaciones fuera del sitio',
  clicks: 'Clics',
  ctr: 'Porcentaje de clics',
  reactions: 'Recomendaciones',
  comments: 'Comentarios',
  shares: 'Veces compartido',
  followers: 'Seguidores',
  engagement: 'Tasa de interacción',
  contentType: 'Tipo de contenido',
};

// Alternative sheet names (in case LinkedIn changes them)
const SHEET_NAMES = {
  metrics: ['Indicadores', 'Indicators', 'Métricas', 'Metrics'],
  content: ['Todas las publicaciones', 'All publications', 'Publicaciones', 'Publications', 'Posts'],
};

/**
 * Find a sheet by trying multiple possible names
 */
function findSheet(workbook: XLSX.WorkBook, possibleNames: string[]): XLSX.WorkSheet | null {
  for (const name of possibleNames) {
    if (workbook.Sheets[name]) {
      return workbook.Sheets[name];
    }
  }
  // Try case-insensitive match
  const sheetNames = workbook.SheetNames;
  for (const name of possibleNames) {
    const found = sheetNames.find(s => s.toLowerCase() === name.toLowerCase());
    if (found && workbook.Sheets[found]) {
      return workbook.Sheets[found];
    }
  }
  return null;
}

/**
 * Get a value from a row using the column name
 */
function getValue(row: any, columnName: string): string {
  if (row[columnName] !== undefined && row[columnName] !== null) {
    return row[columnName].toString().trim();
  }
  return '';
}

/**
 * Parse a number from a string, handling various formats
 */
function parseNumber(value: string): number {
  if (!value) return 0;
  // Remove quotes, commas, percentage signs
  const cleaned = value.replace(/['",%]/g, '').replace(/\s/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/**
 * Parse a percentage from a string (e.g., "5.2%" -> 5.2)
 */
function parsePercentage(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/['",%]/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format date to YYYY-MM-DD
 * LinkedIn exports use MM/DD/YYYY format
 */
function formatDate(dateValue: any): string {
  if (!dateValue) return '';

  // If it's already a string
  if (typeof dateValue === 'string') {
    // Handle ISO format
    if (dateValue.includes('T')) {
      return dateValue.split('T')[0];
    }
    // Handle MM/DD/YYYY format (LinkedIn uses US format)
    if (dateValue.includes('/')) {
      const parts = dateValue.split('/');
      if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    // Handle YYYY-MM-DD format (already correct)
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    // Handle DD-MM-YYYY format
    if (dateValue.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
      const parts = dateValue.split('-');
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateValue;
  }

  // If it's a number (Excel serial date)
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    if (date) {
      const year = date.y;
      const month = String(date.m).padStart(2, '0');
      const day = String(date.d).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  // If it's a Date object
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }

  return '';
}

/**
 * Calculate statistics for a data series
 */
function calculateStats(data: DataPoint[]): DataStats {
  if (data.length === 0) {
    return { total: 0, average: 0, max: 0, min: 0, trend: 0 };
  }

  const values = data.map(d => d.value);
  const total = values.reduce((sum, v) => sum + v, 0);
  const average = Math.round(total / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calculate trend (percentage change from first half to second half)
  let trend = 0;
  if (data.length >= 2) {
    const midpoint = Math.floor(data.length / 2);
    const firstHalf = values.slice(0, midpoint);
    const secondHalf = values.slice(midpoint);

    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

    if (firstAvg > 0) {
      trend = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
    }
  }

  return { total, average, max, min, trend };
}

/**
 * Parse the "Indicadores" sheet to extract time-series metrics
 */
function parseMetricsSheet(sheet: XLSX.WorkSheet): PlatformData {
  // LinkedIn exports have a description row first, then headers
  // We need to skip the first row and use the second as headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  if (rawData.length < 3) {
    return {};
  }

  // Find the header row (contains 'Fecha')
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(5, rawData.length); i++) {
    if (rawData[i] && rawData[i].some((cell: any) =>
      cell && cell.toString().toLowerCase().includes('fecha'))) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = rawData[headerRowIndex];
  const dataRows = rawData.slice(headerRowIndex + 1);

  // Convert to object format with headers
  const data = dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      if (header) {
        obj[header.toString().trim()] = row[index];
      }
    });
    return obj;
  }).filter(row => Object.keys(row).length > 0);

  console.log('[LinkedIn Parser] Metrics data rows:', data.length);
  if (data.length > 0) {
    console.log('[LinkedIn Parser] First metrics row keys:', Object.keys(data[0]));
  }

  if (data.length === 0) {
    return {};
  }

  const impressions: DataPoint[] = [];
  const reach: DataPoint[] = [];
  const interactions: DataPoint[] = [];

  for (const row of data) {
    const date = formatDate(getValue(row as any, METRICS_COLUMNS.date));

    if (!date) continue;

    // Impressions: use total or organic
    const impressionValue = parseNumber(getValue(row as any, METRICS_COLUMNS.impressionsTotal)) ||
                           parseNumber(getValue(row as any, METRICS_COLUMNS.impressionsOrganic));
    impressions.push({ date, value: impressionValue });

    // Reach: use unique impressions (organic)
    const reachValue = parseNumber(getValue(row as any, METRICS_COLUMNS.uniqueImpressions));
    reach.push({ date, value: reachValue });

    // Interactions: sum of reactions + comments + shares
    const reactionsValue = parseNumber(getValue(row as any, METRICS_COLUMNS.reactionsTotal)) ||
                          parseNumber(getValue(row as any, METRICS_COLUMNS.reactionsOrganic));
    const commentsValue = parseNumber(getValue(row as any, METRICS_COLUMNS.commentsTotal)) ||
                         parseNumber(getValue(row as any, METRICS_COLUMNS.commentsOrganic));
    const sharesValue = parseNumber(getValue(row as any, METRICS_COLUMNS.sharesTotal)) ||
                       parseNumber(getValue(row as any, METRICS_COLUMNS.sharesOrganic));

    interactions.push({ date, value: reactionsValue + commentsValue + sharesValue });
  }

  // Sort by date
  const sortByDate = (a: DataPoint, b: DataPoint) =>
    new Date(a.date).getTime() - new Date(b.date).getTime();

  impressions.sort(sortByDate);
  reach.sort(sortByDate);
  interactions.sort(sortByDate);

  return {
    impressions,
    impressionsStats: calculateStats(impressions),
    reach,
    reachStats: calculateStats(reach),
    interactions,
    interactionsStats: calculateStats(interactions),
  };
}

/**
 * Parse the "Todas las publicaciones" sheet to extract content data
 */
function parseContentSheet(sheet: XLSX.WorkSheet): ContentData[] {
  // LinkedIn exports have a description row first, then headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  if (rawData.length < 3) {
    return [];
  }

  // Find the header row (contains 'Título' or 'Enlace')
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(5, rawData.length); i++) {
    if (rawData[i] && rawData[i].some((cell: any) =>
      cell && (cell.toString().toLowerCase().includes('título') ||
               cell.toString().toLowerCase().includes('enlace')))) {
      headerRowIndex = i;
      break;
    }
  }

  const headers = rawData[headerRowIndex];
  const dataRows = rawData.slice(headerRowIndex + 1);

  // Convert to object format with headers
  const data = dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      if (header) {
        obj[header.toString().trim()] = row[index];
      }
    });
    return obj;
  }).filter(row => Object.keys(row).length > 0);

  console.log('[LinkedIn Parser] Content data rows:', data.length);
  if (data.length > 0) {
    console.log('[LinkedIn Parser] First content row keys:', Object.keys(data[0]));
  }

  if (data.length === 0) {
    return [];
  }

  const content: ContentData[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i] as any;

    const title = getValue(row, CONTENT_COLUMNS.title);
    const url = getValue(row, CONTENT_COLUMNS.url);
    const createdDate = formatDate(getValue(row, CONTENT_COLUMNS.createdDate));

    // Skip rows without essential data
    if (!createdDate && !title && !url) continue;

    const postType = getValue(row, CONTENT_COLUMNS.type) ||
                    getValue(row, CONTENT_COLUMNS.contentType) ||
                    'Post';

    const impressions = parseNumber(getValue(row, CONTENT_COLUMNS.impressions));
    const views = parseNumber(getValue(row, CONTENT_COLUMNS.views));
    const clicks = parseNumber(getValue(row, CONTENT_COLUMNS.clicks));
    const reactions = parseNumber(getValue(row, CONTENT_COLUMNS.reactions));
    const comments = parseNumber(getValue(row, CONTENT_COLUMNS.comments));
    const shares = parseNumber(getValue(row, CONTENT_COLUMNS.shares));

    content.push({
      id: `linkedin-post-${i}`,
      postType,
      description: title.substring(0, 200),
      publishedAt: createdDate,
      permalink: url,
      date: createdDate,
      impressions,
      reach: views || impressions, // Use views as reach, fallback to impressions
      likes: reactions,
      comments,
      shares,
      saves: 0,
      videoViews: views > 0 ? views : undefined,
    });
  }

  // Sort by date (newest first)
  content.sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.date).getTime();
    const dateB = new Date(b.publishedAt || b.date).getTime();
    return dateB - dateA;
  });

  return content;
}

/**
 * Main function to parse LinkedIn XLS file
 */
export async function parseLinkedInXLS(file: File): Promise<LinkedInXLSResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

    // Debug: Log sheet names
    console.log('[LinkedIn Parser] Sheet names found:', workbook.SheetNames);

    // Find the sheets
    const metricsSheet = findSheet(workbook, SHEET_NAMES.metrics);
    const contentSheet = findSheet(workbook, SHEET_NAMES.content);

    console.log('[LinkedIn Parser] Metrics sheet found:', !!metricsSheet);
    console.log('[LinkedIn Parser] Content sheet found:', !!contentSheet);

    // Parse available sheets
    const metrics = metricsSheet ? parseMetricsSheet(metricsSheet) : {};
    const content = contentSheet ? parseContentSheet(contentSheet) : [];

    // If no metrics from Indicadores sheet, try to derive from content
    if (!metrics.impressions?.length && content.length > 0) {
      // Aggregate content data by date
      const dateMap = new Map<string, { impressions: number; reach: number; interactions: number }>();

      for (const post of content) {
        const date = post.date;
        if (!date) continue;

        const existing = dateMap.get(date) || { impressions: 0, reach: 0, interactions: 0 };
        existing.impressions += post.impressions;
        existing.reach += post.reach;
        existing.interactions += post.likes + post.comments + post.shares;
        dateMap.set(date, existing);
      }

      const impressions: DataPoint[] = [];
      const reach: DataPoint[] = [];
      const interactions: DataPoint[] = [];

      dateMap.forEach((values, date) => {
        impressions.push({ date, value: values.impressions });
        reach.push({ date, value: values.reach });
        interactions.push({ date, value: values.interactions });
      });

      const sortByDate = (a: DataPoint, b: DataPoint) =>
        new Date(a.date).getTime() - new Date(b.date).getTime();

      impressions.sort(sortByDate);
      reach.sort(sortByDate);
      interactions.sort(sortByDate);

      metrics.impressions = impressions;
      metrics.impressionsStats = calculateStats(impressions);
      metrics.reach = reach;
      metrics.reachStats = calculateStats(reach);
      metrics.interactions = interactions;
      metrics.interactionsStats = calculateStats(interactions);
    }

    // Add content to metrics if available
    if (content.length > 0) {
      metrics.content = content;
    }

    return {
      metrics,
      content,
    };
  } catch (error) {
    console.error('Error parsing LinkedIn XLS file:', error);
    throw new Error('Failed to parse LinkedIn XLS file. Please ensure the file is a valid LinkedIn export.');
  }
}

/**
 * Check if the file is a valid LinkedIn XLS export
 */
export async function validateLinkedInXLS(file: File): Promise<{ valid: boolean; message: string }> {
  try {
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['xls', 'xlsx'].includes(extension || '')) {
      return { valid: false, message: 'El archivo debe ser un archivo .xls o .xlsx' };
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, message: 'El archivo es demasiado grande (máximo 10MB)' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Check for expected sheets
    const hasMetricsSheet = findSheet(workbook, SHEET_NAMES.metrics) !== null;
    const hasContentSheet = findSheet(workbook, SHEET_NAMES.content) !== null;

    if (!hasMetricsSheet && !hasContentSheet) {
      return {
        valid: false,
        message: 'El archivo no contiene las hojas esperadas de LinkedIn ("Indicadores" o "Todas las publicaciones")'
      };
    }

    return { valid: true, message: 'Archivo válido' };
  } catch (error) {
    return { valid: false, message: 'Error al leer el archivo. Asegúrate de que sea un archivo XLS válido.' };
  }
}
