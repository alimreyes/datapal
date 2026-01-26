'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Report } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import ReportCard from '@/components/ReportCard';
import HeroStatsOverview from '@/components/HeroStatsOverview';
import SearchAndFilters from '@/components/SearchAndFilters';
import EmptyState from '@/components/EmptyState';
import { exportToPDF } from '@/lib/exportToPDF';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'facebook' | 'both'>('all');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');

  // Load reports
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadReports();
  }, [user, authLoading, router]);

  const loadReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      
      setReports(reportsData);
      setFilteredReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports
  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(report => {
        const hasInstagram = !!report.data?.instagram;
        const hasFacebook = !!report.data?.facebook;
        
        if (platformFilter === 'instagram') return hasInstagram && !hasFacebook;
        if (platformFilter === 'facebook') return hasFacebook && !hasInstagram;
        if (platformFilter === 'both') return hasInstagram && hasFacebook;
        
        return true;
      });
    }

    // Objective filter
    if (objectiveFilter !== 'all') {
      filtered = filtered.filter(report => report.objective === objectiveFilter);
    }

    setFilteredReports(filtered);
  }, [searchQuery, platformFilter, objectiveFilter, reports]);

  // Delete report
  const handleDelete = async (reportId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) return;

    try {
      await deleteDoc(doc(db, 'reports', reportId));
      setReports(reports.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Error al eliminar el reporte');
    }
  };

  // Export report
  const handleExport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      await exportToPDF(report, reportId);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el reporte');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchQuery !== '' || platformFilter !== 'all' || objectiveFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setObjectiveFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Logo DataPal */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mis Reportes
                </h1>
                <p className="text-gray-600 mt-2">
                  Gestiona y analiza tus reportes de redes sociales
                </p>
              </div>
            </div>
            <Link href="/new-report">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-5 h-5 mr-2" />
                Crear Reporte
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Stats Overview */}
        <HeroStatsOverview reports={reports} />

        {/* Search and Filters */}
        {reports.length > 0 && (
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            platformFilter={platformFilter}
            onPlatformFilterChange={setPlatformFilter}
            objectiveFilter={objectiveFilter}
            onObjectiveFilterChange={setObjectiveFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* Reports Grid or Empty State */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={handleDelete}
                onExport={handleExport}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type={reports.length === 0 ? 'no-reports' : 'no-results'}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}