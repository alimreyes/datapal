import Papa from 'papaparse';
import { DataPoint, ContentData } from '@/lib/types';

/**
 * TikTok CSV Column Mappings
 * TikTok exports can be in English or Spanish
 */
const TIKTOK_DATE_COLUMNS = ['Date', 'Fecha', 'date', 'Day'];
const TIKTOK_VALUE_COLUMNS = ['Video Views', 'Visualizaciones de video', 'Views', 'Vistas', 'Value', 'Primary'];

const TIKTOK_CONTENT_COLUMNS = {
  id: ['Video ID', 'ID del video', 'Post ID'],
  postType: ['Video Type', 'Tipo de video', 'Content Type'],
  description: ['Caption', 'Título', 'Description', 'Video Caption'],
  publishedAt: ['Posted At', 'Fecha de publicación', 'Created At', 'Date'],
  permalink: ['Video URL', 'URL del video', 'Link'],
  videoViews: ['Video Views', 'Visualizaciones', 'Views', 'Total Views'],
  likes: ['Likes', 'Me gusta', 'Hearts'],
  comments: ['Comments', 'Comentarios'],
  shares: ['Shares', 'Compartidos'],
  saves: ['Saves', 'Guardados', 'Bookmarks'],
  reach: ['Reach', 'Alcance', 'Unique Viewers'],
  avgWatchTime: ['Average Watch Time', 'Tiempo promedio de visualización'],
  profileViews: ['Profile Views', 'Visitas al perfil'],
  followers: ['Followers', 'Seguidores', 'New Followers'],
};

/**
 * Find column value by trying multiple possible column names
 */
const findColumnValue = (row: any, possibleNames: string[]): string => {
  for (const name of possibleNames) {
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name].toString();
    }
  }
  return '';
};

/**
 * Check if CSV has valid data
 */
export const hasValidTikTokData = (csvText: string): boolean => {
  try {
    const cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '').trim();
    const withoutSep = cleanedText.replace(/^sep=.*\n/i, '');
    const lines = withoutSep.split('\n').filter(line => line.trim());
    return lines.length >= 2;
  } catch (error) {
    return false;
  }
};

/**
 * Parse TikTok CSV file for temporal metrics
 * Format: Date, Value columns
 */
export const parseTikTokCSV = (csvText: string): DataPoint[] => {
  try {
    // Remove BOM if present
    let cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '');

    // Remove the "sep=," line if present
    cleanedText = cleanedText.replace(/^sep=.*\n/i, '');

    // Split into lines
    const lines = cleanedText.split('\n').filter(line => line.trim());

    // Find the header line
    let headerIndex = lines.findIndex(line =>
      TIKTOK_DATE_COLUMNS.some(col => line.toLowerCase().includes(col.toLowerCase()))
    );

    if (headerIndex === -1) {
      headerIndex = lines.findIndex(line => line.includes(','));
    }

    const csvData = lines.slice(headerIndex).join('\n');

    // Parse with Papa Parse
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().replace(/['"]/g, ''),
    });

    if (result.errors.length > 0) {
      console.error('TikTok CSV parsing errors:', result.errors);
    }

    // Transform to DataPoint format
    const dataPoints: DataPoint[] = result.data
      .map((row: any) => {
        const dateValue = findColumnValue(row, TIKTOK_DATE_COLUMNS);
        const value = findColumnValue(row, TIKTOK_VALUE_COLUMNS) || '0';

        if (!dateValue) return null;

        // Parse date - handle multiple formats
        let date = dateValue;
        if (dateValue.includes('T')) {
          date = dateValue.split('T')[0];
        } else if (dateValue.includes(' ')) {
          date = dateValue.split(' ')[0];
        }

        // Handle MM/DD/YYYY format
        if (date.includes('/')) {
          const parts = date.split('/');
          if (parts.length === 3) {
            const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
            date = `${year}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
          }
        }

        // Handle numeric values that might have K, M suffixes
        let numericValue = 0;
        const cleanValue = value.toString().replace(/['",%\s]/g, '');
        if (cleanValue.toLowerCase().endsWith('k')) {
          numericValue = parseFloat(cleanValue) * 1000;
        } else if (cleanValue.toLowerCase().endsWith('m')) {
          numericValue = parseFloat(cleanValue) * 1000000;
        } else {
          numericValue = parseInt(cleanValue, 10) || 0;
        }

        return {
          date,
          value: Math.round(numericValue),
        };
      })
      .filter((item): item is DataPoint => item !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dataPoints;
  } catch (error) {
    console.error('Error parsing TikTok CSV:', error);
    return [];
  }
};

/**
 * Parse TikTok Content CSV file (Videos)
 */
export const parseTikTokContent = (csvText: string): ContentData[] => {
  try {
    const cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '');

    const result = Papa.parse(cleanedText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error('TikTok Content CSV parsing errors:', result.errors);
    }

    const contentData: ContentData[] = result.data
      .map((row: any) => {
        const id = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.id);

        if (!id) return null;

        const postType = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.postType) || 'Video';
        const description = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.description);
        const publishedAt = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.publishedAt);
        const permalink = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.permalink);

        // Extract date
        let date = publishedAt;
        if (publishedAt.includes('T')) {
          date = publishedAt.split('T')[0];
        } else if (publishedAt.includes(' ')) {
          date = publishedAt.split(' ')[0];
        }

        // Extract metrics
        const videoViewsStr = findColumnValue(row, TIKTOK_CONTENT_COLUMNS.videoViews) || '0';
        let videoViews = 0;
        if (videoViewsStr.toLowerCase().endsWith('k')) {
          videoViews = parseFloat(videoViewsStr) * 1000;
        } else if (videoViewsStr.toLowerCase().endsWith('m')) {
          videoViews = parseFloat(videoViewsStr) * 1000000;
        } else {
          videoViews = parseInt(videoViewsStr.replace(/[^\d]/g, ''), 10) || 0;
        }

        const likes = parseInt(findColumnValue(row, TIKTOK_CONTENT_COLUMNS.likes).replace(/[^\d]/g, '') || '0', 10);
        const comments = parseInt(findColumnValue(row, TIKTOK_CONTENT_COLUMNS.comments).replace(/[^\d]/g, '') || '0', 10);
        const shares = parseInt(findColumnValue(row, TIKTOK_CONTENT_COLUMNS.shares).replace(/[^\d]/g, '') || '0', 10);
        const saves = parseInt(findColumnValue(row, TIKTOK_CONTENT_COLUMNS.saves).replace(/[^\d]/g, '') || '0', 10);
        const reach = parseInt(findColumnValue(row, TIKTOK_CONTENT_COLUMNS.reach).replace(/[^\d]/g, '') || '0', 10) || videoViews;

        return {
          id,
          postType,
          description: description.substring(0, 200),
          publishedAt,
          permalink,
          date,
          impressions: Math.round(videoViews),
          reach: Math.round(reach),
          likes,
          comments,
          shares,
          saves,
          videoViews: Math.round(videoViews),
        } as ContentData;
      })
      .filter((item): item is ContentData => item !== null)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });

    return contentData;
  } catch (error) {
    console.error('Error parsing TikTok Content CSV:', error);
    return [];
  }
};
