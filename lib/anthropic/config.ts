import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPTS } from '@/lib/claude-prompts';

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Model configuration
export const CLAUDE_CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 512, // Conciso: ~500 chars de respuesta directa sin emojis
  temperature: 0.7,
};

// System prompt principal — usa el prompt enriquecido de claude-prompts.ts
export const SYSTEM_PROMPT = SYSTEM_PROMPTS.general;

// Prompts específicos para tipos de análisis
export const ENGAGEMENT_PROMPT = SYSTEM_PROMPTS.engagement;
export const CONTENT_PROMPT = SYSTEM_PROMPTS.content;
