// Google Analytics specific types

export interface GAProperty {
  propertyId: string;
  displayName: string;
  createTime?: string;
  updateTime?: string;
  parent?: string; // Account ID
  timeZone?: string;
  currencyCode?: string;
}

export interface GADateRange {
  startDate: string; // YYYY-MM-DD or relative: 'today', '7daysAgo', '30daysAgo'
  endDate: string;   // YYYY-MM-DD or 'today'
}

export interface GAMetricValue {
  date: string;
  value: number;
}

export interface GADimensionValue {
  name: string;
  value: number;
  percentage?: number;
}

export interface GAReportData {
  // Time-series metrics
  activeUsers: GAMetricValue[];
  newUsers: GAMetricValue[];
  sessions: GAMetricValue[];
  pageviews: GAMetricValue[];
  bounceRate: GAMetricValue[];
  avgSessionDuration: GAMetricValue[];

  // Dimension breakdowns
  deviceCategory: GADimensionValue[];
  countries: GADimensionValue[];
  browsers: GADimensionValue[];
  operatingSystems: GADimensionValue[];

  // Summary stats
  summary: {
    totalActiveUsers: number;
    totalNewUsers: number;
    totalSessions: number;
    totalPageviews: number;
    avgBounceRate: number;
    avgSessionDurationSeconds: number;
    newUserPercentage: number;
    engagementRate: number;
    pageviewsPerUser: number;
  };

  // Trends (comparing to previous period)
  trends: {
    activeUsers: number; // percentage change
    newUsers: number;
    sessions: number;
    pageviews: number;
    bounceRate: number;
  };
}

export interface GATokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expiry_date?: number;
  scope?: string;
}

export interface GAConnectionStatus {
  connected: boolean;
  propertyId?: string;
  propertyName?: string;
  lastSynced?: string;
  error?: string;
}

// API Request/Response types
export interface GAConnectRequest {
  code: string; // OAuth authorization code
  userId: string;
}

export interface GAConnectResponse {
  success: boolean;
  properties?: GAProperty[];
  error?: string;
}

export interface GADataRequest {
  propertyId: string;
  dateRange: GADateRange;
  userId: string;
}

export interface GADataResponse {
  success: boolean;
  data?: GAReportData;
  error?: string;
}
