import Papa from 'papaparse';
import { DataPoint, ContentData } from '@/lib/types';

/**
 * LinkedIn CSV Column Mappings
 * LinkedIn exports can be in English or Spanish
 */
const LINKEDIN_DATE_COLUMNS = ['Date', 'Fecha', 'date'];
const LINKEDIN_VALUE_COLUMNS = ['Impressions', 'Impresiones', 'Value', 'Valor', 'Primary'];

const LINKEDIN_CONTENT_COLUMNS = {
  id: ['Post ID', 'ID de publicación', 'Update URN'],
  postType: ['Post Type', 'Tipo de publicación', 'Content Type'],
  description: ['Post Text', 'Texto de la publicación', 'Update Text', 'Description'],
  publishedAt: ['Created At', 'Fecha de creación', 'Posted At', 'Date'],
  permalink: ['Post URL', 'URL de publicación', 'Permalink'],
  impressions: ['Impressions', 'Impresiones', 'Total Impressions'],
  reach: ['Unique Impressions', 'Impresiones únicas', 'Reach'],
  likes: ['Likes', 'Me gusta', 'Reactions'],
  comments: ['Comments', 'Comentarios'],
  shares: ['Shares', 'Compartidos', 'Reposts'],
  clicks: ['Clicks', 'Clics', 'Link Clicks'],
  engagement: ['Engagement Rate', 'Tasa de interacción', 'Engagement'],
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
export const hasValidLinkedInData = (csvText: string): boolean => {
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
 * Parse LinkedIn CSV file for temporal metrics
 * Format: Date, Value columns
 */
export const parseLinkedInCSV = (csvText: string): DataPoint[] => {
  try {
    // Remove BOM if present
    let cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '');

    // Remove the "sep=," line if present
    cleanedText = cleanedText.replace(/^sep=.*\n/i, '');

    // Split into lines
    const lines = cleanedText.split('\n').filter(line => line.trim());

    // Find the header line
    let headerIndex = lines.findIndex(line =>
      LINKEDIN_DATE_COLUMNS.some(col => line.toLowerCase().includes(col.toLowerCase()))
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
      console.error('LinkedIn CSV parsing errors:', result.errors);
    }

    // Transform to DataPoint format
    const dataPoints: DataPoint[] = result.data
      .map((row: any) => {
        const dateValue = findColumnValue(row, LINKEDIN_DATE_COLUMNS);
        const value = findColumnValue(row, LINKEDIN_VALUE_COLUMNS) || '0';

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
            // Convert to YYYY-MM-DD
            const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
            date = `${year}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
          }
        }

        const numericValue = parseInt(value.toString().replace(/['",%]/g, ''), 10) || 0;

        return {
          date,
          value: numericValue,
        };
      })
      .filter((item): item is DataPoint => item !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dataPoints;
  } catch (error) {
    console.error('Error parsing LinkedIn CSV:', error);
    return [];
  }
};

/**
 * Parse LinkedIn Content CSV file (Posts/Publications)
 */
export const parseLinkedInContent = (csvText: string): ContentData[] => {
  try {
    const cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '');

    const result = Papa.parse(cleanedText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error('LinkedIn Content CSV parsing errors:', result.errors);
    }

    const contentData: ContentData[] = result.data
      .map((row: any) => {
        const id = findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.id);

        if (!id) return null;

        const postType = findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.postType) || 'Post';
        const description = findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.description);
        const publishedAt = findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.publishedAt);
        const permalink = findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.permalink);

        // Extract date
        let date = publishedAt;
        if (publishedAt.includes('T')) {
          date = publishedAt.split('T')[0];
        } else if (publishedAt.includes(' ')) {
          date = publishedAt.split(' ')[0];
        }

        // Extract metrics
        const impressions = parseInt(findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.impressions) || '0', 10);
        const reach = parseInt(findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.reach) || '0', 10) || impressions;
        const likes = parseInt(findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.likes) || '0', 10);
        const comments = parseInt(findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.comments) || '0', 10);
        const shares = parseInt(findColumnValue(row, LINKEDIN_CONTENT_COLUMNS.shares) || '0', 10);

        return {
          id,
          postType,
          description: description.substring(0, 200),
          publishedAt,
          permalink,
          date,
          impressions,
          reach,
          likes,
          comments,
          shares,
          saves: 0,
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
    console.error('Error parsing LinkedIn Content CSV:', error);
    return [];
  }
};
