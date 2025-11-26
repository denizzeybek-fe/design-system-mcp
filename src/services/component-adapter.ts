/**
 * Component Adapter Service
 * Converts CombinedComponent (from combined.json) to Component (types/index.ts)
 */

import { Component, Prop, Event, Example, HelperFunction, PerformanceNote, AccessibilityNote } from '../types/index.js';

/**
 * CombinedComponent type from combined-loader
 */
interface CombinedComponent {
  name: string;
  title: string;
  description: string;
  version: 'v1' | 'v2';
  category?: string;
  props: Record<string, any>;
  emits: any[];
  slots: string[];
  enums: any[];
  examples?: any[];
  totalUsages?: number;
  usagePatterns?: any[];
  commonMistakes?: any[];
  mostUsedProps?: any[];
  mostUsedEvents?: any[];
  enriched?: boolean;
  propEnrichments?: Record<string, any>;
  eventEnrichments?: Record<string, any>;
  helperFunctions?: any[];
  performanceNotes?: any[];
  accessibilityNotes?: any[];
  migrationAvailable?: boolean;
  migrationTo?: string;
  migrationFrom?: string;
}

/**
 * Adapter class to convert between component formats
 */
export class ComponentAdapter {
  /**
   * Convert CombinedComponent to Component type
   */
  adapt(combined: CombinedComponent): Component {
    return {
      name: combined.name,
      description: combined.description,
      category: combined.category || 'Uncategorized',
      version: combined.version,
      deprecated: false, // Could be enriched later
      replacement: combined.migrationTo,
      props: this.adaptProps(combined),
      events: this.adaptEvents(combined),
      slots: this.adaptSlots(combined),
      examples: this.adaptExamples(combined),
      imports: this.generateImports(combined.name),
      designTokens: [], // Could be enriched later
      relatedComponents: [], // Could be enriched later
      helperFunctions: this.adaptHelperFunctions(combined),
      performanceNotes: this.adaptPerformanceNotes(combined),
      accessibilityNotes: this.adaptAccessibilityNotes(combined),
    };
  }

  /**
   * Adapt props from Record<string, any> to Prop[]
   */
  private adaptProps(combined: CombinedComponent): Prop[] {
    const props: Prop[] = [];

    for (const [propName, propData] of Object.entries(combined.props)) {
      const enrichment = combined.propEnrichments?.[propName];

      props.push({
        name: propName,
        type: propData.type || 'any',
        required: propData.required || false,
        default: propData.default,
        description: propData.description || '',
        valueFormat: enrichment?.valueFormat,
        relatedProps: enrichment?.relatedProps,
        relatedEvents: enrichment?.relatedEvents,
        commonMistakes: enrichment?.commonMistakes,
        migrationFromV1: enrichment?.migrationFromV1,
        validator: propData.validator,
      });
    }

    return props;
  }

  /**
   * Adapt events from emits[] to Event[]
   */
  private adaptEvents(combined: CombinedComponent): Event[] {
    return combined.emits.map((emit: any) => {
      const enrichment = combined.eventEnrichments?.[emit.name];

      return {
        name: emit.name,
        payload: emit.payload || emit.arguments?.join(', '),
        description: emit.description || '',
        payloadTypes: enrichment?.payloadTypes,
        useCase: enrichment?.useCase,
        handlingPattern: enrichment?.handlingPattern,
        commonMistakes: enrichment?.commonMistakes,
      };
    });
  }

  /**
   * Adapt slots from string[] to Slot[]
   */
  private adaptSlots(combined: CombinedComponent): Array<{ name: string; description: string; props?: Prop[] }> {
    return combined.slots.map((slotName: string) => ({
      name: slotName,
      description: `Slot for ${slotName}`,
      props: [],
    }));
  }

  /**
   * Adapt examples
   */
  private adaptExamples(combined: CombinedComponent): Example[] {
    if (!combined.examples || combined.examples.length === 0) {
      return [];
    }

    return combined.examples.map((example: any, index: number) => ({
      title: example.title || `Example ${index + 1}`,
      description: example.description,
      code: example.code || '',
      props: example.props,
      complexity: example.complexity || 'beginner',
    }));
  }

  /**
   * Generate standard imports for a component
   */
  private generateImports(componentName: string): string[] {
    return [
      `import { ${componentName} } from '@useinsider/design-system-vue';`,
      `import '@useinsider/design-system-vue/dist/design-system-vue.css';`,
    ];
  }

  /**
   * Adapt helper functions
   */
  private adaptHelperFunctions(combined: CombinedComponent): HelperFunction[] {
    if (!combined.helperFunctions || combined.helperFunctions.length === 0) {
      return [];
    }

    return combined.helperFunctions.map((helper: any) => ({
      name: helper.name,
      description: helper.description,
      code: helper.code,
      typescript: helper.typescript,
      required: helper.required,
      usedFor: helper.usedFor,
    }));
  }

  /**
   * Adapt performance notes
   */
  private adaptPerformanceNotes(combined: CombinedComponent): PerformanceNote[] {
    if (!combined.performanceNotes || combined.performanceNotes.length === 0) {
      return [];
    }

    return combined.performanceNotes.map((note: any) => ({
      issue: note.issue,
      impact: note.impact,
      solution: note.solution,
      example: note.example,
      severity: note.severity,
    }));
  }

  /**
   * Adapt accessibility notes
   */
  private adaptAccessibilityNotes(combined: CombinedComponent): AccessibilityNote[] {
    if (!combined.accessibilityNotes || combined.accessibilityNotes.length === 0) {
      return [];
    }

    return combined.accessibilityNotes.map((note: any) => ({
      requirement: note.requirement,
      reason: note.reason,
      severity: note.severity,
    }));
  }
}
