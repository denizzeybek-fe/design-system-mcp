import { z } from 'zod';

// Prop definition schema
export const PropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.any().optional(),
  description: z.string(),
});

export type Prop = z.infer<typeof PropSchema>;

// Event definition schema
export const EventSchema = z.object({
  name: z.string(),
  payload: z.string().optional(),
  description: z.string(),
});

export type Event = z.infer<typeof EventSchema>;

// Slot definition schema
export const SlotSchema = z.object({
  name: z.string(),
  description: z.string(),
  props: z.array(PropSchema).optional(),
});

export type Slot = z.infer<typeof SlotSchema>;

// Usage example schema
export const ExampleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  code: z.string(),
  props: z.record(z.any()).optional(),
});

export type Example = z.infer<typeof ExampleSchema>;

// Full component schema
export const ComponentSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  version: z.string().optional(),
  props: z.array(PropSchema),
  events: z.array(EventSchema),
  slots: z.array(SlotSchema),
  examples: z.array(ExampleSchema),
  imports: z.array(z.string()),
  designTokens: z.array(z.string()).optional(),
  relatedComponents: z.array(z.string()).optional(),
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
