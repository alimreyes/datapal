import { Timestamp } from 'firebase/firestore';

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  subscription: 'free' | 'pro';
}

// ==================== REPORT TYPES ====================

export type ReportObjective = 'analysis' | 'improvements' | 'monthly_report';
export type Platform = 'instagram' | 'facebook';
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
  objective: ReportObjective;
  platforms: Platform[];
  status: ReportStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  customization: ReportCustomization;
  data: ReportData;
  aiInsights: AIInsights | null;
}

// ==================== DATA TYPES ====================

export interface PlatformData {
  reach: DataPoint[];
  impressions: DataPoint[];
  interactions: DataPoint[];
  followers: DataPoint[];
  content: ContentData[];
  linkClicks: DataPoint[];
  visits: DataPoint[];
}

export interface ReportData {
  instagram?: PlatformData;
  facebook?: PlatformData;
}

export interface DataPoint {
  date: string; // ISO date string
  value: number;
}

export interface ContentData {
  id: string;
  type: 'post' | 'story' | 'reel' | 'video';
  caption?: string;
  date: string;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
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
  | 'linkClicks'
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
  };
}