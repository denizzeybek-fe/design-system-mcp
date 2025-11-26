import {
  AnalysisContext,
  EnrichmentCategory,
  Intent,
  IntentType,
  INTENT_ENRICHMENTS,
} from '../types/enrichment-options.js';

/**
 * Smart Enrichment Selector Service
 * Analyzes context to determine which enrichments are most relevant
 */
export class SmartEnrichmentSelector {
  /**
   * Select appropriate enrichments based on context analysis
   */
  async selectEnrichments(context: AnalysisContext): Promise<EnrichmentCategory[]> {
    const intent = await this.analyzeIntent(context);
    return INTENT_ENRICHMENTS[intent.type];
  }

  /**
   * Analyze intent from context
   */
  async analyzeIntent(context: AnalysisContext): Promise<Intent> {
    // If no context provided, return comprehensive
    if (!context.explicitContext && !context.conversationHistory) {
      return {
        type: 'comprehensive',
        confidence: 1.0,
        reasoning: 'No context provided, returning all enrichments',
        detectedKeywords: [],
      };
    }

    // Combine all text for analysis
    const text = this.extractText(context);
    const keywords = this.extractKeywords(text);

    // Pattern matching for intent detection
    const intentScores = this.calculateIntentScores(text, keywords);
    const topIntent = this.getTopIntent(intentScores);

    return {
      type: topIntent.type,
      confidence: topIntent.score,
      reasoning: this.buildReasoning(topIntent.type, keywords),
      detectedKeywords: keywords,
    };
  }

  /**
   * Get detailed intent with explanation
   */
  getIntentWithMetadata(context: AnalysisContext): Promise<Intent> {
    return this.analyzeIntent(context);
  }

  /**
   * Extract all text from context
   */
  private extractText(context: AnalysisContext): string {
    const parts: string[] = [];

    if (context.explicitContext) {
      parts.push(context.explicitContext);
    }

    if (context.conversationHistory) {
      parts.push(...context.conversationHistory.map((msg) => msg.content));
    }

    return parts.join(' ').toLowerCase();
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    const patterns = {
      migration: ['migrate', 'migration', 'v1', 'v2', 'upgrade', 'convert', 'transform'],
      implementation: ['implement', 'add', 'create', 'build', 'setup', 'integrate', 'use'],
      debugging: ['error', 'bug', 'not working', 'issue', 'problem', 'fix', 'broken', 'fails', 'doesn\'t work'],
      learning: ['how to', 'example', 'learn', 'tutorial', 'guide', 'documentation', 'understand'],
      quick_lookup: ['what is', 'type of', 'prop', 'event', 'quick', 'info', 'details'],
    };

    for (const [_intent, intentKeywords] of Object.entries(patterns)) {
      for (const keyword of intentKeywords) {
        if (text.includes(keyword)) {
          keywords.push(keyword);
        }
      }
    }

    return keywords;
  }

  /**
   * Calculate scores for each intent type
   */
  private calculateIntentScores(text: string, _keywords: string[]): Map<IntentType, number> {
    const scores = new Map<IntentType, number>();

    // Migration intent
    const migrationKeywords = ['migrate', 'migration', 'v1', 'v2', 'upgrade', 'convert'];
    scores.set('migration', this.scoreKeywords(text, migrationKeywords) * 1.2); // Higher weight

    // Implementation intent
    const implKeywords = ['implement', 'add', 'create', 'build', 'setup', 'integrate', 'use'];
    scores.set('implementation', this.scoreKeywords(text, implKeywords));

    // Debugging intent
    const debugKeywords = ['error', 'bug', 'not working', 'issue', 'problem', 'fix', 'broken'];
    scores.set('debugging', this.scoreKeywords(text, debugKeywords) * 1.1); // Slightly higher

    // Learning intent
    const learnKeywords = ['how to', 'example', 'learn', 'tutorial', 'guide'];
    scores.set('learning', this.scoreKeywords(text, learnKeywords));

    // Quick lookup intent
    const lookupKeywords = ['what is', 'type of', 'prop', 'event', 'quick'];
    scores.set('quick_lookup', this.scoreKeywords(text, lookupKeywords));

    return scores;
  }

  /**
   * Score text based on keyword matches
   */
  private scoreKeywords(text: string, keywords: string[]): number {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score += 1;
      }
    }
    // Normalize by keyword count
    return keywords.length > 0 ? score / keywords.length : 0;
  }

  /**
   * Get the intent with highest score
   */
  private getTopIntent(scores: Map<IntentType, number>): { type: IntentType; score: number } {
    let topIntent: IntentType = 'comprehensive';
    let topScore = 0;

    for (const [intent, score] of scores.entries()) {
      if (score > topScore) {
        topScore = score;
        topIntent = intent;
      }
    }

    // If no strong intent detected (low scores), default to comprehensive
    if (topScore < 0.15) {
      return { type: 'comprehensive', score: 0.5 };
    }

    return { type: topIntent, score: Math.min(topScore, 1.0) };
  }

  /**
   * Build reasoning text
   */
  private buildReasoning(intent: IntentType, keywords: string[]): string {
    const reasons: Record<IntentType, string> = {
      migration: `Detected migration task (keywords: ${keywords.join(', ')}). Including prop/event mappings, common mistakes, and helper functions.`,
      implementation: `Detected implementation task (keywords: ${keywords.join(', ')}). Including props, events, examples, and common mistakes.`,
      debugging: `Detected debugging task (keywords: ${keywords.join(', ')}). Including common mistakes, prop enrichments, and helper functions.`,
      learning: `Detected learning intent (keywords: ${keywords.join(', ')}). Including examples, props, and events for understanding.`,
      quick_lookup: `Detected quick lookup (keywords: ${keywords.join(', ')}). Including only basic prop and event information.`,
      comprehensive: keywords.length > 0
        ? `Multiple intents detected (keywords: ${keywords.join(', ')}). Including all enrichments for comprehensive coverage.`
        : 'No specific intent detected. Including all enrichments.',
    };

    return reasons[intent];
  }
}
