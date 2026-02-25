import { anthropic, CLAUDE_CONFIG, SYSTEM_PROMPT, CONTENT_PROMPT } from './config';
import { ANALYSIS_TEMPLATES } from '@/lib/claude-prompts';
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
 * Generate AI insights for a report using Claude API with prompt caching
 */
export async function generateInsights(report: Report): Promise<InsightGenerationResult> {
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY no está configurada');
    }

    // Extract key metrics from report
    const metrics = extractKeyMetrics(report);

    // Select system prompt based on context
    const systemPrompt = selectSystemPrompt(report);

    // Create user prompt with report data using templates
    const userPrompt = formatReportData(metrics, report);

    // Call Claude API with prompt caching
    const message = await anthropic.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // Enable prompt caching
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
    const insight = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Extract usage information
    const usage = {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
      cacheCreationTokens: message.usage.cache_creation_input_tokens ?? undefined,
      cacheReadTokens: message.usage.cache_read_input_tokens ?? undefined,
    };

    console.log('Claude API Usage:', usage);

    return {
      success: true,
      insight: insight.trim(),
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
 * Select the appropriate system prompt based on report context
 */
function selectSystemPrompt(report: Report): string {
  // Use content-specific prompt when analyzing content data
  if (report.objective === 'monthly_report' && report.data?.instagram?.content?.length) {
    return CONTENT_PROMPT;
  }
  // Default: general analysis prompt
  return SYSTEM_PROMPT;
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
 * Format report data for Claude using analysis templates
 */
function formatReportData(metrics: any, report: Report): string {
  // Determine platforms string for templates
  const platformNames = metrics.platforms
    ?.map((p: string) => p === 'instagram' ? 'Instagram' : p === 'facebook' ? 'Facebook' : p)
    .join(' + ') || 'redes sociales';

  // Use the detailed analysis template with actual metrics
  let prompt = ANALYSIS_TEMPLATES.detailed(platformNames, {
    ...(metrics.instagram ? { instagram: metrics.instagram } : {}),
    ...(metrics.facebook ? { facebook: metrics.facebook } : {}),
  });

  // Add objective context
  const objectiveLabels: Record<string, string> = {
    analysis: 'Análisis de resultados — enfócate en patrones y oportunidades',
    improvements: 'Evidenciar mejoras — destaca crecimiento y logros vs período anterior',
    monthly_report: 'Reporte mensual — da un resumen ejecutivo completo del período',
  };

  prompt += `\n\nObjetivo del reporte: ${objectiveLabels[report.objective] || report.objective}`;

  // Add content data context if available
  const igContent = report.data?.instagram?.content;
  if (igContent && igContent.length > 0) {
    const topContent = igContent.slice(0, 5).map((c: any) =>
      `- ${c.postType}: ${c.reach} alcance, ${c.likes + c.comments + c.shares} interacciones`
    ).join('\n');
    prompt += `\n\nTop contenido:\n${topContent}`;
  }

  prompt += '\n\nResponde en castellano. Usa el formato exacto del system prompt. Sin emojis. Máximo 500 caracteres.';

  return prompt;
}
