import { z } from 'zod';

/**
 * Available enrichment categories that can be filtered
 */
export type EnrichmentCategory =
  | 'props'
  | 'events'
  | 'examples'
  | 'helperFunctions'
  | 'propEnrichments'
  | 'eventEnrichments'
  | 'performanceNotes'
  | 'accessibilityNotes'
  | 'relatedComponents'
  | 'imports';

/**
 * Enrichment strategy modes
 */
export type EnrichmentStrategy = 'auto' | 'minimal' | 'standard' | 'comprehensive' | 'manual';

/**
 * Intent types detected from context analysis
 */
export type IntentType =
  | 'migration'
  | 'implementation'
  | 'debugging'
  | 'learning'
  | 'quick_lookup'
  | 'comprehensive';

/**
 * Estimated token costs per enrichment category
 */
export const ENRICHMENT_TOKEN_COSTS: Record<EnrichmentCategory, number> = {
  props: 2000,
  events: 1000,
  examples: 2000,
  helperFunctions: 1000,
  propEnrichments: 3000,
  eventEnrichments: 2000,
  performanceNotes: 600,
  accessibilityNotes: 400,
  relatedComponents: 200,
  imports: 100,
};

/**
 * Preset enrichment configurations
 */
export const ENRICHMENT_PRESETS: Record<Exclude<EnrichmentStrategy, 'auto' | 'manual'>, EnrichmentCategory[]> = {
  minimal: ['props', 'events'],
  standard: ['props', 'events', 'examples', 'helperFunctions'],
  comprehensive: [
    'props',
    'events',
    'examples',
    'helperFunctions',
    'propEnrichments',
    'eventEnrichments',
    'performanceNotes',
    'accessibilityNotes',
    'relatedComponents',
    'imports',
  ],
};

/**
 * Intent-based enrichment mappings
 */
export const INTENT_ENRICHMENTS: Record<IntentType, EnrichmentCategory[]> = {
  migration: [
    'props',
    'events',
    'propEnrichments',
    'eventEnrichments',
    'helperFunctions',
  ],
  implementation: [
    'props',
    'events',
    'examples',
    'helperFunctions',
    'propEnrichments',
  ],
  debugging: [
    'props',
    'propEnrichments',
    'eventEnrichments',
    'helperFunctions',
  ],
  learning: [
    'props',
    'events',
    'examples',
  ],
  quick_lookup: [
    'props',
    'events',
  ],
  comprehensive: ENRICHMENT_PRESETS.comprehensive,
};

/**
 * Enrichment options schema
 */
export const EnrichmentOptionsSchema = z.object({
  include: z.array(z.string()).optional().describe('Only include these enrichment categories'),
  exclude: z.array(z.string()).optional().describe('Exclude these enrichment categories'),
  strategy: z.enum(['auto', 'minimal', 'standard', 'comprehensive', 'manual']).optional()
    .describe('Enrichment strategy: auto (AI decides), minimal/standard/comprehensive (presets), manual (use include/exclude)'),
});

export type EnrichmentOptions = z.infer<typeof EnrichmentOptionsSchema>;

/**
 * Intent detection result
 */
export interface Intent {
  type: IntentType;
  confidence: number;
  reasoning: string;
  detectedKeywords: string[];
}

/**
 * Context for intent analysis
 */
export interface AnalysisContext {
  explicitContext?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  componentName?: string;
}

/**
 * Enrichment metadata returned with component
 */
export interface EnrichmentMetadata {
  strategy: EnrichmentStrategy;
  detectedIntent?: Intent;
  selectedEnrichments: EnrichmentCategory[];
  includedCategories: EnrichmentCategory[];
  excludedCategories: EnrichmentCategory[];
  estimatedTokens: number;
  tokensSaved: number;
  reasoning: string;
}
