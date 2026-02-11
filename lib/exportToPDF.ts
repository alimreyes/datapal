import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Report } from './types';

/**
 * Captura un elemento del DOM como canvas con configuración optimizada
 * para el tema oscuro de DataPal y charts de Recharts
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  const options: Record<string, unknown> = {
    scale: 2,
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
  };

  return html2canvas(element, options as any);
}

/**
 * Agrega un header con branding DataPal a una página del PDF
 */
function addPDFHeader(pdf: jsPDF, title: string, pageLabel: string) {
  const pdfWidth = pdf.internal.pageSize.getWidth();

  // Fondo del header
  pdf.setFillColor(17, 18, 13); // #11120D
  pdf.rect(0, 0, pdfWidth, 18, 'F');

  // Línea accent debajo del header
  pdf.setDrawColor(1, 155, 119); // #019B77
  pdf.setLineWidth(0.5);
  pdf.line(10, 18, pdfWidth - 10, 18);

  // Título del reporte
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(251, 254, 242); // #FBFEF2
  pdf.text(title, 10, 10);

  // Label de página (ej: "Hoja 1 de 2")
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(182, 182, 182); // #B6B6B6
  pdf.text(pageLabel, pdfWidth - 10, 10, { align: 'right' });

  // "DataPal" branding
  pdf.setFontSize(8);
  pdf.setTextColor(1, 155, 119); // #019B77
  pdf.text('DataPal', pdfWidth - 10, 15, { align: 'right' });
}

/**
 * Agrega un footer a una página del PDF
 */
function addPDFFooter(pdf: jsPDF) {
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Línea separadora
  pdf.setDrawColor(1, 155, 119); // #019B77
  pdf.setLineWidth(0.3);
  pdf.line(10, pdfHeight - 12, pdfWidth - 10, pdfHeight - 12);

  // Fecha de generación
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(182, 182, 182);
  pdf.text(`Generado el ${dateStr}`, 10, pdfHeight - 7);

  // Branding
  pdf.setTextColor(1, 155, 119);
  pdf.text('Generado con DataPal | datapal.vercel.app', pdfWidth - 10, pdfHeight - 7, {
    align: 'right',
  });
}

/**
 * Exporta el reporte completo a PDF capturando ambas hojas.
 *
 * @param reportTitle - Título del reporte para el nombre del archivo y headers
 * @param onPageChange - Callback para cambiar la página visible del reporte
 * @param currentPage - Página actualmente visible (0 o 1)
 * @param totalPages - Total de páginas del reporte (default 2)
 */
export async function exportReportToPDF(
  reportTitle: string,
  onPageChange: (page: number) => void,
  currentPage: number,
  totalPages: number = 2,
): Promise<boolean> {
  const originalPage = currentPage;

  try {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const headerHeight = 22; // mm reservados para header
    const footerHeight = 15; // mm reservados para footer
    const contentHeight = pdfHeight - headerHeight - footerHeight;
    const margin = 6; // mm de margen lateral

    // Capturar cada página del reporte
    for (let page = 0; page < totalPages; page++) {
      // Cambiar a la página correspondiente
      onPageChange(page);

      // Esperar a que React renderice la nueva página y los charts se dibujen
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      addPDFHeader(pdf, reportTitle, `Hoja ${page + 1} de ${totalPages}`);

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
      const imgY = headerHeight + 2;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);

      // Footer
      addPDFFooter(pdf);
    }

    // Metadatos del PDF
    pdf.setProperties({
      title: reportTitle,
      subject: 'Reporte de Analytics de Redes Sociales',
      author: 'DataPal',
      keywords: 'analytics, redes sociales, instagram, facebook, linkedin, tiktok, datapal',
      creator: 'DataPal - Reportes Automatizados',
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
    const margin = 6;
    const headerHeight = 22;
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
    pdf.addImage(imgData, 'PNG', imgX, headerHeight + 2, imgWidth, imgHeight);

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
