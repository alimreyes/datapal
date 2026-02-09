import { GAProperty, GADateRange, GAReportData, GAMetricValue, GADimensionValue } from './types';
import { refreshAccessToken } from './oauth';

const GA_DATA_API_BASE = 'https://analyticsdata.googleapis.com/v1beta';
const GA_ADMIN_API_BASE = 'https://analyticsadmin.googleapis.com/v1beta';

interface GAApiResponse {
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string }>;
}

/**
 * Google Analytics Data API Client
 */
export class GADataClient {
  private accessToken: string;
  private refreshToken?: string;
  private onTokenRefresh?: (tokens: { access_token: string; refresh_token?: string }) => void;

  constructor(
    accessToken: string,
    refreshToken?: string,
    onTokenRefresh?: (tokens: { access_token: string; refresh_token?: string }) => void
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.onTokenRefresh = onTokenRefresh;
  }

  /**
   * Make an authenticated API request
   */
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    let response = await fetch(url, { ...options, headers });

    // If token expired, try to refresh
    if (response.status === 401 && this.refreshToken) {
      try {
        const newTokens = await refreshAccessToken(this.refreshToken);
        this.accessToken = newTokens.access_token;

        if (this.onTokenRefresh) {
          this.onTokenRefresh(newTokens);
        }

        // Retry the request
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${this.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw new Error('Authentication failed. Please reconnect your Google Analytics account.');
      }
    }

    return response;
  }

  /**
   * List all GA4 properties the user has access to
   * Uses accountSummaries endpoint which is the recommended method
   * See: https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/accountSummaries/list
   */
  async listProperties(): Promise<GAProperty[]> {
    try {
      console.log('[GA Client] Fetching account summaries...');

      // Use accountSummaries - the recommended endpoint for listing properties
      const response = await this.fetchWithAuth(
        `${GA_ADMIN_API_BASE}/accountSummaries`
      );

      console.log('[GA Client] Account summaries response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[GA Client] Account summaries error response:', errorText);
        throw new Error(`Failed to fetch account summaries: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const accountSummaries = data.accountSummaries || [];

      console.log('[GA Client] Found account summaries:', accountSummaries.length);

      if (accountSummaries.length === 0) {
        console.log('[GA Client] No accounts found - user may not have GA access');
        return [];
      }

      // Extract properties from all accounts
      const properties: GAProperty[] = [];

      for (const account of accountSummaries) {
        const propertySummaries = account.propertySummaries || [];
        console.log('[GA Client] Account:', account.displayName, '- Properties:', propertySummaries.length);

        for (const prop of propertySummaries) {
          properties.push({
            propertyId: prop.property?.replace('properties/', '') || '',
            displayName: prop.displayName || 'Unnamed Property',
            parent: account.account,
          });
        }
      }

      console.log('[GA Client] Total properties found:', properties.length);
      return properties;
    } catch (error: any) {
      console.error('[GA Client] Error listing GA properties:', error);
      console.error('[GA Client] Error message:', error?.message);
      throw error;
    }
  }

  /**
   * Get all report data for a property
   */
  async getReportData(propertyId: string, dateRange: GADateRange): Promise<GAReportData> {
    const [
      timeSeriesData,
      deviceData,
      countryData,
      browserData,
      osData,
      previousPeriodData,
    ] = await Promise.all([
      this.getTimeSeriesMetrics(propertyId, dateRange),
      this.getDimensionBreakdown(propertyId, dateRange, 'deviceCategory'),
      this.getDimensionBreakdown(propertyId, dateRange, 'country'),
      this.getDimensionBreakdown(propertyId, dateRange, 'browser'),
      this.getDimensionBreakdown(propertyId, dateRange, 'operatingSystem'),
      this.getTimeSeriesMetrics(propertyId, this.getPreviousPeriod(dateRange)),
    ]);

    // Calculate summary
    const summary = this.calculateSummary(timeSeriesData);

    // Calculate trends
    const trends = this.calculateTrends(timeSeriesData, previousPeriodData);

    return {
      ...timeSeriesData,
      deviceCategory: deviceData,
      countries: countryData,
      browsers: browserData,
      operatingSystems: osData,
      summary,
      trends,
    };
  }

  /**
   * Get time-series metrics
   */
  private async getTimeSeriesMetrics(
    propertyId: string,
    dateRange: GADateRange
  ): Promise<Omit<GAReportData, 'deviceCategory' | 'countries' | 'browsers' | 'operatingSystems' | 'summary' | 'trends'>> {
    const requestBody = {
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }],
    };

    const response = await this.fetchWithAuth(
      `${GA_DATA_API_BASE}/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch time series data: ${response.statusText}`);
    }

    const data: GAApiResponse = await response.json();

    // Parse the response
    const activeUsers: GAMetricValue[] = [];
    const newUsers: GAMetricValue[] = [];
    const sessions: GAMetricValue[] = [];
    const pageviews: GAMetricValue[] = [];
    const bounceRate: GAMetricValue[] = [];
    const avgSessionDuration: GAMetricValue[] = [];

    for (const row of data.rows || []) {
      const date = row.dimensionValues?.[0]?.value || '';
      const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;

      activeUsers.push({ date: formattedDate, value: parseInt(row.metricValues?.[0]?.value || '0', 10) });
      newUsers.push({ date: formattedDate, value: parseInt(row.metricValues?.[1]?.value || '0', 10) });
      sessions.push({ date: formattedDate, value: parseInt(row.metricValues?.[2]?.value || '0', 10) });
      pageviews.push({ date: formattedDate, value: parseInt(row.metricValues?.[3]?.value || '0', 10) });
      bounceRate.push({ date: formattedDate, value: parseFloat(row.metricValues?.[4]?.value || '0') * 100 });
      avgSessionDuration.push({ date: formattedDate, value: parseFloat(row.metricValues?.[5]?.value || '0') });
    }

    return {
      activeUsers,
      newUsers,
      sessions,
      pageviews,
      bounceRate,
      avgSessionDuration,
    };
  }

  /**
   * Get dimension breakdown (device, country, browser, etc.)
   */
  private async getDimensionBreakdown(
    propertyId: string,
    dateRange: GADateRange,
    dimension: string
  ): Promise<GADimensionValue[]> {
    const requestBody = {
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: dimension }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 10,
    };

    const response = await this.fetchWithAuth(
      `${GA_DATA_API_BASE}/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${dimension} data: ${response.statusText}`);
    }

    const data: GAApiResponse = await response.json();

    // Calculate total for percentages
    let total = 0;
    const values: GADimensionValue[] = [];

    for (const row of data.rows || []) {
      const value = parseInt(row.metricValues?.[0]?.value || '0', 10);
      total += value;
      values.push({
        name: row.dimensionValues?.[0]?.value || 'Unknown',
        value,
      });
    }

    // Add percentages
    return values.map(v => ({
      ...v,
      percentage: total > 0 ? Math.round((v.value / total) * 1000) / 10 : 0,
    }));
  }

  /**
   * Get previous period date range for trend calculation
   */
  private getPreviousPeriod(dateRange: GADateRange): GADateRange {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const previousEnd = new Date(start);
    previousEnd.setDate(previousEnd.getDate() - 1);

    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - daysDiff);

    return {
      startDate: previousStart.toISOString().split('T')[0],
      endDate: previousEnd.toISOString().split('T')[0],
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(
    data: Omit<GAReportData, 'deviceCategory' | 'countries' | 'browsers' | 'operatingSystems' | 'summary' | 'trends'>
  ): GAReportData['summary'] {
    const sumValues = (arr: GAMetricValue[]) => arr.reduce((sum, v) => sum + v.value, 0);
    const avgValues = (arr: GAMetricValue[]) => arr.length > 0 ? sumValues(arr) / arr.length : 0;

    const totalActiveUsers = sumValues(data.activeUsers);
    const totalNewUsers = sumValues(data.newUsers);
    const totalSessions = sumValues(data.sessions);
    const totalPageviews = sumValues(data.pageviews);

    return {
      totalActiveUsers,
      totalNewUsers,
      totalSessions,
      totalPageviews,
      avgBounceRate: Math.round(avgValues(data.bounceRate) * 10) / 10,
      avgSessionDurationSeconds: Math.round(avgValues(data.avgSessionDuration)),
      newUserPercentage: totalActiveUsers > 0 ? Math.round((totalNewUsers / totalActiveUsers) * 1000) / 10 : 0,
      engagementRate: 100 - Math.round(avgValues(data.bounceRate) * 10) / 10,
      pageviewsPerUser: totalActiveUsers > 0 ? Math.round((totalPageviews / totalActiveUsers) * 10) / 10 : 0,
    };
  }

  /**
   * Calculate trends comparing to previous period
   */
  private calculateTrends(
    current: Omit<GAReportData, 'deviceCategory' | 'countries' | 'browsers' | 'operatingSystems' | 'summary' | 'trends'>,
    previous: Omit<GAReportData, 'deviceCategory' | 'countries' | 'browsers' | 'operatingSystems' | 'summary' | 'trends'>
  ): GAReportData['trends'] {
    const calculateChange = (currentArr: GAMetricValue[], previousArr: GAMetricValue[]) => {
      const currentSum = currentArr.reduce((sum, v) => sum + v.value, 0);
      const previousSum = previousArr.reduce((sum, v) => sum + v.value, 0);

      if (previousSum === 0) return currentSum > 0 ? 100 : 0;
      return Math.round(((currentSum - previousSum) / previousSum) * 1000) / 10;
    };

    return {
      activeUsers: calculateChange(current.activeUsers, previous.activeUsers),
      newUsers: calculateChange(current.newUsers, previous.newUsers),
      sessions: calculateChange(current.sessions, previous.sessions),
      pageviews: calculateChange(current.pageviews, previous.pageviews),
      bounceRate: calculateChange(current.bounceRate, previous.bounceRate),
    };
  }
}
