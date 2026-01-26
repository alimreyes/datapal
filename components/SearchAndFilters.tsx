'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  platformFilter: 'all' | 'instagram' | 'facebook' | 'both';
  onPlatformFilterChange: (filter: 'all' | 'instagram' | 'facebook' | 'both') => void;
  objectiveFilter: string;
  onObjectiveFilterChange: (filter: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  platformFilter,
  onPlatformFilterChange,
  objectiveFilter,
  onObjectiveFilterChange,
  onClearFilters,
  hasActiveFilters,
}: SearchAndFiltersProps) {
  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar reportes por título, fecha o métricas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-6 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filtrar por:</span>
        </div>

        {/* Platform Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => onPlatformFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              platformFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => onPlatformFilterChange('instagram')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              platformFilter === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </button>
          <button
            onClick={() => onPlatformFilterChange('facebook')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              platformFilter === 'facebook'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          <button
            onClick={() => onPlatformFilterChange('both')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              platformFilter === 'both'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ambas
          </button>
        </div>

        {/* Objective Filter */}
        <select
          value={objectiveFilter}
          onChange={(e) => onObjectiveFilterChange(e.target.value)}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-50 transition-colors"
        >
          <option value="all">Todos los objetivos</option>
          <option value="brand-awareness">Conocimiento de Marca</option>
          <option value="engagement">Engagement</option>
          <option value="traffic">Tráfico</option>
          <option value="conversions">Conversiones</option>
          <option value="sales">Ventas</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </Button>
        )}

        {/* Filter Count Badge */}
        {hasActiveFilters && (
          <div className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {(searchQuery ? 1 : 0) + (platformFilter !== 'all' ? 1 : 0) + (objectiveFilter !== 'all' ? 1 : 0)} filtros activos
          </div>
        )}
      </div>
    </div>
  );
}
