import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportData } = body;

    // DEBUG: Check API Key
    console.log('=== DEBUGGING API KEY ===');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length);
    console.log('API Key first 20 chars:', process.env.GEMINI_API_KEY?.substring(0, 20));
    console.log('========================');

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured in server' },
        { status: 500 }
      );
    }

    // Prepare data summary for Gemini
    const dataSummary = prepareDataSummary(reportData);

    const prompt = `
Eres un experto en análisis de redes sociales. Analiza estos datos y genera insights profesionales en español.

DATOS:
${dataSummary}

Genera un análisis estructurado con:

1. RESUMEN EJECUTIVO (2-3 líneas)
- Panorama general del desempeño

2. PUNTOS CLAVE (3-4 puntos)
- Métricas destacadas
- Tendencias importantes
- Comparaciones relevantes

3. FORTALEZAS (2-3 puntos)
- Qué está funcionando bien
- Mejores prácticas identificadas

4. OPORTUNIDADES DE MEJORA (2-3 puntos)
- Áreas con potencial de crecimiento
- Recomendaciones específicas

5. RECOMENDACIONES ESTRATÉGICAS (3-4 acciones)
- Pasos concretos a seguir
- Prioridades sugeridas

Sé específico, usa números concretos de los datos, y mantén un tono profesional pero accesible.
`;

    // Generate insights with Gemini
    // Try different models until one works
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
    ];
    
    let insights = '';
    let lastError = null;
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        insights = response.text();
        
        console.log(`Success with model: ${modelName}`);
        break; // Success! Exit the loop
      } catch (error: any) {
        console.error(`Failed with ${modelName}:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }
    
    // If all models failed
    if (!insights && lastError) {
      throw lastError;
    }

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

function prepareDataSummary(reportData: any): string {
  const summary: string[] = [];

  // Instagram data
  if (reportData.instagram) {
    summary.push('INSTAGRAM:');
    if (reportData.instagram.reachStats) {
      summary.push(`- Alcance: ${reportData.instagram.reachStats.total} (promedio: ${reportData.instagram.reachStats.average}, máximo: ${reportData.instagram.reachStats.max})`);
    }
    if (reportData.instagram.impressionsStats) {
      summary.push(`- Visualizaciones: ${reportData.instagram.impressionsStats.total} (promedio: ${reportData.instagram.impressionsStats.average})`);
    }
    if (reportData.instagram.interactionsStats) {
      summary.push(`- Interacciones: ${reportData.instagram.interactionsStats.total} (promedio: ${reportData.instagram.interactionsStats.average})`);
    }
    if (reportData.instagram.content && reportData.instagram.content.length > 0) {
      summary.push(`- Publicaciones: ${reportData.instagram.content.length}`);
      
      // Top post
      const topPost = reportData.instagram.content.reduce((max: any, post: any) => 
        post.reach > max.reach ? post : max
      );
      summary.push(`- Post más exitoso: ${topPost.reach} alcance, ${topPost.likes} likes, ${topPost.comments} comentarios`);
    }
  }

  // Facebook data
  if (reportData.facebook) {
    summary.push('\nFACEBOOK:');
    if (reportData.facebook.reachStats) {
      summary.push(`- Espectadores: ${reportData.facebook.reachStats.total} (promedio: ${reportData.facebook.reachStats.average}, máximo: ${reportData.facebook.reachStats.max})`);
    }
    if (reportData.facebook.impressionsStats) {
      summary.push(`- Visualizaciones: ${reportData.facebook.impressionsStats.total} (promedio: ${reportData.facebook.impressionsStats.average})`);
    }
    if (reportData.facebook.interactionsStats) {
      summary.push(`- Interacciones: ${reportData.facebook.interactionsStats.total} (promedio: ${reportData.facebook.interactionsStats.average})`);
    }
    if (reportData.facebook.content && reportData.facebook.content.length > 0) {
      summary.push(`- Publicaciones: ${reportData.facebook.content.length}`);
      
      // Top post
      const topPost = reportData.facebook.content.reduce((max: any, post: any) => 
        post.reach > max.reach ? post : max
      );
      summary.push(`- Post más exitoso: ${topPost.reach} alcance, ${topPost.likes} likes, ${topPost.comments} comentarios`);
    }
  }

  // Overall engagement rate
  const totalReach = (reportData.instagram?.reachStats?.total || 0) + (reportData.facebook?.reachStats?.total || 0);
  const totalInteractions = (reportData.instagram?.interactionsStats?.total || 0) + (reportData.facebook?.interactionsStats?.total || 0);
  
  if (totalReach > 0) {
    const engagementRate = ((totalInteractions / totalReach) * 100).toFixed(2);
    summary.push(`\nENGAGEMENT RATE GENERAL: ${engagementRate}%`);
  }

  return summary.join('\n');
}