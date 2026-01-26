import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar, Instagram, Facebook } from 'lucide-react';
import { Report } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface DashboardStatsProps {
  reports: Report[];
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

function DashboardStats({ reports }: DashboardStatsProps) {
  // Calculate stats
  const totalReports = reports.length;
  
  // Reports this month
  const reportsThisMonth = reports.filter(report => {
    const reportDate = toDate(report.createdAt);
    const now = new Date();
    return reportDate.getMonth() === now.getMonth() && 
           reportDate.getFullYear() === now.getFullYear();
  }).length;

  // Most analyzed platform
  let instagramCount = 0;
  let facebookCount = 0;
  reports.forEach(report => {
    if (report.data?.instagram) instagramCount++;
    if (report.data?.facebook) facebookCount++;
  });

  const mostAnalyzedPlatform = instagramCount > facebookCount 
    ? 'Instagram' 
    : facebookCount > instagramCount 
      ? 'Facebook' 
      : 'Ambas';

  const platformColor = mostAnalyzedPlatform === 'Instagram' 
    ? 'from-purple-500 to-pink-500'
    : mostAnalyzedPlatform === 'Facebook'
      ? 'from-blue-500 to-indigo-500'
      : 'from-purple-500 to-blue-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Reports */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Reportes</p>
              <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports This Month */}
      <Card className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Este Mes</p>
              <p className="text-3xl font-bold text-gray-900">{reportsThisMonth}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Analyzed Platform */}
      <Card className="overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${platformColor}`} />
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plataforma Principal</p>
              <p className="text-2xl font-bold text-gray-900">{mostAnalyzedPlatform}</p>
            </div>
            <div className={`p-4 bg-gradient-to-br ${
              mostAnalyzedPlatform === 'Instagram' 
                ? 'from-purple-100 to-pink-100'
                : mostAnalyzedPlatform === 'Facebook'
                  ? 'from-blue-100 to-indigo-100'
                  : 'from-purple-100 to-blue-100'
            } rounded-full`}>
              {mostAnalyzedPlatform === 'Instagram' && <Instagram className="w-8 h-8 text-purple-600" />}
              {mostAnalyzedPlatform === 'Facebook' && <Facebook className="w-8 h-8 text-blue-600" />}
              {mostAnalyzedPlatform === 'Ambas' && (
                <div className="flex gap-1">
                  <Instagram className="w-6 h-6 text-purple-600" />
                  <Facebook className="w-6 h-6 text-blue-600" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(DashboardStats);