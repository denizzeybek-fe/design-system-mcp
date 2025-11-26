/**
 * Prompt Optimizer Service
 *
 * Transforms raw user prompts into MCP-optimized prompts for better
 * Design System integration and token efficiency.
 */

export type Intent = 'implement' | 'debug' | 'migrate' | 'learn' | 'customize';
export type Complexity = 'simple' | 'medium' | 'complex';

export interface OptimizedPrompt {
  original: string;
  analysis: {
    language: string;
    intent: Intent;
    components: string[];
    complexity: Complexity;
    estimatedTokenSavings: number;
  };
  optimizedPrompt: string;
  toolSequence: string[];
  improvements: string[];
}

export class PromptOptimizer {
  // Component keywords mapping
  private componentKeywords: Record<string, string[]> = {
    'InButtonV2': ['button', 'buton', 'btn', 'click'],
    'InDropdownMenu': ['dropdown', 'menu', 'menü', 'açılır'],
    'InDatePickerV2': ['date', 'tarih', 'picker', 'calendar', 'takvim'],
    'InSelect': ['select', 'seç', 'dropdown', 'combobox'],
    'InInput': ['input', 'text', 'girdi'],
    'InTextArea': ['textarea', 'text area', 'multiline'],
    'InCheckBoxV2': ['checkbox', 'check', 'onay'],
    'InRadioButton': ['radio', 'radyo', 'seçenek'],
    'InToggle': ['toggle', 'switch', 'anahtar'],
    'InModal': ['modal', 'dialog', 'popup'],
    'InTooltipV2': ['tooltip', 'hint', 'ipucu'],
    'InDataTableV2': ['table', 'tablo', 'grid', 'datatable'],
  };

  // Intent keywords
  private intentKeywords: Record<Intent, string[]> = {
    implement: ['implement', 'add', 'create', 'ekle', 'oluştur', 'yap', 'lazım', 'need'],
    debug: ['debug', 'fix', 'hata', 'error', 'çalışmıyor', 'not working', 'broken'],
    migrate: ['migrate', 'upgrade', 'v1', 'v2', 'geç', 'güncelle'],
    learn: ['how', 'nasıl', 'learn', 'öğren', 'understand', 'anla', 'nedir'],
    customize: ['customize', 'modify', 'change', 'değiştir', 'özelleştir'],
  };

  /**
   * Optimize a raw user prompt
   */
  optimize(userPrompt: string): OptimizedPrompt {
    const language = this.detectLanguage(userPrompt);
    const intent = this.detectIntent(userPrompt);
    const components = this.extractComponents(userPrompt);
    const complexity = this.analyzeComplexity(components);
    const estimatedTokenSavings = this.estimateTokenSavings(components);

    const optimizedPrompt = this.generateOptimizedPrompt({
      original: userPrompt,
      language,
      intent,
      components,
      complexity,
    });

    const toolSequence = this.generateToolSequence(intent, components);
    const improvements = this.listImprovements(userPrompt, optimizedPrompt);

    return {
      original: userPrompt,
      analysis: {
        language,
        intent,
        components,
        complexity,
        estimatedTokenSavings,
      },
      optimizedPrompt,
      toolSequence,
      improvements,
    };
  }

  /**
   * Detect language (Turkish or English)
   */
  private detectLanguage(prompt: string): string {
    const turkishKeywords = ['lazım', 'gerek', 'ekle', 'yap', 'oluştur', 'bir', 've', 'ile'];
    const lowerPrompt = prompt.toLowerCase();

    const turkishCount = turkishKeywords.filter(kw => lowerPrompt.includes(kw)).length;
    return turkishCount >= 2 ? 'Turkish' : 'English';
  }

  /**
   * Detect user intent
   */
  private detectIntent(prompt: string): Intent {
    const lowerPrompt = prompt.toLowerCase();

    for (const [intent, keywords] of Object.entries(this.intentKeywords)) {
      if (keywords.some(kw => lowerPrompt.includes(kw))) {
        return intent as Intent;
      }
    }

    return 'implement'; // Default
  }

  /**
   * Extract component names from prompt
   */
  private extractComponents(prompt: string): string[] {
    const lowerPrompt = prompt.toLowerCase();
    const found: string[] = [];

    for (const [component, keywords] of Object.entries(this.componentKeywords)) {
      if (keywords.some(kw => lowerPrompt.includes(kw))) {
        found.push(component);
      }
    }

    return found;
  }

  /**
   * Analyze complexity based on number of components
   */
  private analyzeComplexity(components: string[]): Complexity {
    if (components.length === 0 || components.length === 1) return 'simple';
    if (components.length <= 3) return 'medium';
    return 'complex';
  }

  /**
   * Estimate token savings based on components
   */
  private estimateTokenSavings(components: string[]): number {
    const avgSavingsPerComponent = 12000; // Average ~12k tokens saved per component
    return components.length * avgSavingsPerComponent;
  }

  /**
   * Generate optimized prompt
   */
  private generateOptimizedPrompt(params: {
    original: string;
    language: string;
    intent: Intent;
    components: string[];
    complexity: Complexity;
  }): string {
    const { intent, components, complexity } = params;

    let prompt = '';

    // Task description
    if (intent === 'implement') {
      prompt += this.generateImplementationPrompt(components);
    } else if (intent === 'migrate') {
      prompt += this.generateMigrationPrompt(components);
    } else if (intent === 'debug') {
      prompt += this.generateDebugPrompt(components);
    } else if (intent === 'learn') {
      prompt += this.generateLearningPrompt(components);
    } else {
      prompt += this.generateCustomizePrompt(components);
    }

    // Steps
    prompt += '\n\nPlease use the Design System MCP to:\n\n';

    if (components.length === 0) {
      prompt += '1. **Search for components**\n';
      prompt += '   - Tool: `mcp__design-system__search-components`\n';
      prompt += '   - Why: Find the right Design System components\n\n';
      prompt += '2. **Get documentation**\n';
      prompt += '   - Tool: `mcp__design-system__get-component`\n';
      prompt += '   - Note: Markdown format saves ~77% tokens on average\n\n';
    } else if (components.length === 1) {
      prompt += `1. **Get ${components[0]} documentation**\n`;
      prompt += '   - Tool: `mcp__design-system__get-component`\n';
      prompt += `   - Name: "${components[0]}"\n`;
      prompt += '   - Note: Markdown format provides significant token savings\n\n';
    } else {
      prompt += '1. **Search for components**\n';
      prompt += '   - Tool: `mcp__design-system__search-components`\n\n';
      prompt += '2. **Get documentation for all components**\n';
      prompt += '   - Tool: `mcp__design-system__get-component`\n';
      prompt += `   - Components: ${components.join(', ')}\n`;
      prompt += `   - Estimated token savings: ~${this.estimateTokenSavings(components).toLocaleString()} tokens\n\n`;
    }

    prompt += '3. **Generate implementation code**\n';
    prompt += '   - Tool: `mcp__design-system__generate-code`\n';
    if (complexity === 'medium' || complexity === 'complex') {
      prompt += '   - Include integration between components\n';
    }
    prompt += '\n';

    // Requirements
    prompt += this.generateRequirements(intent, components, complexity);

    // Output expectations
    prompt += '\nShow me:\n';
    prompt += '✅ Which components you\'re using\n';
    prompt += '✅ Token savings from Markdown format for each component\n';
    prompt += '✅ The generated Vue code\n';
    if (components.length > 1) {
      prompt += '✅ Integration example showing how components work together\n';
    }
    if (intent === 'migrate') {
      prompt += '✅ V1 vs V2 prop differences\n';
      prompt += '✅ Migration checklist\n';
    }

    // Explanation request
    prompt += '\nAfter implementation, explain:\n';
    prompt += '- How the component(s) work\n';
    prompt += '- Token optimization results (Markdown vs JSON format)\n';
    if (components.length > 1) {
      prompt += '- Integration patterns used\n';
    }
    prompt += '- Any best practices or common mistakes to avoid\n';

    return prompt;
  }

  private generateImplementationPrompt(components: string[]): string {
    if (components.length === 0) {
      return 'I need to implement a component from the Design System.';
    } else if (components.length === 1) {
      return `I need to implement ${components[0]} from the Design System.`;
    } else {
      const last = components[components.length - 1];
      const rest = components.slice(0, -1).join(', ');
      return `I need to implement ${rest} and ${last} components with proper integration.`;
    }
  }

  private generateMigrationPrompt(components: string[]): string {
    return `I need to migrate ${components[0] || 'components'} from V1 to V2 and understand the prop mappings.`;
  }

  private generateDebugPrompt(components: string[]): string {
    return `I need to debug an issue with ${components[0] || 'a component'} and understand common mistakes.`;
  }

  private generateLearningPrompt(components: string[]): string {
    return `I want to learn how to use ${components[0] || 'Design System components'} effectively.`;
  }

  private generateCustomizePrompt(components: string[]): string {
    return `I need to customize ${components[0] || 'a component'} for my specific use case.`;
  }

  private generateRequirements(intent: Intent, components: string[], complexity: Complexity): string {
    let req = 'Requirements:\n';

    if (intent === 'implement') {
      if (components.includes('InButtonV2')) {
        req += '- Primary styling for main actions\n';
      }
      if (components.includes('InDropdownMenu')) {
        req += '- Dropdown opens below trigger element\n';
        req += '- Multiple menu items support\n';
      }
      if (complexity === 'medium' || complexity === 'complex') {
        req += '- Proper state management between components\n';
        req += '- Event handling for component interactions\n';
      }
    } else if (intent === 'migrate') {
      req += '- Show V1 vs V2 prop differences\n';
      req += '- Highlight breaking changes\n';
      req += '- Provide migration checklist\n';
    }

    return req;
  }

  private generateToolSequence(_intent: Intent, components: string[]): string[] {
    const sequence: string[] = [];

    if (components.length === 0) {
      sequence.push('mcp__design-system__search-components');
    }

    if (components.length > 0) {
      components.forEach(comp => {
        sequence.push(`mcp__design-system__get-component (${comp})`);
      });
    } else {
      sequence.push('mcp__design-system__get-component');
    }

    sequence.push('mcp__design-system__generate-code');

    return sequence;
  }

  private listImprovements(original: string, _optimized: string): string[] {
    const improvements: string[] = [];

    improvements.push('Added explicit MCP tool names for better guidance');
    improvements.push('Included token savings awareness (Markdown format)');
    improvements.push('Structured prompt with clear steps');
    improvements.push('Set explicit output expectations with checkboxes');

    if (original.length < 50) {
      improvements.push('Expanded vague request into detailed requirements');
    }

    if (!original.toLowerCase().includes('token')) {
      improvements.push('Added token optimization context');
    }

    return improvements;
  }
}
