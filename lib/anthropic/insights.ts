import { anthropic, CLAUDE_CONFIG, SYSTEM_PROMPT, CONTENT_PROMPT } from './config';
import { SYSTEM_PROMPTS, ANALYSIS_TEMPLATES } from '@/lib/claude-prompts';
import { Report } from '@/lib/types';

export interface InsightGenerationResult {
  success: boolean;
  insight?: string;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens?: number;
    cacheReadTokens?: number;
  };
}

/**
 * PARCHE PREVENTIVO: Sanitizar respuesta de Claude para eliminar
 * cualquier mencion accidental a la plataforma de reportes.
 * Esto es un safety net por si el prompt no es suficiente.
 */
function sanitizeInsightResponse(text: string): string {
  // Eliminar menciones a DataPal en cualquier variante
  const patterns = [
    /\bDataPal\b/gi,
    /\bData Pal\b/gi,
    /\bdatapal\.com\b/gi,
    /\bla plataforma de reportes\b/gi,
    /\bla herramienta de reportes\b/gi,
    /\bnuestra plataforma\b/gi,
  ];

  let sanitized = text;
  for (const pattern of patterns) {
    sanitized = sanitized.replace(pattern, 'la cuenta');
  }

  return sanitized;
}

/**
 * Extraer nombre del cliente del titulo del reporte.
 * Si no hay titulo util, retorna null.
 */
function extractClientName(report: Report): string | null {
  const title = report.title;
  if (!title || title === 'MI REPORTE' || title === 'Nuevo Reporte' || title.trim() === '') {
    return null;
  }
  return title;
}

/**
 * Generate AI insights for a report using Claude API with prompt caching
 */
export async function generateInsights(
  report: Report,
  insightType: 'metrics' | 'content' | 'question' = 'metrics',
  question?: string
): Promise<InsightGenerationResult> {
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY no esta configurada');
    }

    // Extract key metrics from report
    const metrics = extractKeyMetrics(report);

    // Extract client name from report title
    const clientName = extractClientName(report);

    // Select system prompt based on insight type
    const systemPrompt = selectSystemPrompt(insightType);

    // Create user prompt based on type
    const userPrompt = insightType === 'question' && question
      ? formatQuestionPrompt(metrics, report, question, clientName)
      : formatReportData(metrics, report, insightType, clientName);

    // Call Claude API with prompt caching
    const message = await anthropic.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const rawInsight = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // PARCHE: Sanitizar respuesta para eliminar menciones a la plataforma
    const insight = sanitizeInsightResponse(rawInsight.trim());

    // Extract usage information
    const usage = {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      cacheCreationTokens: message.usage.cache_creation_input_tokens ?? undefined,
      cacheReadTokens: message.usage.cache_read_input_tokens ?? undefined,
    };

    console.log(`Claude API Usage (${insightType}):`, usage);

    return {
      success: true,
      insight,
      usage,
    };
  } catch (error: any) {
    console.error('Error generating insights:', error);
    return {
      success: false,
      error: error.message || 'Error al generar insights',
    };
  }
}

/**
 * Select the appropriate system prompt based on insight type
 */
function selectSystemPrompt(insightType: string): string {
  switch (insightType) {
    case 'content':
      return CONTENT_PROMPT;
    case 'question':
      return SYSTEM_PROMPTS.question;
    default:
      return SYSTEM_PROMPT;
  }
}

/**
 * Extract key metrics from report
 */
function extractKeyMetrics(report: Report) {
  const instagram = report.data?.instagram;
  const facebook = report.data?.facebook;

  return {
    platforms: report.platforms,
    objective: report.objective,
    instagram: instagram ? {
      reach: instagram.reachStats?.total || 0,
      impressions: instagram.impressionsStats?.total || 0,
      interactions: instagram.interactionsStats?.total || 0,
      followers: instagram.followersStats?.total || 0,
      reachTrend: instagram.reachStats?.trend,
      impressionsTrend: instagram.impressionsStats?.trend,
      interactionsTrend: instagram.interactionsStats?.trend,
      engagementRate: instagram.reachStats?.total
        ? ((instagram.interactionsStats?.total || 0) / instagram.reachStats.total * 100).toFixed(2)
        : '0',
      contentCount: instagram.content?.length || 0,
    } : null,
    facebook: facebook ? {
      reach: facebook.reachStats?.total || 0,
      impressions: facebook.impressionsStats?.total || 0,
      interactions: facebook.interactionsStats?.total || 0,
      followers: facebook.followersStats?.total || 0,
      reachTrend: facebook.reachStats?.trend,
      impressionsTrend: facebook.impressionsStats?.trend,
      interactionsTrend: facebook.interactionsStats?.trend,
      engagementRate: facebook.reachStats?.total
        ? ((facebook.interactionsStats?.total || 0) / facebook.reachStats.total * 100).toFixed(2)
        : '0',
      contentCount: facebook.content?.length || 0,
    } : null,
  };
}

/**
 * Format report data for metrics-focused or content-focused insights.
 * Includes client name context to prevent platform name leakage.
 */
function formatReportData(metrics: any, report: Report, insightType: string, clientName: string | null): string {
  const platformNames = metrics.platforms
    ?.map((p: string) => p === 'instagram' ? 'Instagram' : p === 'facebook' ? 'Facebook' : p)
    .join(' + ') || 'redes sociales';

  // Contexto del cliente - CRITICO para evitar confusion con la plataforma
  const clientContext = clientName
    ? `CLIENTE: "${clientName}". Todos tus insights deben referirse a esta marca/cuenta, NO a la plataforma de reportes.\n\n`
    : `IMPORTANTE: Analiza los datos de la cuenta del cliente. NO menciones ninguna plataforma de reportes.\n\n`;

  if (insightType === 'content') {
    // Content-focused prompt
    let prompt = clientContext;
    prompt += `Analiza el contenido publicado en ${platformNames}.\n`;

    const igContent = report.data?.instagram?.content;
    if (igContent && igContent.length > 0) {
      const contentData = igContent.slice(0, 10).map((c: any) =>
        `- ${c.postType}: alcance ${c.reach}, likes ${c.likes}, comentarios ${c.comments}, compartidos ${c.shares}`
      ).join('\n');
      prompt += `\nDatos de contenido:\n${contentData}`;
    }

    const fbContent = report.data?.facebook?.content;
    if (fbContent && fbContent.length > 0) {
      const contentData = fbContent.slice(0, 10).map((c: any) =>
        `- ${c.postType}: alcance ${c.reach}, likes ${c.likes}, comentarios ${c.comments}, compartidos ${c.shares}`
      ).join('\n');
      prompt += `\nContenido Facebook:\n${contentData}`;
    }

    prompt += `\n\nTotal interacciones: ${metrics.instagram?.interactions || 0}${metrics.facebook ? ` + ${metrics.facebook.interactions}` : ''}`;
    prompt += `\nTotal publicaciones: ${metrics.instagram?.contentCount || 0}${metrics.facebook ? ` + ${metrics.facebook.contentCount}` : ''}`;
    prompt += '\n\nResponde en castellano. Sigue la estructura obligatoria del system prompt: que ocurrio + por que + accion. Termina con ACCIONES PRIORITARIAS. Sin emojis. Sin asteriscos dobles ni almohadillas. Usa MAYUSCULAS para secciones. Cero frases de relleno.';
    return prompt;
  }

  // Metrics-focused prompt (default)
  let prompt = clientContext;
  prompt += ANALYSIS_TEMPLATES.detailed(platformNames, {
    ...(metrics.instagram ? { instagram: metrics.instagram } : {}),
    ...(metrics.facebook ? { facebook: metrics.facebook } : {}),
  });

  const objectiveLabels: Record<string, string> = {
    analysis: 'Analisis de resultados — enfocate en patrones y oportunidades',
    improvements: 'Evidenciar mejoras — destaca crecimiento y logros vs periodo anterior',
    monthly_report: 'Reporte mensual — da un resumen ejecutivo completo del periodo',
  };

  prompt += `\n\nObjetivo del reporte: ${objectiveLabels[report.objective] || report.objective}`;
  prompt += '\n\nResponde en castellano. Sigue la estructura obligatoria del system prompt: que ocurrio + por que + implicacion + accion. Termina con ACCIONES PRIORITARIAS (max 5, ejecutables en 30 dias, por impacto). Sin emojis. Sin asteriscos dobles ni almohadillas. Usa MAYUSCULAS para secciones. Cero frases de relleno.';

  return prompt;
}

/**
 * Format a user question prompt with report context.
 * Includes client name to prevent platform name leakage.
 */
function formatQuestionPrompt(metrics: any, report: Report, question: string, clientName: string | null): string {
  const clientContext = clientName
    ? `CLIENTE: "${clientName}". Tu respuesta debe referirse a esta marca/cuenta.\n\n`
    : `IMPORTANTE: Responde sobre la cuenta del cliente, NO menciones plataformas de reportes.\n\n`;

  let context = clientContext;
  context += `Datos del reporte:\n${JSON.stringify(metrics, null, 2)}`;

  const igContent = report.data?.instagram?.content;
  if (igContent && igContent.length > 0) {
    const topContent = igContent.slice(0, 5).map((c: any) =>
      `- ${c.postType}: ${c.reach} alcance, ${c.likes + c.comments + c.shares} interacciones`
    ).join('\n');
    context += `\n\nTop contenido:\n${topContent}`;
  }

  return `${context}\n\nPregunta del usuario: ${question}\n\nResponde en castellano. Sin emojis. Sin asteriscos dobles ni almohadillas. Usa MAYUSCULAS para enfatizar. Cero frases de relleno. Cierra con una ACCION CONCRETA.`;
}
