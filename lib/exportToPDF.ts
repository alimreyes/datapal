import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report } from '@/lib/types';
import { formatNumber, formatDate } from './parsers/metaParser';

export const exportToPDF = async (report: Report, reportId: string) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Helper to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper to add text with wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      const lineHeight = fontSize * 0.4;
      
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 3; // Extra spacing after text block
    };

    // Cover Page
    pdf.setFillColor(59, 130, 246); // Blue
    pdf.rect(0, 0, pageWidth, 80, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Reporte DataPal', pageWidth / 2, 40, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    const objectiveLabels: any = {
      analysis: 'Análisis de Resultados',
      improvements: 'Evidenciar Mejoras Realizadas',
      monthly_report: 'Crear Reporte del Mes',
    };
    pdf.text(objectiveLabels[report.objective] || report.objective, pageWidth / 2, 55, { align: 'center' });
    
    pdf.setFontSize(12);
    const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    pdf.text(date, pageWidth / 2, 65, { align: 'center' });
    
    yPosition = 100;
    pdf.setTextColor(0, 0, 0);

    // Executive Summary
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resumen Ejecutivo', margin, yPosition);
    yPosition += 10;
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Calculate totals
    const igTotalReach = report.data?.instagram?.reachStats?.total || 0;
    const fbTotalReach = report.data?.facebook?.reachStats?.total || 0;
    const totalReach = igTotalReach + fbTotalReach;
    
    const igTotalImpressions = report.data?.instagram?.impressionsStats?.total || 0;
    const fbTotalImpressions = report.data?.facebook?.impressionsStats?.total || 0;
    const totalImpressions = igTotalImpressions + fbTotalImpressions;
    
    const igTotalInteractions = report.data?.instagram?.interactionsStats?.total || 0;
    const fbTotalInteractions = report.data?.facebook?.interactionsStats?.total || 0;
    const totalInteractions = igTotalInteractions + fbTotalInteractions;
    
    const engagementRate = totalReach > 0 
      ? ((totalInteractions / totalReach) * 100).toFixed(2)
      : '0.00';

    addText(`Alcance Total: ${formatNumber(totalReach)} personas`, 12, true);
    addText(`Visualizaciones: ${formatNumber(totalImpressions)}`, 12, true);
    addText(`Interacciones: ${formatNumber(totalInteractions)}`, 12, true);
    addText(`Engagement Rate: ${engagementRate}%`, 12, true);
    
    yPosition += 5;

    // Platform Breakdown
    if (report.data?.instagram) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📸 Instagram', margin, yPosition);
      yPosition += 8;
      
      addText(`Alcance: ${formatNumber(igTotalReach)}`);
      addText(`Visualizaciones: ${formatNumber(igTotalImpressions)}`);
      addText(`Interacciones: ${formatNumber(igTotalInteractions)}`);
      
      if (report.data.instagram.content) {
        addText(`Publicaciones: ${report.data.instagram.content.length}`);
      }
      
      yPosition += 5;
    }

    if (report.data?.facebook) {
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('👍 Facebook', margin, yPosition);
      yPosition += 8;
      
      addText(`Espectadores: ${formatNumber(fbTotalReach)}`);
      addText(`Visualizaciones: ${formatNumber(fbTotalImpressions)}`);
      addText(`Interacciones: ${formatNumber(fbTotalInteractions)}`);
      
      if (report.data.facebook.content) {
        addText(`Publicaciones: ${report.data.facebook.content.length}`);
      }
      
      yPosition += 5;
    }

    // AI Insights
    if (report.aiInsights) {
      checkPageBreak(40);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✨ Insights con IA', margin, yPosition);
      yPosition += 10;
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      // Add AI insights with proper formatting
      const insightsLines: string[] = report.aiInsights.split('\n').filter((line: string) => line.trim());
      insightsLines.forEach((line: string) => {
        if (line.match(/^\d+\./)) {
          // Section header
          checkPageBreak(15);
          yPosition += 3;
          addText(line, 12, true);
        } else if (line.startsWith('-')) {
          // Bullet point
          addText(line, 10, false);
        } else if (line.trim()) {
          // Regular text
          addText(line, 10, false);
        }
      });
    }

    // Footer on last page
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generado por DataPal - ${date}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save PDF
    pdf.save(`DataPal_Reporte_${reportId}.pdf`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};