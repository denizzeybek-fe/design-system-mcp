#!/usr/bin/env tsx

/**
 * Sync argTypes from storybook to enrichments
 *
 * Flow:
 * 1. Read combined.json to get ALL props for each component
 * 2. Read storybook file to get argTypes with options
 * 3. For each prop that has argTypes.options:
 *    - If prop exists in enrichment.propEnrichments → add/update possibleValues
 *    - If prop does NOT exist in enrichment.propEnrichments → create basic enrichment with possibleValues
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ENRICHMENTS_DIR = '/Users/deniz.zeybek/Documents/insider-projects/design-system-mcp/src/registry/enrichments';
const STORYBOOK_DIR = '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system/storybook/stories/5-library';
const COMBINED_JSON = '/Users/deniz.zeybek/Documents/insider-projects/design-system-mcp/data/combined.json';

interface PossibleValue {
  value: string;
  description: string;
}

interface PropEnrichment {
  valueFormat?: {
    structure?: string;
    notes?: string;
    typescript?: string;
    example?: string;
  };
  possibleValues?: PossibleValue[];
  [key: string]: any;
}

interface Enrichment {
  propEnrichments?: {
    [propName: string]: PropEnrichment;
  };
  [key: string]: any;
}

interface ComponentData {
  props: {
    [propName: string]: {
      type: string;
      required: boolean;
      default: any;
    };
  };
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function findStorybookFile(componentName: string): string | null {
  const kebabName = toKebabCase(componentName);

  // Try with V2/V1 suffix first, then without
  const searchNames = [
    kebabName,                                    // in-button-v2
    kebabName.replace(/-v[12]$/, ''),            // in-button (remove V2/V1)
  ];

  for (const version of ['v1', 'v2']) {
    const versionDir = join(STORYBOOK_DIR, version);
    try {
      const files = readdirSync(versionDir);

      // Try each search name
      for (const searchName of searchNames) {
        const match = files.find(f => f.includes(searchName) && f.endsWith('.stories.js'));
        if (match) return join(versionDir, match);
      }
    } catch (e) {}
  }
  return null;
}

/**
 * Extract argTypes from storybook content
 */
function extractArgTypes(content: string): Map<string, string[]> {
  const argTypesMap = new Map<string, string[]>();

  // Match both patterns:
  // 1. Default.argTypes = { ... }
  // 2. const argTypes = { ... }
  const regex = /(?:\.argTypes\s*=\s*\{|const\s+argTypes\s*=\s*\{)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const startIndex = match.index + match[0].length - 1;

    let braceCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = '';
    let escaped = false;

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }

      if ((char === '"' || char === "'" || char === '`') && !inString) {
        inString = true;
        stringChar = char;
        continue;
      }
      if (inString && char === stringChar) {
        inString = false;
        continue;
      }

      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }

    if (endIndex > startIndex) {
      const block = content.substring(startIndex, endIndex + 1);

      const lines = block.split('\n');
      let currentProp = '';
      let inOptionsArray = false;
      let optionsContent = '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//')) continue;

        const propMatch = trimmed.match(/^(\w+):\s*\{/);
        if (propMatch) {
          currentProp = propMatch[1];
          if (currentProp === 'control' || currentProp === 'table' || currentProp === 'parameters') {
            currentProp = '';
          }
          continue;
        }

        if (currentProp && trimmed.includes('options:')) {
          const optionsMatch = trimmed.match(/options:\s*\[(.+)\]/);
          if (optionsMatch) {
            optionsContent = optionsMatch[1];
            inOptionsArray = false;
          } else if (trimmed.includes('options:') && trimmed.includes('[')) {
            inOptionsArray = true;
            const afterBracket = trimmed.substring(trimmed.indexOf('[') + 1);
            optionsContent = afterBracket;

            if (afterBracket.includes(']')) {
              inOptionsArray = false;
              optionsContent = afterBracket.substring(0, afterBracket.indexOf(']'));
            }
          }
        } else if (inOptionsArray) {
          if (trimmed.includes(']')) {
            inOptionsArray = false;
            const beforeBracket = trimmed.substring(0, trimmed.indexOf(']'));
            optionsContent += ' ' + beforeBracket;
          } else {
            optionsContent += ' ' + trimmed;
          }
        }

        if (currentProp && optionsContent && !inOptionsArray) {
          const options = parseOptionsArray(optionsContent);

          if (options.length > 0 && !argTypesMap.has(currentProp)) {
            argTypesMap.set(currentProp, options);
          }

          currentProp = '';
          optionsContent = '';
        }

        if (trimmed.includes('},') || trimmed === '}') {
          currentProp = '';
          optionsContent = '';
          inOptionsArray = false;
        }
      }
    }
  }

  return argTypesMap;
}

function parseOptionsArray(content: string): string[] {
  const trimmed = content.trim();
  if (trimmed.match(/^[A-Z]\w+/)) {
    return [];
  }

  const options = content
    .split(',')
    .map(opt => {
      let cleaned = opt.trim();
      cleaned = cleaned.replace(/^['\"`]|['\"`]$/g, '');
      return cleaned;
    })
    .filter(opt => {
      if (!opt) return false;
      if (opt.includes('[') || opt.includes(']')) return false;
      if (opt.match(/^[A-Z]\w+$/)) return false;
      return true;
    });

  return options;
}

function createBasicEnrichment(propType: string, options: string[]): PropEnrichment {
  const possibleValues: PossibleValue[] = options.map(value => ({
    value,
    description: `TODO: Add description for '${value}'`
  }));

  const typescript = options.map(v => `'${v}'`).join(' | ');

  return {
    valueFormat: {
      structure: typescript,
      notes: 'TODO: Add usage notes',
      typescript,
      example: `TODO: Add example for ${options[0]}`
    },
    possibleValues
  };
}

function main() {
  console.log('🔄 Syncing argTypes from storybook to enrichments...\n');

  // Read combined.json
  const combinedContent = readFileSync(COMBINED_JSON, 'utf-8');
  const combined = JSON.parse(combinedContent);

  const enrichmentFiles = readdirSync(ENRICHMENTS_DIR)
    .filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');

  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalPropsAdded = 0;
  let totalPropsUpdated = 0;

  for (const file of enrichmentFiles) {
    const componentName = file.replace('.json', '');
    const enrichmentPath = join(ENRICHMENTS_DIR, file);

    // Read enrichment
    const enrichmentContent = readFileSync(enrichmentPath, 'utf-8');
    const enrichment: Enrichment = JSON.parse(enrichmentContent);

    // Get component data from combined.json
    const componentData: ComponentData | undefined = combined.components[componentName];
    if (!componentData || !componentData.props) {
      console.log(`⚠️  ${componentName} - Not in combined.json`);
      continue;
    }

    // Find storybook file
    const storybookFile = findStorybookFile(componentName);
    if (!storybookFile) {
      console.log(`⚠️  ${componentName} - No storybook file`);
      continue;
    }

    totalProcessed++;

    // Extract argTypes
    const storybookContent = readFileSync(storybookFile, 'utf-8');
    const argTypes = extractArgTypes(storybookContent);

    if (argTypes.size === 0) {
      console.log(`⚠️  ${componentName} - No argTypes in storybook`);
      continue;
    }

    console.log(`✅ ${componentName} - Found ${argTypes.size} argTypes`);

    let componentUpdated = false;
    let propsAdded = 0;
    let propsUpdated = 0;

    // Initialize propEnrichments if not exists
    if (!enrichment.propEnrichments) {
      enrichment.propEnrichments = {};
    }

    // For each argType with options
    for (const [propName, options] of argTypes.entries()) {
      // Check if prop exists in component props
      if (!componentData.props[propName]) {
        console.log(`   ⚠️  ${propName} - Not in component props (skipping)`);
        continue;
      }

      const propType = componentData.props[propName].type;

      // Check if prop exists in enrichment
      if (!enrichment.propEnrichments[propName]) {
        // Create new enrichment
        enrichment.propEnrichments[propName] = createBasicEnrichment(propType, options);
        console.log(`   ➕ ${propName}: Created enrichment with possibleValues [${options.join(', ')}]`);
        componentUpdated = true;
        propsAdded++;
      } else {
        // Update existing enrichment
        const existingEnrichment = enrichment.propEnrichments[propName];

        if (!existingEnrichment.possibleValues) {
          // Add possibleValues
          existingEnrichment.possibleValues = options.map(value => ({
            value,
            description: `TODO: Add description for '${value}'`
          }));
          console.log(`   ➕ ${propName}: Added possibleValues [${options.join(', ')}]`);
          componentUpdated = true;
          propsUpdated++;
        } else {
          // Check if values match
          const existingValues = existingEnrichment.possibleValues.map(pv => pv.value);
          const existingSet = new Set(existingValues);
          const newSet = new Set(options);

          const match = existingSet.size === newSet.size &&
                       [...existingSet].every(v => newSet.has(v));

          if (!match) {
            existingEnrichment.possibleValues = options.map(value => ({
              value,
              description: `TODO: Add description for '${value}'`
            }));
            console.log(`   🔄 ${propName}: Updated possibleValues [${options.join(', ')}]`);
            console.log(`      Old: [${existingValues.join(', ')}]`);
            componentUpdated = true;
            propsUpdated++;
          } else {
            console.log(`   ✓ ${propName}: Already has correct possibleValues`);
          }
        }
      }
    }

    // Write back if updated
    if (componentUpdated) {
      writeFileSync(enrichmentPath, JSON.stringify(enrichment, null, 2) + '\n');
      totalUpdated++;
      totalPropsAdded += propsAdded;
      totalPropsUpdated += propsUpdated;
      console.log(`   💾 Updated ${componentName}.json (+${propsAdded} new, ~${propsUpdated} updated)\n`);
    } else {
      console.log(`   ✓ No updates needed\n`);
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Total enrichments: ${enrichmentFiles.length}`);
  console.log(`   Processed with storybook: ${totalProcessed}`);
  console.log(`   Files updated: ${totalUpdated}`);
  console.log(`   Props added: ${totalPropsAdded}`);
  console.log(`   Props updated: ${totalPropsUpdated}`);
  console.log(`   Total changes: ${totalPropsAdded + totalPropsUpdated}`);
}

main();
