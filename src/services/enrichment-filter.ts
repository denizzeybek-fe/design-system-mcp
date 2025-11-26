import { Component } from '../types/index.js';
import {
  EnrichmentCategory,
  EnrichmentMetadata,
  EnrichmentOptions,
  EnrichmentStrategy,
  ENRICHMENT_PRESETS,
  ENRICHMENT_TOKEN_COSTS,
  Intent,
} from '../types/enrichment-options.js';

/**
 * Enrichment Filter Service
 * Filters component data based on enrichment preferences
 */
export class EnrichmentFilter {
  /**
   * Filter component data based on enrichment options
   */
  filter(
    component: Component,
    categories: EnrichmentCategory[],
    strategy: EnrichmentStrategy,
    intent?: Intent
  ): { component: Component; metadata: EnrichmentMetadata } {
    const filtered = this.filterComponent(component, categories);
    const metadata = this.buildMetadata(component, filtered, categories, strategy, intent);

    return { component: filtered, metadata };
  }

  /**
   * Resolve enrichment categories based on options
   */
  resolveCategories(options?: EnrichmentOptions): EnrichmentCategory[] {
    // Manual mode with explicit include
    if (options?.include && options.include.length > 0) {
      return options.include as EnrichmentCategory[];
    }

    // Strategy preset
    if (options?.strategy && options.strategy !== 'auto' && options.strategy !== 'manual') {
      const preset = ENRICHMENT_PRESETS[options.strategy];

      // Apply excludes if provided
      if (options.exclude && options.exclude.length > 0) {
        return preset.filter((cat) => !options.exclude!.includes(cat));
      }

      return preset;
    }

    // Default: comprehensive (all enrichments)
    return ENRICHMENT_PRESETS.comprehensive;
  }

  /**
   * Estimate token usage for categories
   */
  estimateTokens(categories: EnrichmentCategory[]): number {
    return categories.reduce((sum, cat) => sum + (ENRICHMENT_TOKEN_COSTS[cat] || 0), 0);
  }

  /**
   * Filter component by removing non-selected enrichments
   */
  private filterComponent(component: Component, categories: EnrichmentCategory[]): Component {
    // Deep clone to avoid mutating original
    const filtered: Component = JSON.parse(JSON.stringify(component));

    // Always include: name, description, category, version (base metadata)
    // Filter optional enrichments based on categories

    // 1. Props filtering
    if (!categories.includes('props')) {
      // Remove all props but keep empty array for structure
      filtered.props = [];
    } else if (!categories.includes('propEnrichments')) {
      // Keep props but strip enrichments
      filtered.props = filtered.props.map((prop) => ({
        name: prop.name,
        type: prop.type,
        required: prop.required,
        default: prop.default,
        description: prop.description,
        validator: prop.validator,
        // Remove enrichments
        valueFormat: undefined,
        commonMistakes: undefined,
        relatedProps: undefined,
        relatedEvents: undefined,
        migrationFromV1: undefined,
      }));
    }

    // 2. Events filtering
    if (!categories.includes('events')) {
      filtered.events = [];
    } else if (!categories.includes('eventEnrichments')) {
      // Keep events but strip enrichments
      filtered.events = filtered.events.map((event) => ({
        name: event.name,
        payload: event.payload,
        description: event.description,
        // Remove enrichments
        payloadTypes: undefined,
        useCase: undefined,
        handlingPattern: undefined,
        commonMistakes: undefined,
      }));
    }

    // 3. Examples filtering
    if (!categories.includes('examples')) {
      filtered.examples = [];
    }

    // 4. Helper functions filtering
    if (!categories.includes('helperFunctions')) {
      filtered.helperFunctions = undefined;
    }

    // 5. Performance notes filtering
    if (!categories.includes('performanceNotes')) {
      filtered.performanceNotes = undefined;
    }

    // 6. Accessibility notes filtering
    if (!categories.includes('accessibilityNotes')) {
      filtered.accessibilityNotes = undefined;
    }

    // 7. Related components filtering
    if (!categories.includes('relatedComponents')) {
      filtered.relatedComponents = undefined;
    }

    // 8. Imports filtering
    if (!categories.includes('imports')) {
      filtered.imports = [];
    }

    return filtered;
  }

  /**
   * Build metadata about filtering
   */
  private buildMetadata(
    original: Component,
    filtered: Component,
    categories: EnrichmentCategory[],
    strategy: EnrichmentStrategy,
    intent?: Intent
  ): EnrichmentMetadata {
    const allCategories = ENRICHMENT_PRESETS.comprehensive;
    const excluded = allCategories.filter((cat) => !categories.includes(cat));

    const originalTokens = this.estimateTokens(allCategories);
    const filteredTokens = this.estimateTokens(categories);

    return {
      strategy,
      detectedIntent: intent,
      selectedEnrichments: categories,
      includedCategories: categories,
      excludedCategories: excluded,
      estimatedTokens: filteredTokens,
      tokensSaved: originalTokens - filteredTokens,
      reasoning: this.buildReasoningText(strategy, categories, intent),
    };
  }

  /**
   * Build reasoning text for metadata
   */
  private buildReasoningText(
    strategy: EnrichmentStrategy,
    categories: EnrichmentCategory[],
    intent?: Intent
  ): string {
    if (intent) {
      return intent.reasoning;
    }

    if (strategy === 'minimal') {
      return 'Minimal enrichments: Only basic props and events included.';
    }

    if (strategy === 'standard') {
      return 'Standard enrichments: Props, events, examples, and helper functions included.';
    }

    if (strategy === 'comprehensive') {
      return 'Comprehensive enrichments: All available enrichments included.';
    }

    if (strategy === 'manual') {
      return `Manual selection: ${categories.length} categories explicitly chosen.`;
    }

    return 'All enrichments included.';
  }
}
