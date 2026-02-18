import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Report, BrandingConfig } from './types';
import { DEFAULT_BRANDING } from './types';

/**
 * Convierte un color CSS moderno (lab, oklch, oklab) a rgb usando un canvas temporal.
 * html2canvas no soporta lab()/oklch() que Tailwind CSS 4 genera.
 */
function resolveColor(colorValue: string): string {
  if (
    !colorValue ||
    !colorValue.includes('lab(') &&
    !colorValue.includes('oklch(') &&
    !colorValue.includes('oklab(') &&
    !colorValue.includes('lch(')
  ) {
    return colorValue;
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'transparent';

    ctx.fillStyle = colorValue;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;

    if (a === 0) return 'transparent';
    if (a < 255) return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return 'transparent';
  }
}

/**
 * Sanitiza los estilos de un elemento clonado, reemplazando colores CSS modernos
 * (lab, oklch) por equivalentes rgb que html2canvas pueda parsear.
 */
function sanitizeColorsForHtml2Canvas(clonedDoc: Document) {
  const clonedElement = clonedDoc.getElementById('dashboard-content');
  if (!clonedElement) return;

  const colorProps = [
    'color',
    'background-color',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
    'text-decoration-color',
    'fill',
    'stroke',
  ];

  const allElements = clonedElement.querySelectorAll('*');
  const elementsToProcess = [clonedElement, ...Array.from(allElements)] as HTMLElement[];

  for (const el of elementsToProcess) {
    try {
      const computed = clonedDoc.defaultView?.getComputedStyle(el);
      if (!computed) continue;

      for (const prop of colorProps) {
        try {
          const val = computed.getPropertyValue(prop);
          if (val && (val.includes('lab(') || val.includes('oklch(') || val.includes('oklab(') || val.includes('lch('))) {
            el.style.setProperty(prop, resolveColor(val), 'important');
          }
        } catch {
          // Skip individual property errors
        }
      }

      // Handle background (can contain gradients with lab colors)
      try {
        const bg = computed.getPropertyValue('background');
        if (bg && (bg.includes('lab(') || bg.includes('oklch('))) {
          const bgColor = computed.getPropertyValue('background-color');
          if (bgColor) {
            el.style.setProperty('background', resolveColor(bgColor), 'important');
          }
        }
      } catch {
        // Skip
      }
    } catch {
      // Skip problematic elements
    }
  }
}

/**
 * Captura un elemento del DOM como canvas con configuración optimizada
 * para el tema oscuro de DataPal y charts de Recharts.
 * Sanitiza colores lab()/oklch() de Tailwind CSS 4 que html2canvas no soporta.
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  const options: Record<string, unknown> = {
    scale: 3, // Alta resolución para PDFs nítidos
    useCORS: true,
    logging: false,
    backgroundColor: '#11120D',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    foreignObjectRendering: false,
    ignoreElements: (el: HTMLElement) => {
      return (
        el.tagName === 'IFRAME' ||
        el.tagName === 'SCRIPT' ||
        el.classList?.contains('pdf-ignore')
      );
    },
    onclone: (clonedDoc: Document) => {
      sanitizeColorsForHtml2Canvas(clonedDoc);
    },
  };

  return html2canvas(element, options as any);
}

/**
 * Convierte un color hex (#RRGGBB) a un array [r, g, b]
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
}

/**
 * Agrega un header profesional al PDF con branding personalizable
 */
function addPDFHeader(pdf: jsPDF, title: string, pageLabel: string, branding?: BrandingConfig) {
  const brand = branding || DEFAULT_BRANDING;
  const [acR, acG, acB] = hexToRgb(brand.brandColor);
  const pdfWidth = pdf.internal.pageSize.getWidth();

  // Fondo del header
  pdf.setFillColor(17, 18, 13); // #11120D
  pdf.rect(0, 0, pdfWidth, 20, 'F');

  // Línea accent debajo del header (usa brand color)
  pdf.setDrawColor(acR, acG, acB);
  pdf.setLineWidth(0.6);
  pdf.line(10, 20, pdfWidth - 10, 20);

  // Company branding (izquierda superior)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(acR, acG, acB);
  pdf.text(brand.companyName || 'DataPal', 10, 8);

  // Título del reporte (izquierda inferior)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(251, 254, 242); // #FBFEF2
  pdf.text(title, 10, 16);

  // Label de página (derecha superior)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(182, 182, 182); // #B6B6B6
  pdf.text(pageLabel, pdfWidth - 10, 8, { align: 'right' });

  // Fecha (derecha inferior del header)
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  pdf.setFontSize(7);
  pdf.setTextColor(182, 182, 182);
  pdf.text(dateStr, pdfWidth - 10, 16, { align: 'right' });
}

/**
 * Agrega un footer al PDF con branding personalizable
 */
function addPDFFooter(pdf: jsPDF, branding?: BrandingConfig) {
  const brand = branding || DEFAULT_BRANDING;
  const [acR, acG, acB] = hexToRgb(brand.brandColor);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Línea separadora (usa brand color)
  pdf.setDrawColor(acR, acG, acB);
  pdf.setLineWidth(0.3);
  pdf.line(10, pdfHeight - 12, pdfWidth - 10, pdfHeight - 12);

  // Fecha y hora de generación
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(182, 182, 182);
  pdf.text(`Generado el ${dateStr} a las ${timeStr}`, 10, pdfHeight - 7);

  // Branding footer (usa company name)
  const footerBrand = brand.companyName !== 'DataPal'
    ? `Generado con ${brand.companyName} · Powered by DataPal`
    : 'Generado con DataPal | datapal.vercel.app';
  pdf.setTextColor(acR, acG, acB);
  pdf.text(footerBrand, pdfWidth - 10, pdfHeight - 7, {
    align: 'right',
  });
}

/**
 * Callback para reportar progreso durante la exportación
 */
export interface ExportProgress {
  step: number;
  totalSteps: number;
  message: string;
}

/**
 * Exporta el reporte completo a PDF capturando ambas hojas.
 *
 * @param reportTitle - Título del reporte para el nombre del archivo y headers
 * @param onPageChange - Callback para cambiar la página visible del reporte
 * @param currentPage - Página actualmente visible (0 o 1)
 * @param totalPages - Total de páginas del reporte (default 2)
 * @param options - Opciones adicionales (progreso, etc.)
 */
export async function exportReportToPDF(
  reportTitle: string,
  onPageChange: (page: number) => void,
  currentPage: number,
  totalPages: number = 2,
  options?: {
    onProgress?: (progress: ExportProgress) => void;
    branding?: BrandingConfig;
  },
): Promise<boolean> {
  const originalPage = currentPage;
  const onProgress = options?.onProgress;
  const branding = options?.branding;
  const totalSteps = totalPages + 2; // init + pages + save

  try {
    onProgress?.({ step: 0, totalSteps, message: 'Preparando exportación...' });

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const headerHeight = 24; // mm reservados para header
    const footerHeight = 15; // mm reservados para footer
    const contentHeight = pdfHeight - headerHeight - footerHeight;
    const margin = 5; // mm de margen lateral

    // Capturar cada página del reporte
    for (let page = 0; page < totalPages; page++) {
      onProgress?.({
        step: page + 1,
        totalSteps,
        message: `Capturando hoja ${page + 1} de ${totalPages}...`,
      });

      // Cambiar a la página correspondiente
      onPageChange(page);

      // Esperar a que React renderice la nueva página y los charts se dibujen
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) {
        throw new Error('No se encontró el contenido del reporte');
      }

      // Capturar el contenido actual
      const canvas = await captureElement(dashboardElement);

      // Agregar nueva página si no es la primera
      if (page > 0) {
        pdf.addPage();
      }

      // Fondo oscuro completo
      pdf.setFillColor(17, 18, 13);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Header
      addPDFHeader(pdf, reportTitle, `Hoja ${page + 1} de ${totalPages}`, branding);

      // Calcular dimensiones de la imagen para que quepa en el área de contenido
      const imgData = canvas.toDataURL('image/png');
      const imgAspect = canvas.width / canvas.height;
      const availableWidth = pdfWidth - margin * 2;

      let imgWidth = availableWidth;
      let imgHeight = imgWidth / imgAspect;

      // Si la imagen es muy alta, ajustar por altura
      if (imgHeight > contentHeight) {
        imgHeight = contentHeight;
        imgWidth = imgHeight * imgAspect;
      }

      // Centrar la imagen horizontalmente
      const imgX = (pdfWidth - imgWidth) / 2;
      const imgY = headerHeight;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

      // Footer
      addPDFFooter(pdf, branding);
    }

    onProgress?.({
      step: totalSteps - 1,
      totalSteps,
      message: 'Generando archivo PDF...',
    });

    // Metadatos del PDF
    const authorName = branding?.companyName || 'DataPal';
    pdf.setProperties({
      title: reportTitle,
      subject: 'Reporte de Analytics de Redes Sociales',
      author: authorName,
      keywords: 'analytics, redes sociales, instagram, facebook, linkedin, tiktok, datapal',
      creator: `${authorName} - Reportes Automatizados (Powered by DataPal)`,
    });

    // Generar nombre de archivo seguro
    const safeFileName = reportTitle
      .replace(/[^a-z0-9áéíóúñü\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .substring(0, 50);

    const fileName = `${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Descargar
    pdf.save(fileName);

    // Restaurar la página original
    onPageChange(originalPage);

    onProgress?.({
      step: totalSteps,
      totalSteps,
      message: '¡PDF descargado exitosamente!',
    });

    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);

    // Restaurar la página original en caso de error
    onPageChange(originalPage);

    throw error;
  }
}

/**
 * Exporta el contenido visible del dashboard a PDF (versión simple, una sola página)
 * Mantiene compatibilidad con la función anterior
 */
export async function exportDashboardToPDF(
  reportTitle: string = 'Reporte DataPal',
): Promise<boolean> {
  try {
    const dashboardElement = document.getElementById('dashboard-content');

    if (!dashboardElement) {
      throw new Error('No se encontró el elemento del dashboard');
    }

    const canvas = await captureElement(dashboardElement);

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Fondo oscuro
    pdf.setFillColor(17, 18, 13);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    // Header y Footer
    addPDFHeader(pdf, reportTitle, 'Hoja 1 de 1');
    addPDFFooter(pdf);

    // Imagen del contenido
    const imgData = canvas.toDataURL('image/png');
    const imgAspect = canvas.width / canvas.height;
    const margin = 5;
    const headerHeight = 24;
    const footerHeight = 15;
    const contentHeight = pdfHeight - headerHeight - footerHeight;
    const availableWidth = pdfWidth - margin * 2;

    let imgWidth = availableWidth;
    let imgHeight = imgWidth / imgAspect;

    if (imgHeight > contentHeight) {
      imgHeight = contentHeight;
      imgWidth = imgHeight * imgAspect;
    }

    const imgX = (pdfWidth - imgWidth) / 2;
    pdf.addImage(imgData, 'PNG', imgX, headerHeight, imgWidth, imgHeight);

    // Metadatos
    pdf.setProperties({
      title: reportTitle,
      subject: 'Reporte de Analytics de Redes Sociales',
      author: 'DataPal',
      keywords: 'analytics, redes sociales, datapal',
      creator: 'DataPal - Reportes Automatizados',
    });

    const safeFileName = reportTitle
      .replace(/[^a-z0-9áéíóúñü\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .substring(0, 50);

    pdf.save(`${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`);

    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw error;
  }
}

/**
 * Exporta un reporte desde el dashboard abriendo la vista del reporte.
 * Mantiene compatibilidad con el dashboard principal.
 */
export async function exportToPDF(report: Report, reportId: string) {
  try {
    const reportWindow = window.open(`/report/${reportId}`, '_blank');

    if (!reportWindow) {
      throw new Error('No se pudo abrir la ventana del reporte. Por favor, permite las ventanas emergentes.');
    }

    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw error;
  }
}
