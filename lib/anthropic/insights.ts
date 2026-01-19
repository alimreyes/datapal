import { anthropic, CLAUDE_CONFIG, SYSTEM_PROMPT } from './config';
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

    // Create user prompt with report data
    const userPrompt = formatReportData(metrics);

    // Call Claude API with prompt caching
    const message = await anthropic.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
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
      cacheCreationTokens: message.usage.cache_creation_input_tokens,
      cacheReadTokens: message.usage.cache_read_input_tokens,
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
      engagementRate: instagram.reachStats?.total 
        ? ((instagram.interactionsStats?.total || 0) / instagram.reachStats.total * 100).toFixed(2)
        : '0',
    } : null,
    facebook: facebook ? {
      reach: facebook.reachStats?.total || 0,
      impressions: facebook.impressionsStats?.total || 0,
      interactions: facebook.interactionsStats?.total || 0,
      followers: facebook.followersStats?.total || 0,
      engagementRate: facebook.reachStats?.total
        ? ((facebook.interactionsStats?.total || 0) / facebook.reachStats.total * 100).toFixed(2)
        : '0',
    } : null,
  };
}

/**
 * Format report data for Claude
 */
function formatReportData(metrics: any): string {
  let prompt = 'Analiza estos datos de redes sociales:\n\n';

  if (metrics.instagram) {
    prompt += `INSTAGRAM:
- Alcance: ${metrics.instagram.reach.toLocaleString()}
- Impresiones: ${metrics.instagram.impressions.toLocaleString()}
- Interacciones: ${metrics.instagram.interactions.toLocaleString()}
- Tasa de Engagement: ${metrics.instagram.engagementRate}%
- Seguidores: ${metrics.instagram.followers.toLocaleString()}\n\n`;
  }

  if (metrics.facebook) {
    prompt += `FACEBOOK:
- Alcance: ${metrics.facebook.reach.toLocaleString()}
- Impresiones: ${metrics.facebook.impressions.toLocaleString()}
- Interacciones: ${metrics.facebook.interactions.toLocaleString()}
- Tasa de Engagement: ${metrics.facebook.engagementRate}%
- Seguidores: ${metrics.facebook.followers.toLocaleString()}\n\n`;
  }

  prompt += `Objetivo del reporte: ${metrics.objective}\n\n`;
  prompt += 'Proporciona el insight más importante en máximo 200 caracteres.';

  return prompt;
}
