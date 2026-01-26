// lib/utils/exportPDF.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { Report } from './types';

/**
 * Exporta un reporte a PDF desde la página principal
 * Abre el reporte en una nueva ventana y genera el PDF
 * @param report - El reporte a exportar
 * @param reportId - ID del reporte
 */
export async function exportToPDF(report: Report, reportId: string) {
  try {
    // Abrir el reporte en una nueva ventana
    const reportWindow = window.open(`/report/${reportId}`, '_blank');

    if (!reportWindow) {
      throw new Error('No se pudo abrir la ventana del reporte. Por favor, permite las ventanas emergentes.');
    }

    // Esperar a que la ventana cargue y luego exportar
    reportWindow.addEventListener('load', () => {
      setTimeout(() => {
        // Llamar a la función de exportación en la ventana del reporte
        if (reportWindow.document.getElementById('export-pdf-button')) {
          reportWindow.document.getElementById('export-pdf-button')?.click();
        }
      }, 2000);
    });

    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    throw error;
  }
}

/**
 * Exporta el contenido del dashboard a PDF
 * @param reportTitle - Título del reporte para el nombre del archivo
 */
export async function exportDashboardToPDF(reportTitle: string = 'Reporte DataPal') {
  try {
    // Obtener el elemento del dashboard
    const dashboardElement = document.getElementById('dashboard-content');
    
    if (!dashboardElement) {
      throw new Error('No se encontró el elemento del dashboard');
    }

    // Mostrar mensaje de loading
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
    loadingToast.innerHTML = `
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Generando PDF...</span>
    `;
    document.body.appendChild(loadingToast);

    // Capturar el contenido como imagen con alta calidad
    const html2canvasOptions: any = {
      scale: 2, // Mayor calidad
      useCORS: true,
      logging: false, // Desactivar logging para evitar spam
      backgroundColor: '#f9fafb',
      windowWidth: dashboardElement.scrollWidth,
      windowHeight: dashboardElement.scrollHeight,
      ignoreElements: (element: HTMLElement) => {
        // Ignorar elementos que puedan causar problemas
        return element.tagName === 'IFRAME' || element.tagName === 'SCRIPT';
      },
      onclone: (clonedDoc: Document) => {
        const clonedElement = clonedDoc.getElementById('dashboard-content');
        if (clonedElement) {
          // Aplicar estilos computados de forma segura
          const allElements = clonedElement.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            const original = document.getElementById(el.id) ||
                           document.querySelector(`[data-id="${el.getAttribute('data-id')}"]`);

            if (original) {
              try {
                const computedStyle = window.getComputedStyle(original as HTMLElement);

                // Copiar solo propiedades esenciales de forma segura
                const safeProps = ['backgroundColor', 'color', 'fontSize', 'fontWeight'];
                safeProps.forEach(prop => {
                  try {
                    const value = computedStyle.getPropertyValue(prop);
                    if (value && !value.includes('lab(') && !value.includes('oklch(')) {
                      el.style.setProperty(prop, value, 'important');
                    }
                  } catch (e) {
                    // Ignorar errores de propiedades individuales
                  }
                });
              } catch (err) {
                // Ignorar elementos problemáticos
              }
            }
          }
        }
      },
    };

    const canvas = await html2canvas(dashboardElement, html2canvasOptions);

    // Crear PDF
    const imgData = canvas.toDataURL('image/png');
    
    // Dimensiones A4 en mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calcular dimensiones de la imagen para ajustar al PDF
    const imgWidth = pdfWidth - 20; // Márgenes de 10mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Crear PDF en orientación que mejor se ajuste
    const orientation = imgHeight > pdfHeight ? 'portrait' : 'portrait';
    const pdf = new jsPDF(orientation, 'mm', 'a4');
    
    // Si la imagen es más alta que una página, dividir en múltiples páginas
    let heightLeft = imgHeight;
    let position = 10; // Margen superior
    
    // Agregar primera página
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);
    
    // Agregar páginas adicionales si es necesario
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }

    // Agregar metadatos al PDF
    pdf.setProperties({
      title: reportTitle,
      subject: 'Reporte de Analytics - Instagram y Facebook',
      author: 'DataPal',
      keywords: 'analytics, instagram, facebook, redes sociales',
      creator: 'DataPal - Plataforma de Analytics con IA',
    });

    // Generar nombre de archivo seguro
    const safeFileName = reportTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50);
    
    const fileName = `${safeFileName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Descargar el PDF
    pdf.save(fileName);

    // Remover loading toast
    document.body.removeChild(loadingToast);

    // Mostrar mensaje de éxito
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
    successToast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>PDF descargado exitosamente</span>
    `;
    document.body.appendChild(successToast);
    
    // Remover mensaje de éxito después de 3 segundos
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 3000);

    return true;
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    
    // Mostrar mensaje de error
    const errorToast = document.createElement('div');
    errorToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
    errorToast.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <span>Error al generar PDF</span>
    `;
    document.body.appendChild(errorToast);
    
    setTimeout(() => {
      if (document.body.contains(errorToast)) {
        document.body.removeChild(errorToast);
      }
    }, 3000);

    return false;
  }
}