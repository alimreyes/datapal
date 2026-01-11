import Papa from 'papaparse';
import { DataPoint, ContentData } from '@/lib/types';

/**
 * Check if CSV has valid data
 */
export const hasValidData = (csvText: string): boolean => {
  try {
    const cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '').trim();
    
    // Remove sep= line
    const withoutSep = cleanedText.replace(/^sep=.*\n/i, '');
    
    // Check if there's more than just headers
    const lines = withoutSep.split('\n').filter(line => line.trim());
    
    // Need at least 3 lines: title, header, data
    return lines.length >= 3;
  } catch (error) {
    return false;
  }
};

/**
 * Parse Meta CSV file (Instagram/Facebook)
 * Format: Date (ISO), Value (Primary column)
 */
export const parseMetaCSV = (csvText: string): DataPoint[] => {
  try {
    // Remove BOM if present
    let cleanedText = csvText.replace(/^\ufeff/, '').replace(/^\xff\xfe/, '');
    
    // Remove the "sep=," line if present
    cleanedText = cleanedText.replace(/^sep=.*\n/i, '');
    
    // Split into lines
    const lines = cleanedText.split('\n').filter(line => line.trim());
    
    // Find the header line (should contain "Fecha" or "Date")
    let headerIndex = lines.findIndex(line => 
      line.toLowerCase().includes('fecha') || 
      line.toLowerCase().includes('date')
    );
    
    // If not found, assume first non-title line is header
    if (headerIndex === -1) {
      headerIndex = lines.findIndex(line => line.includes(','));
    }
    
    // Join lines from header onwards
    const csvData = lines.slice(headerIndex).join('\n');
    
    // Parse with Papa Parse
    const result = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().replace(/['"]/g, ''),
    });

    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
    }

    // Transform to DataPoint format
    const dataPoints: DataPoint[] = result.data
      .map((row: any) => {
        // Handle different possible column names
        const dateValue = row['Fecha'] || row['Date'] || row['date'];
        const value = row['Primary'] || row['Value'] || row['value'] || '0';

        if (!dateValue) return null;

        // Parse date (ISO format: 2025-12-12T00:00:00)
        const date = dateValue.split('T')[0]; // Get YYYY-MM-DD part
        
        // Parse value (remove quotes and convert to number)
        const numericValue = parseInt(value.toString().replace(/['"]/g, ''), 10) || 0;

        return {
          date,
          value: numericValue,
        };
      })
      .filter((item): item is DataPoint => item !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dataPoints;
  } catch (error) {
    console.error('Error parsing Meta CSV:', error);
    return [];
  }
};

/**
 * Calculate statistics from data points
 */
export const calculateStats = (dataPoints: DataPoint[]) => {
  if (dataPoints.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      min: 0,
      trend: 0,
    };
  }

  const values = dataPoints.map(dp => dp.value);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = Math.round(total / values.length);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calculate trend (comparing first half vs second half)
  const midpoint = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, midpoint);
  const secondHalf = values.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
  
  const trend = secondAvg - firstAvg;

  return {
    total,
    average,
    max,
    min,
    trend: Math.round(trend),
  };
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parse Meta Content CSV file (Posts/Publications)
 * Format: Multi-column with post data
 */
export const parseMetaContent = (csvText: string): ContentData[] => {
  try {
    // Remove BOM if present
    const cleanedText = csvText.replace(/^\ufeff/, '');
    
    // Parse with Papa Parse (content CSVs don't have sep= line)
    const result = Papa.parse(cleanedText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (result.errors.length > 0) {
      console.error('Content CSV parsing errors:', result.errors);
    }

    // Transform to ContentData format
    const contentData: ContentData[] = result.data
      .map((row: any) => {
        // Extract ID
        const id = row['Identificador de la publicación'] || 
                   row['Identificador de la página'] || '';
        
        if (!id) return null;

        // Extract post type
        const postType = row['Tipo de publicación'] || 'Post';
        
        // Extract description (can be multi-line)
        const description = row['Descripción'] || row['Titulo'] || '';
        
        // Extract published date
        const publishedAt = row['Hora de publicación'] || '';
        
        // Extract permalink
        const permalink = row['Enlace permanente'] || '';
        
        // Extract date (for sorting)
        const dateValue = row['Fecha'] || row['Hora de publicación'] || '';
        const date = dateValue.split('T')[0] || dateValue.split(' ')[0] || '';
        
        // Extract metrics
        const impressions = parseInt(row['Visualizaciones'] || '0', 10);
        const reach = parseInt(row['Alcance'] || '0', 10);
        const likes = parseInt(row['Me gusta'] || row['Reacciones'] || '0', 10);
        const comments = parseInt(row['Comentarios'] || '0', 10);
        const shares = parseInt(row['Veces que se compartió'] || '0', 10);
        const saves = parseInt(row['Veces que se guardó'] || '0', 10);

        return {
          id,
          postType,
          description: description.substring(0, 200), // Truncate long descriptions
          publishedAt,
          permalink,
          date,
          impressions,
          reach,
          likes,
          comments,
          shares,
          saves,
        } as ContentData;
      })
      .filter((item): item is ContentData => item !== null)
      .sort((a, b) => {
        // Sort by published date, newest first
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA;
      });

    return contentData;
  } catch (error) {
    console.error('Error parsing Meta Content CSV:', error);
    return [];
  }
};