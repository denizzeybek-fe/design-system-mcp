/**
 * Standard Enrichment Schema
 *
 * This defines the canonical structure for all enrichment files.
 * All enrichments must follow this schema for consistency.
 *
 * Based on InRibbons.json as the gold standard.
 */

export interface EnrichmentMetadata {
  lastUpdated: string; // ISO 8601 timestamp
  propsHash: string; // Hash of props for change detection
  eventsHash: string; // Hash of events for change detection
  propCount: number;
  eventCount: number;
}

export interface PropValueFormat {
  structure: string; // Type description (e.g., "string", "Object", "Array<string>")
  validValues?: string[]; // For enum-like props
  notes: string; // Detailed explanation
  examples?: string[]; // Usage examples
  typescript: string; // TypeScript type definition
}

export interface CommonMistake {
  mistake: string; // Description of the mistake
  impact: string; // What happens when this mistake is made
  fix: string; // How to fix it
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface PropEnrichment {
  valueFormat: PropValueFormat;
  relatedProps?: string[]; // Props that work together with this prop
  commonMistakes?: CommonMistake[];
}

export interface EventPayload {
  structure: string; // Type description
  notes: string; // What data is emitted
  typescript: string; // TypeScript type
}

export interface EventEnrichment {
  payload: EventPayload;
  when: string; // When this event is triggered
  commonMistakes?: CommonMistake[];
}

export interface CodeSnippet {
  title: string;
  description: string;
  code: string;
}

export interface StylingInfo {
  cssVariables?: Record<string, string>; // CSS variable name → description
  classes?: Record<string, string>; // Class name → description
  notes?: string; // Additional styling information
}

export interface Example {
  title: string;
  description: string;
  code: string; // Complete Vue SFC code
  notes?: string; // Additional context
}

export interface ImplementationPattern {
  name: string;
  description: string; // What problem this pattern solves
  code: string;
  when: string; // When to use this pattern
  pros: string[];
  cons?: string[];
}

export interface UseCase {
  title: string;
  description: string; // Real-world scenario
  example: string; // Code example
}

export interface BestPractice {
  title: string;
  description: string;
  code?: string; // Example code (optional)
  reasoning: string; // Why this is a best practice
}

export interface DetailedMistake {
  mistake: string;
  why: string; // Why people make this mistake
  impact: string;
  fix: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  example?: {
    wrong: string;
    correct: string;
  };
}

export interface PerformanceNote {
  topic: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low'; // Performance impact
}

export interface AccessibilityNote {
  topic: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  recommendation: string;
  example?: string;
}

/**
 * Standard Enrichment File Schema
 *
 * All enrichment files MUST follow this structure.
 * Optional fields can be omitted if not applicable.
 */
export interface EnrichmentSchema {
  /** Component name (e.g., "InButtonV2") */
  component: string;

  /** Metadata about this enrichment file */
  _metadata: EnrichmentMetadata;

  /** Detailed prop documentation (REQUIRED for complex props) */
  propEnrichments: Record<string, PropEnrichment>;

  /** Detailed event documentation (REQUIRED if component has events) */
  eventEnrichments?: Record<string, EventEnrichment>;

  /** Code snippets for common use cases */
  codeSnippets?: Record<string, CodeSnippet>;

  /** Styling information (CSS variables, classes) */
  styling?: StylingInfo;

  /** Full working examples */
  examples?: Example[];

  /** Common implementation patterns */
  implementationPatterns?: ImplementationPattern[];

  /** Real-world use cases */
  useCases?: UseCase[];

  /** Best practices for using this component */
  bestPractices?: BestPractice[];

  /** Common mistakes and how to avoid them */
  commonMistakes?: DetailedMistake[];

  /** Performance considerations */
  performanceNotes?: PerformanceNote[];

  /** Accessibility guidelines */
  accessibilityNotes?: AccessibilityNote[];

  /** Helper functions for component usage (OPTIONAL) */
  helperFunctions?: Array<{
    name: string;
    description: string;
    code: string;
    parameters?: Array<{ name: string; type: string; description: string }>;
    returnType?: string;
    example?: string;
  }>;
}

/**
 * Required fields for all enrichments
 */
export const REQUIRED_FIELDS: (keyof EnrichmentSchema)[] = [
  'component',
  '_metadata',
  'propEnrichments',
];

/**
 * Recommended fields for comprehensive enrichments
 */
export const RECOMMENDED_FIELDS: (keyof EnrichmentSchema)[] = [
  'component',
  '_metadata',
  'propEnrichments',
  'eventEnrichments',
  'codeSnippets',
  'examples',
  'bestPractices',
  'commonMistakes',
];

/**
 * All possible fields in order of importance
 */
export const FIELD_ORDER: (keyof EnrichmentSchema)[] = [
  'component',
  '_metadata',
  'propEnrichments',
  'eventEnrichments',
  'codeSnippets',
  'styling',
  'examples',
  'implementationPatterns',
  'useCases',
  'bestPractices',
  'commonMistakes',
  'performanceNotes',
  'accessibilityNotes',
  'helperFunctions',
];
