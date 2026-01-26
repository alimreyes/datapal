import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/lib/anthropic/insights';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportData } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Generate insights using Claude API
    const result = await generateInsights(reportData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Error al generar insights' },
        { status: 500 }
      );
    }

    // Return the insight WITHOUT saving to Firestore
    // The client will save it with proper authentication
    return NextResponse.json({
      success: true,
      insight: result.insight,
      usage: result.usage,
    });
  } catch (error: any) {
    console.error('Error in insights API:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}