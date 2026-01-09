'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  description?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
}

export function FileUpload({
  label,
  description,
  file,
  onFileChange,
  accept = '.csv',
  maxSize = 5,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!file.name.endsWith('.csv')) {
      setError('Solo se permiten archivos CSV');
      return false;
    }

    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`El archivo debe ser menor a ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFile = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      onFileChange(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {!file ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-white',
            error && 'border-red-500 bg-red-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(`file-${label}`)?.click()}
        >
          <input
            id={`file-${label}`}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center text-center">
            <Upload className={cn(
              'h-8 w-8 mb-2',
              isDragging ? 'text-blue-500' : 'text-gray-400'
            )} />
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu archivo CSV aquí'}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              o haz click para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}