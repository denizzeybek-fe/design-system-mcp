#!/usr/bin/env tsx

/**
 * Validate Enrichment Files Against Standard Schema
 *
 * Checks all enrichment files to see which ones comply with the standard schema
 * defined in _TEMPLATE.json and enrichment-schema.ts
 */

import fs from 'fs';
import path from 'path';
import { REQUIRED_FIELDS, RECOMMENDED_FIELDS, FIELD_ORDER } from '../src/types/enrichment-schema.js';

interface ValidationResult {
  file: string;
  compliant: boolean;
  issues: string[];
  missingRequired: string[];
  missingRecommended: string[];
  extraFields: string[];
  fieldOrder: string[];
}

class EnrichmentValidator {
  private enrichmentDir = 'src/registry/enrichments';

  async validate(): Promise<void> {
    console.log('🔍 Validating enrichment files against standard schema...\n');

    const files = fs.readdirSync(this.enrichmentDir)
      .filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');

    const results: ValidationResult[] = [];

    for (const file of files) {
      const result = this.validateFile(file);
      results.push(result);
    }

    // Print summary
    this.printSummary(results);
  }

  private validateFile(filename: string): ValidationResult {
    const filePath = path.join(this.enrichmentDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    const actualFields = Object.keys(data);
    const issues: string[] = [];
    const missingRequired: string[] = [];
    const missingRecommended: string[] = [];
    const extraFields: string[] = [];

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!actualFields.includes(field)) {
        missingRequired.push(field);
        issues.push(`Missing REQUIRED field: ${field}`);
      }
    }

    // Check recommended fields
    for (const field of RECOMMENDED_FIELDS) {
      if (!actualFields.includes(field) && !REQUIRED_FIELDS.includes(field)) {
        missingRecommended.push(field);
      }
    }

    // Check for extra fields not in schema
    for (const field of actualFields) {
      if (!FIELD_ORDER.includes(field as any)) {
        extraFields.push(field);
        issues.push(`Extra field not in schema: ${field}`);
      }
    }

    // Check field structure
    if (data.component && typeof data.component !== 'string') {
      issues.push('component field must be a string');
    }

    if (data._metadata) {
      if (!data._metadata.lastUpdated) {
        issues.push('_metadata.lastUpdated is missing');
      }
      if (!data._metadata.propsHash) {
        issues.push('_metadata.propsHash is missing');
      }
      if (typeof data._metadata.propCount !== 'number') {
        issues.push('_metadata.propCount must be a number');
      }
    }

    if (data.propEnrichments) {
      if (typeof data.propEnrichments !== 'object') {
        issues.push('propEnrichments must be an object');
      } else {
        // Check prop enrichment structure
        for (const [propName, enrichment] of Object.entries(data.propEnrichments)) {
          if (!enrichment || typeof enrichment !== 'object') {
            issues.push(`propEnrichments.${propName} must be an object`);
            continue;
          }

          const propEnrich = enrichment as any;
          if (!propEnrich.valueFormat) {
            issues.push(`propEnrichments.${propName}.valueFormat is missing`);
          } else {
            if (!propEnrich.valueFormat.structure) {
              issues.push(`propEnrichments.${propName}.valueFormat.structure is missing`);
            }
            if (!propEnrich.valueFormat.notes) {
              issues.push(`propEnrichments.${propName}.valueFormat.notes is missing`);
            }
            if (!propEnrich.valueFormat.typescript) {
              issues.push(`propEnrichments.${propName}.valueFormat.typescript is missing`);
            }
          }

          // Check commonMistakes structure
          if (propEnrich.commonMistakes && Array.isArray(propEnrich.commonMistakes)) {
            for (const mistake of propEnrich.commonMistakes) {
              if (!mistake.mistake || !mistake.impact || !mistake.fix || !mistake.severity) {
                issues.push(`propEnrichments.${propName}.commonMistakes has incomplete entries`);
              }
            }
          }
        }
      }
    }

    const compliant = missingRequired.length === 0 && issues.length === 0;

    return {
      file: filename,
      compliant,
      issues,
      missingRequired,
      missingRecommended,
      extraFields,
      fieldOrder: actualFields,
    };
  }

  private printSummary(results: ValidationResult[]): void {
    const compliant = results.filter(r => r.compliant);
    const nonCompliant = results.filter(r => !r.compliant);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Validation Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`Total files: ${results.length}`);
    console.log(`✅ Compliant: ${compliant.length}`);
    console.log(`❌ Non-compliant: ${nonCompliant.length}\n`);

    if (compliant.length > 0) {
      console.log('✅ COMPLIANT FILES:\n');
      compliant.forEach(r => {
        console.log(`  ✓ ${r.file}`);
      });
      console.log('');
    }

    if (nonCompliant.length > 0) {
      console.log('❌ NON-COMPLIANT FILES:\n');

      nonCompliant.forEach(r => {
        console.log(`  ❌ ${r.file}`);

        if (r.missingRequired.length > 0) {
          console.log(`     Missing REQUIRED: ${r.missingRequired.join(', ')}`);
        }

        if (r.missingRecommended.length > 0) {
          console.log(`     Missing recommended: ${r.missingRecommended.join(', ')}`);
        }

        if (r.extraFields.length > 0) {
          console.log(`     Extra fields: ${r.extraFields.join(', ')}`);
        }

        if (r.issues.length > 0) {
          console.log(`     Issues:`);
          r.issues.forEach(issue => {
            console.log(`       - ${issue}`);
          });
        }

        console.log('');
      });
    }

    // Detailed breakdown
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Detailed Breakdown');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Group by issue type
    const missingComponentField = nonCompliant.filter(r => r.missingRequired.includes('component'));
    const missingMetadata = nonCompliant.filter(r => r.missingRequired.includes('_metadata'));
    const missingPropEnrichments = nonCompliant.filter(r => r.missingRequired.includes('propEnrichments'));
    const hasExtraFields = nonCompliant.filter(r => r.extraFields.length > 0);

    if (missingComponentField.length > 0) {
      console.log(`⚠️  Missing 'component' field (${missingComponentField.length}):`);
      missingComponentField.forEach(r => console.log(`   - ${r.file}`));
      console.log('');
    }

    if (missingMetadata.length > 0) {
      console.log(`⚠️  Missing '_metadata' field (${missingMetadata.length}):`);
      missingMetadata.forEach(r => console.log(`   - ${r.file}`));
      console.log('');
    }

    if (missingPropEnrichments.length > 0) {
      console.log(`⚠️  Missing 'propEnrichments' field (${missingPropEnrichments.length}):`);
      missingPropEnrichments.forEach(r => console.log(`   - ${r.file}`));
      console.log('');
    }

    if (hasExtraFields.length > 0) {
      console.log(`⚠️  Has extra fields not in schema (${hasExtraFields.length}):`);
      hasExtraFields.forEach(r => {
        console.log(`   - ${r.file}: ${r.extraFields.join(', ')}`);
      });
      console.log('');
    }

    // Recommendations
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Recommendations');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (nonCompliant.length > 0) {
      console.log('To fix non-compliant files:');
      console.log('1. Review src/registry/enrichments/_TEMPLATE.json');
      console.log('2. Check src/types/enrichment-schema.ts for type definitions');
      console.log('3. Use InRibbons.json as the gold standard example');
      console.log('4. Ensure all files have: component, _metadata, propEnrichments');
      console.log('5. Remove any extra fields not defined in schema\n');
    } else {
      console.log('🎉 All enrichment files are compliant with the standard schema!\n');
    }
  }
}

// Run validation
const validator = new EnrichmentValidator();
validator.validate().catch((error) => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
