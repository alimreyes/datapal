'use client';

import { useState } from 'react';
import { Copy, Check, Link2, Loader2, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ShareReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  userId: string;
}

export default function ShareReportModal({
  open,
  onOpenChange,
  reportId,
  userId,
}: ShareReportModalProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLink = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ reportId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al generar link');
        return;
      }

      setShareUrl(data.shareUrl);
    } catch {
      setError('Error de conexión');
    } finally {
      setIsGenerating(false);
    }
  };

  const deactivateLink = async () => {
    setIsDeactivating(true);
    setError(null);

    try {
      const res = await fetch('/api/share', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ reportId }),
      });

      if (res.ok) {
        setShareUrl(null);
        setCopied(false);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al desactivar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsDeactivating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1b16] border-[rgba(251,254,242,0.1)] text-[#FBFEF2] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#FBFEF2] flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#019B77]" />
            Compartir reporte
          </DialogTitle>
          <DialogDescription className="text-[#B6B6B6]">
            Genera un link para que tu cliente pueda ver este reporte sin necesidad de crear una cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!shareUrl ? (
            <Button
              onClick={generateLink}
              disabled={isGenerating}
              className="w-full bg-[#019B77] hover:bg-[#02c494] text-[#FBFEF2]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando link...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Generar link de acceso
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#11120D] border border-[rgba(251,254,242,0.1)] rounded-lg text-sm text-[#B6B6B6] truncate"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className={`border-[#019B77]/50 ${
                    copied
                      ? 'text-green-400 border-green-400/50'
                      : 'text-[#019B77] hover:bg-[#019B77]/10'
                  }`}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-[#B6B6B6]/60">
                Cualquier persona con este link puede ver el reporte. No se requiere cuenta.
              </p>

              <Button
                onClick={deactivateLink}
                disabled={isDeactivating}
                variant="outline"
                size="sm"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {isDeactivating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Desactivando...
                  </>
                ) : (
                  <>
                    <Link2Off className="w-4 h-4 mr-2" />
                    Desactivar link
                  </>
                )}
              </Button>
            </>
          )}

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
