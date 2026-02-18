import { Timestamp } from 'firebase/firestore';

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  subscription: 'free' | 'pro';
  tokens?: number; // Tokens para regenerar insights
}

// ==================== NOTE TYPES ====================

export interface ReportNote {
  id: string;
  userId: string;
  reportId: string;
  content: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== REPORT TYPES ====================

export type ReportObjective = 
  | 'analysis' 
  | 'improvements' 
  | 'monthly_report'
  | 'brand-awareness'
  | 'engagement'
  | 'traffic'
  | 'conversions'
  | 'sales';
  
export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'google_analytics';
export type ReportStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface ReportCustomization {
  creative: number; // 1-5
  analytical: number; // 1-5
  professional: number; // 1-5
  colorPalette: string[] | null;
  colorPaletteImageUrl: string | null;
}

export interface Report {
  id: string;
  userId: string;
  title: string;
  objective: ReportObjective;
  platforms: Platform[];
  status: ReportStatus;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
  customization?: ReportCustomization;
  data: ReportData;
  aiInsights?: string | null;
  clientLogo?: string; // URL del logo del cliente en Firebase Storage
  // Soft delete
  isDeleted?: boolean;
  deletedAt?: Timestamp | null;
}

// ==================== DATA TYPES ====================

export interface PlatformData {
  reach?: DataPoint[];
  reachStats?: DataStats;
  impressions?: DataPoint[];
  impressionsStats?: DataStats;
  interactions?: DataPoint[];
  interactionsStats?: DataStats;
  followers?: DataPoint[];
  followersStats?: DataStats;
  content?: ContentData[];
  visits?: DataPoint[];
  visitsStats?: DataStats;
}

export interface ReportData {
  instagram?: PlatformData;
  facebook?: PlatformData;
  linkedin?: PlatformData;
  tiktok?: PlatformData;
  googleAnalytics?: GAData;
}

export interface DataPoint {
  date: string; // ISO date string
  value: number;
}

export interface DataStats {
  total: number;
  average: number;
  max: number;
  min: number;
  trend: number;
}

export interface ContentData {
  id: string;
  postType: string;
  description?: string;
  publishedAt: string;
  permalink: string;
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  videoViews?: number;
}

// ==================== GOOGLE ANALYTICS TYPES ====================

export interface GAMetrics {
  activeUsers?: DataPoint[];
  newUsers?: DataPoint[];
  sessions?: DataPoint[];
  pageviews?: DataPoint[];
  bounceRate?: DataPoint[];
  avgSessionDuration?: DataPoint[];
}

export interface GADimensionItem {
  name: string;
  users: number;
  percentage?: number;
}

export interface GADimensions {
  deviceCategory?: GADimensionItem[];
  countries?: GADimensionItem[];
  browsers?: GADimensionItem[];
  operatingSystems?: GADimensionItem[];
}

export interface GAData extends GAMetrics, GADimensions {
  propertyId: string;
  propertyName: string;
  dateRange: { start: string; end: string };
  summary?: {
    totalUsers: number;
    totalSessions: number;
    totalPageviews: number;
    avgEngagementTime: string;
    newUserPercentage: number;
    engagementRate: number;
  };
}

export interface GAConnection {
  propertyId: string;
  propertyName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  connectedAt: string;
}

// ==================== AI INSIGHTS TYPES ====================

export interface AIInsights {
  summary: string;
  topPerformers: string[];
  recommendations: string[];
  trends: string[];
  generatedAt: Timestamp;
}

// ==================== UPLOAD TYPES ====================

export type CSVCategory =
  | 'reach'
  | 'impressions'
  | 'interactions'
  | 'followers'
  | 'content'
  | 'visits';

export interface UploadedFile {
  id: string;
  reportId: string;
  platform: Platform;
  category: CSVCategory;
  fileName: string;
  storagePath: string;
  uploadedAt: Timestamp;
  parsed: boolean;
  rowCount: number;
}

// ==================== CHART TYPES ====================

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// ==================== BRANDING / WHITE-LABEL TYPES ====================

export interface BrandingConfig {
  companyName: string;
  brandColor: string;         // Hex color principal (e.g., '#FF6B6B')
  brandColorSecondary: string; // Hex color secundario/accent
  companyLogoUrl: string | null; // URL del logo de la empresa
}

export const DEFAULT_BRANDING: BrandingConfig = {
  companyName: 'DataPal',
  brandColor: '#019B77',
  brandColorSecondary: '#02c494',
  companyLogoUrl: null,
};

// ==================== MONITORING / AGENTIC TYPES ====================

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertMetric = 'reach' | 'impressions' | 'interactions' | 'followers';

export interface MetricAlert {
  id: string;
  reportId: string;
  reportTitle: string;
  platform: Platform;
  metric: AlertMetric;
  severity: AlertSeverity;
  message: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  detectedAt: string; // ISO date
  dismissed: boolean;
}

export interface MonitoringPreferences {
  enabled: boolean;
  thresholds: {
    reachDrop: number;       // % caída de alcance para alerta (default 20)
    interactionsDrop: number; // % caída de interacciones (default 25)
    followersDrop: number;    // % caída de seguidores (default 10)
    impressionsDrop: number;  // % caída de impresiones (default 20)
    significantGrowth: number; // % crecimiento notable (default 30)
  };
}

export const DEFAULT_MONITORING: MonitoringPreferences = {
  enabled: true,
  thresholds: {
    reachDrop: 20,
    interactionsDrop: 25,
    followersDrop: 10,
    impressionsDrop: 20,
    significantGrowth: 30,
  },
};

// ==================== EXPORT TYPES ====================

export type ExportFormat = 'pdf' | 'slides' | 'looker';

export interface ExportOptions {
  format: ExportFormat;
  includeAIInsights: boolean;
  includeRawData: boolean;
}

// ==================== FORM TYPES ====================

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface NewReportForm {
  objective: ReportObjective;
  platforms: Platform[];
  files: {
    instagram: Record<CSVCategory, File | null>;
    facebook: Record<CSVCategory, File | null>;
    linkedin: Record<CSVCategory, File | null>;
    tiktok: Record<CSVCategory, File | null>;
  };
  gaConnection?: GAConnection;
}