#!/usr/bin/env tsx

/**
 * Generate Markdown files from combined.json
 *
 * Purpose: Convert component data to Markdown format for 57% token savings
 * Run after extract:merge to update Markdown cache
 *
 * Token Savings: ~57% reduction (27,288 → 11,825 tokens)
 */

import fs from 'fs';
import path from 'path';

interface CombinedComponent {
  name: string;
  description?: string;
  version?: string;
  category?: string;
  props?: Record<string, any>;
  emits?: any[];
  enums?: any[];
  metadata?: any;
  examples?: any[];
  commonMistakes?: any[];
  bestPractices?: any[];
  relatedComponents?: string[];
  imports?: any;
  [key: string]: any;
}

interface CombinedData {
  components: Record<string, CombinedComponent>;
  version: string;
  generatedAt: string;
}

class MarkdownGenerator {
  private inputFile = 'data/combined.json';
  private outputDir = 'data/markdown';

  async generate(): Promise<void> {
    console.log('🚀 Starting Markdown generation...\n');

    // Load combined.json
    console.log(`📖 Loading ${this.inputFile}...`);
    const combined: CombinedData = JSON.parse(
      fs.readFileSync(this.inputFile, 'utf-8')
    );

    const componentCount = Object.keys(combined.components).length;
    console.log(`✅ Loaded ${componentCount} components\n`);

    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.outputDir}\n`);
    }

    // Track statistics
    let totalJsonSize = 0;
    let totalMarkdownSize = 0;
    const conversions: Array<{
      name: string;
      jsonSize: number;
      markdownSize: number;
      savings: number;
    }> = [];

    // Generate Markdown for each component
    console.log('🔄 Converting components to Markdown format...\n');

    for (const [name, component] of Object.entries(combined.components)) {
      try {
        // Calculate original JSON size
        const jsonString = JSON.stringify(component);
        const jsonSize = Buffer.byteLength(jsonString, 'utf-8');

        // Convert to Markdown
        const markdownString = this.toMarkdown(component);
        const markdownSize = Buffer.byteLength(markdownString, 'utf-8');

        // Calculate savings
        const savings = Math.round(((jsonSize - markdownSize) / jsonSize) * 100);

        // Write to file
        const outputPath = path.join(this.outputDir, `${name}.md`);
        fs.writeFileSync(outputPath, markdownString, 'utf-8');

        // Track stats
        totalJsonSize += jsonSize;
        totalMarkdownSize += markdownSize;
        conversions.push({ name, jsonSize, markdownSize, savings });

        console.log(`  ✅ ${name.padEnd(25)} ${this.formatSize(jsonSize)} → ${this.formatSize(markdownSize)} (${savings}% savings)`);
      } catch (error) {
        console.error(`  ❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Generate summary statistics
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Markdown Generation Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`Total Components:   ${conversions.length}`);
    console.log(`Total JSON Size:    ${this.formatSize(totalJsonSize)}`);
    console.log(`Total Markdown Size: ${this.formatSize(totalMarkdownSize)}`);

    const totalSavings = Math.round(((totalJsonSize - totalMarkdownSize) / totalJsonSize) * 100);
    console.log(`Total Savings:      ${this.formatSize(totalJsonSize - totalMarkdownSize)} (${totalSavings}%)`);

    const avgSavings = Math.round(conversions.reduce((sum, c) => sum + c.savings, 0) / conversions.length);
    console.log(`Average Savings:    ${avgSavings}%`);

    // Token estimation (rough: 1 token ≈ 4 characters)
    const jsonTokens = Math.round(totalJsonSize / 4);
    const markdownTokens = Math.round(totalMarkdownSize / 4);
    const tokenSavings = jsonTokens - markdownTokens;

    console.log(`\nEstimated Token Savings:`);
    console.log(`  JSON:     ~${jsonTokens.toLocaleString()} tokens`);
    console.log(`  Markdown: ~${markdownTokens.toLocaleString()} tokens`);
    console.log(`  Saved:    ~${tokenSavings.toLocaleString()} tokens`);

    // Top 5 best compressions
    const topSavings = conversions
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5);

    console.log(`\n🏆 Top 5 Components by Compression:`);
    topSavings.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name.padEnd(25)} ${c.savings}% savings`);
    });

    // Write metadata file
    const metadata = {
      generatedAt: new Date().toISOString(),
      componentsCount: conversions.length,
      totalJsonSize,
      totalMarkdownSize,
      totalSavings,
      avgSavings,
      estimatedTokens: {
        json: jsonTokens,
        markdown: markdownTokens,
        saved: tokenSavings,
      },
      components: conversions,
    };

    fs.writeFileSync(
      path.join(this.outputDir, '_metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );

    console.log(`\n✅ Generated ${conversions.length} Markdown files in ${this.outputDir}`);
    console.log(`📄 Metadata saved to ${path.join(this.outputDir, '_metadata.json')}`);
    console.log('\n🎉 Markdown generation complete!\n');
  }

  private toMarkdown(component: CombinedComponent): string {
    let md = `# ${component.name}\n\n`;

    // Description
    if (component.description) {
      md += `${component.description}\n\n`;
    }

    // Metadata
    const metadata: string[] = [];
    if (component.category) metadata.push(`**Category:** ${component.category}`);
    if (component.version) metadata.push(`**Version:** ${component.version}`);

    if (metadata.length > 0) {
      md += metadata.join(' | ') + '\n\n';
    }

    // Props
    if (component.props && Object.keys(component.props).length > 0) {
      md += `## Props\n\n`;

      for (const [propName, prop] of Object.entries(component.props)) {
        md += `### \`${propName}\`\n\n`;

        if (prop.description) {
          md += `${prop.description}\n\n`;
        }

        const propDetails: string[] = [];
        if (prop.type) propDetails.push(`**Type:** \`${prop.type}\``);
        if (prop.default !== undefined) {
          const defaultValue = typeof prop.default === 'string'
            ? `"${prop.default}"`
            : JSON.stringify(prop.default);
          propDetails.push(`**Default:** \`${defaultValue}\``);
        }
        if (prop.required) propDetails.push(`**Required**`);

        if (propDetails.length > 0) {
          md += propDetails.join(' | ') + '\n\n';
        }

        // Prop enrichments (valueFormat, examples)
        if (prop.valueFormat) {
          md += `**Value Format:**\n${prop.valueFormat}\n\n`;
        }

        if (prop.validator && prop.validator.enums) {
          md += `**Allowed values:** ${prop.validator.enums.map((v: any) => `\`${v}\``).join(', ')}\n\n`;
        }
      }
    }

    // Events
    if (component.emits && component.emits.length > 0) {
      md += `## Events\n\n`;

      component.emits.forEach((event: any) => {
        const eventName = event.name || event;
        md += `### \`${eventName}\`\n\n`;

        if (event.description) {
          md += `${event.description}\n\n`;
        }

        if (event.payload) {
          md += `**Payload:** \`${event.payload}\`\n\n`;
        }
      });
    }

    // Enums
    if (component.enums && component.enums.length > 0) {
      md += `## Enums\n\n`;

      component.enums.forEach((enumDef: any) => {
        md += `### ${enumDef.name}\n\n`;

        if (enumDef.values) {
          // Handle both array and object formats
          const values = Array.isArray(enumDef.values)
            ? enumDef.values
            : Object.values(enumDef.values);

          md += values.map((v: string) => `- \`${v}\``).join('\n') + '\n\n';
        }
      });
    }

    // Examples
    if (component.examples && component.examples.length > 0) {
      md += `## Examples\n\n`;

      component.examples.forEach((example: any, index: number) => {
        const title = example.title || `Example ${index + 1}`;
        md += `### ${title}\n\n`;

        if (example.description) {
          md += `${example.description}\n\n`;
        }

        if (example.code) {
          md += `\`\`\`vue\n${example.code}\n\`\`\`\n\n`;
        }

        if (example.raw) {
          md += `\`\`\`vue\n${example.raw}\n\`\`\`\n\n`;
        }
      });
    }

    // Common Mistakes
    if (component.commonMistakes && component.commonMistakes.length > 0) {
      md += `## Common Mistakes\n\n`;

      component.commonMistakes.forEach((mistake: any) => {
        const severity = mistake.severity || 'warning';
        const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';

        md += `${icon} **${mistake.mistake || mistake.title}**\n\n`;

        if (mistake.description) {
          md += `${mistake.description}\n\n`;
        }

        if (mistake.wrong) {
          md += `**Wrong:**\n\`\`\`vue\n${mistake.wrong}\n\`\`\`\n\n`;
        }

        if (mistake.correct) {
          md += `**Correct:**\n\`\`\`vue\n${mistake.correct}\n\`\`\`\n\n`;
        }
      });
    }

    // Best Practices
    if (component.bestPractices && component.bestPractices.length > 0) {
      md += `## Best Practices\n\n`;

      component.bestPractices.forEach((practice: any) => {
        if (typeof practice === 'string') {
          md += `- ${practice}\n`;
        } else {
          md += `- **${practice.title}:** ${practice.description}\n`;
        }
      });
      md += '\n';
    }

    // Related Components
    if (component.relatedComponents && component.relatedComponents.length > 0) {
      md += `## Related Components\n\n`;
      md += component.relatedComponents.map((c: string) => `- ${c}`).join('\n') + '\n\n';
    }

    // Imports
    if (component.imports) {
      md += `## Import\n\n`;
      md += `\`\`\`javascript\n`;
      md += `import { ${component.name} } from '@useinsider/design-system-vue';\n`;
      md += `import '@useinsider/design-system-vue/dist/design-system-vue.css';\n`;
      md += `\`\`\`\n\n`;
    }

    return md;
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  }
}

// Run generator
const generator = new MarkdownGenerator();
generator.generate().catch((error) => {
  console.error('\n❌ Markdown generation failed:', error);
  process.exit(1);
});
