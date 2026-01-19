import React, { memo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Instagram, Facebook, Calendar, Target, TrendingUp, FileDown, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Report } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface ReportCardProps {
  report: Report;
  onDelete?: (reportId: string) => void;
  onExport?: (reportId: string) => void;
}

// Helper to convert Timestamp to Date
const toDate = (timestamp: Timestamp | Date | string): Date => {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate();
  }
  return new Date();
};

function ReportCard({ report, onDelete, onExport }: ReportCardProps) {
  // Calculate engagement rate
  const calculateEngagementRate = () => {
    const instagramReach = report.data?.instagram?.reachStats?.total || 0;
    const instagramInteractions = report.data?.instagram?.interactionsStats?.total || 0;
    const facebookReach = report.data?.facebook?.reachStats?.total || 0;
    const facebookInteractions = report.data?.facebook?.interactionsStats?.total || 0;
    
    const totalReach = instagramReach + facebookReach;
    const totalInteractions = instagramInteractions + facebookInteractions;
    
    if (totalReach === 0) return '0.00';
    return ((totalInteractions / totalReach) * 100).toFixed(2);
  };

  // Get total reach
  const getTotalReach = () => {
    const instagramReach = report.data?.instagram?.reachStats?.total || 0;
    const facebookReach = report.data?.facebook?.reachStats?.total || 0;
    return instagramReach + facebookReach;
  };

  // Check which platforms are included
  const hasInstagram = !!report.data?.instagram;
  const hasFacebook = !!report.data?.facebook;

  // Get objective label
  const objectiveLabels: Record<string, string> = {
    'brand-awareness': 'Conocimiento de Marca',
    'engagement': 'Engagement',
    'traffic': 'Tráfico',
    'conversions': 'Conversiones',
    'sales': 'Ventas'
  };

  const engagementRate = calculateEngagementRate();
  const totalReach = getTotalReach();

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-purple-300">
      {/* Header with gradient */}
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
      
      <CardContent className="pt-6">
        {/* Title and Date */}
        <div className="mb-4">
          <Link href={`/report/${report.id}`}>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 cursor-pointer">
              {report.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{format(toDate(report.createdAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-600 font-medium">Plataformas:</span>
          {hasInstagram && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <Instagram className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Instagram</span>
            </div>
          )}
          {hasFacebook && (
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
              <Facebook className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Facebook</span>
            </div>
          )}
        </div>

        {/* Objective */}
        {report.objective && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{objectiveLabels[report.objective] || report.objective}</span>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Engagement Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600">Engagement</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{engagementRate}%</p>
          </div>

          {/* Total Reach */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Alcance</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{totalReach.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>

      {/* Actions Footer */}
      <CardFooter className="bg-gray-50 border-t flex items-center justify-between gap-2 p-4">
        <Link href={`/report/${report.id}`} className="flex-1">
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
            Ver Reporte
          </button>
        </Link>

        {onExport && (
          <button
            onClick={() => onExport(report.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Exportar PDF"
          >
            <FileDown className="w-5 h-5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(report.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </CardFooter>
    </Card>
  );
}

export default memo(ReportCard);