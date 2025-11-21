import { z } from 'zod';

// Value format metadata schema
export const ValueFormatSchema = z.object({
  structure: z.string(),
  examples: z.array(z.string()),
  notes: z.string().optional(),
  typescript: z.string().optional(),
});

export type ValueFormat = z.infer<typeof ValueFormatSchema>;

// Common mistake schema
export const CommonMistakeSchema = z.object({
  mistake: z.string(),
  impact: z.string(),
  fix: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  detectPattern: z.string().optional(),
  helperFunction: z.string().optional(),
  pattern: z.string().optional(),
  correctPattern: z.string().optional(),
});

export type CommonMistake = z.infer<typeof CommonMistakeSchema>;

// Migration from V1 schema
export const MigrationFromV1Schema = z.object({
  v1Format: z.string(),
  v2Format: z.string(),
  transformation: z.string(),
});

export type MigrationFromV1 = z.infer<typeof MigrationFromV1Schema>;

// Prop definition schema (enhanced)
export const PropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.any().optional(),
  description: z.string(),
  valueFormat: ValueFormatSchema.optional(),
  relatedProps: z.array(z.string()).optional(),
  relatedEvents: z.array(z.string()).optional(),
  commonMistakes: z.array(CommonMistakeSchema).optional(),
  migrationFromV1: MigrationFromV1Schema.optional(),
  validator: z.string().optional(),
});

export type Prop = z.infer<typeof PropSchema>;

// Event payload type schema
export const EventPayloadTypeSchema = z.object({
  condition: z.string(),
  type: z.string(),
  format: z.string(),
  example: z.string(),
});

export type EventPayloadType = z.infer<typeof EventPayloadTypeSchema>;

// Event definition schema (enhanced)
export const EventSchema = z.object({
  name: z.string(),
  payload: z.string().optional(),
  description: z.string(),
  payloadTypes: z.array(EventPayloadTypeSchema).optional(),
  useCase: z.string().optional(),
  handlingPattern: z.string().optional(),
  commonMistakes: z.array(CommonMistakeSchema).optional(),
});

export type Event = z.infer<typeof EventSchema>;

// Slot definition schema
export const SlotSchema = z.object({
  name: z.string(),
  description: z.string(),
  props: z.array(PropSchema).optional(),
});

export type Slot = z.infer<typeof SlotSchema>;

// Usage example schema (enhanced)
export const ExampleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  code: z.string(),
  props: z.record(z.any()).optional(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export type Example = z.infer<typeof ExampleSchema>;

// Helper function schema
export const HelperFunctionSchema = z.object({
  name: z.string(),
  description: z.string(),
  code: z.string(),
  typescript: z.string().optional(),
  required: z.boolean().optional(),
  usedFor: z.array(z.string()).optional(),
});

export type HelperFunction = z.infer<typeof HelperFunctionSchema>;

// Performance note schema
export const PerformanceNoteSchema = z.object({
  issue: z.string(),
  impact: z.string(),
  solution: z.string(),
  example: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export type PerformanceNote = z.infer<typeof PerformanceNoteSchema>;

// Accessibility note schema
export const AccessibilityNoteSchema = z.object({
  requirement: z.string(),
  reason: z.string(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

export type AccessibilityNote = z.infer<typeof AccessibilityNoteSchema>;

// Full component schema (enhanced)
export const ComponentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  version: z.string().optional(),
  deprecated: z.boolean().optional(),
  replacement: z.string().optional(),
  props: z.array(PropSchema),
  events: z.array(EventSchema),
  slots: z.array(SlotSchema),
  examples: z.array(ExampleSchema),
  imports: z.array(z.string()),
  designTokens: z.array(z.string()).optional(),
  relatedComponents: z.array(z.string()).optional(),
  helperFunctions: z.array(HelperFunctionSchema).optional(),
  performanceNotes: z.array(PerformanceNoteSchema).optional(),
  accessibilityNotes: z.array(AccessibilityNoteSchema).optional(),
});

export type Component = z.infer<typeof ComponentSchema>;

// Registry schema
export const RegistrySchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  components: z.array(ComponentSchema),
});

export type Registry = z.infer<typeof RegistrySchema>;

// Figma mapping schema
export const FigmaMappingSchema = z.object({
  figmaName: z.string(),
  component: z.string(),
  defaultProps: z.record(z.any()).optional(),
});

export type FigmaMapping = z.infer<typeof FigmaMappingSchema>;

// Tool input schemas
export const ListComponentsInputSchema = z.object({
  category: z.string().optional().describe('Filter by component category'),
});

export const GetComponentInputSchema = z.object({
  name: z.string().describe('Component name (e.g., InButton, InDatePickerV2)'),
});

export const SearchComponentsInputSchema = z.object({
  query: z.string().describe('Search query for component name or description'),
});

export const GenerateCodeInputSchema = z.object({
  component: z.string().describe('Component name'),
  props: z.record(z.any()).optional().describe('Props to set on the component'),
  includeScript: z.boolean().optional().describe('Include script setup section'),
});

export const FigmaMappingInputSchema = z.object({
  figmaComponentName: z.string().describe('Component name from Figma'),
});
