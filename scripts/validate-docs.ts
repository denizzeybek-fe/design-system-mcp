import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseVue } from '@vue/compiler-sfc';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DS_PATH = process.env.DS_PATH || '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system';
const COMPONENTS_DIR = join(DS_PATH, 'src/components');
const ENRICHMENTS_DIR = join(__dirname, '../src/registry/enrichments');

// Validation severity levels
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface ValidationIssue {
  file: string;
  severity: Severity;
  message: string;
  fix?: string;
}

interface ComponentValidation {
  component: string;
  passed: boolean;
  issues: ValidationIssue[];
  checks: {
    readmeExists: boolean;
    dtsExists: boolean;
    jsdocComplete: boolean;
    propsInReadme: boolean;
    enrichmentExists: boolean;
    typesMatch: boolean;
  };
}

interface ValidationReport {
  timestamp: string;
  totalComponents: number;
  passedComponents: number;
  failedComponents: number;
  components: ComponentValidation[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

/**
 * Extracts props from Vue component file
 */
function extractPropsFromVue(componentPath: string): Map<string, { hasJSDoc: boolean; type: string }> {
  const props = new Map<string, { hasJSDoc: boolean; type: string }>();

  if (!existsSync(componentPath)) {
    return props;
  }

  const source = readFileSync(componentPath, 'utf-8');
  const { descriptor } = parseVue(source);

  if (!descriptor.script && !descriptor.scriptSetup) {
    return props;
  }

  const scriptContent = (descriptor.scriptSetup?.content || descriptor.script?.content) || '';

  // Find props block (Options API)
  const propsStartMatch = scriptContent.match(/props:\s*\{/);
  if (!propsStartMatch) return props;

  const startIndex = propsStartMatch.index! + propsStartMatch[0].length;
  let braceCount = 1;
  let endIndex = startIndex;

  for (let i = startIndex; i < scriptContent.length; i++) {
    if (scriptContent[i] === '{') braceCount++;
    if (scriptContent[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  const propsBlock = scriptContent.substring(startIndex, endIndex);
  const lines = scriptContent.split('\n');

  // Extract each prop
  const propLines = propsBlock.split('\n').filter(line => line.trim());

  for (let i = 0; i < propLines.length; i++) {
    const line = propLines[i].trim();
    const propNameMatch = line.match(/^(\w+):\s*\{/);

    if (!propNameMatch) continue;

    const propName = propNameMatch[1];

    // Find the line number in original script
    const propLineIndex = scriptContent.indexOf(line);
    const linesBefore = scriptContent.substring(0, propLineIndex).split('\n').length;

    // Check for JSDoc comment above prop (within 10 lines)
    let hasJSDoc = false;
    for (let j = Math.max(0, linesBefore - 10); j < linesBefore; j++) {
      const checkLine = lines[j];
      if (checkLine.includes(`* @type`) || checkLine.includes(`@example`) || checkLine.includes(`@default`)) {
        hasJSDoc = true;
        break;
      }
    }

    // Extract type
    let propDef = line;
    let propBraceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

    while (propBraceCount > 0 && i < propLines.length - 1) {
      i++;
      propDef += ' ' + propLines[i].trim();
      propBraceCount += (propLines[i].match(/\{/g) || []).length;
      propBraceCount -= (propLines[i].match(/\}/g) || []).length;
    }

    const typeMatch = propDef.match(/type:\s*(\w+(?:\s*\|\s*\w+)*)/);
    const type = typeMatch ? typeMatch[1].replace(/\s+/g, '|') : 'any';

    props.set(propName, { hasJSDoc, type });
  }

  return props;
}

/**
 * Checks if README.md includes all props in props table
 */
function validateReadmeProps(componentDir: string, propsFromVue: Map<string, any>): boolean {
  const readmePath = join(componentDir, 'README.md');

  if (!existsSync(readmePath)) {
    return false;
  }

  const readmeContent = readFileSync(readmePath, 'utf-8');

  // Check if each prop appears in the README
  for (const propName of propsFromVue.keys()) {
    // Look for prop in markdown table format or code blocks
    const propRegex = new RegExp(`\`${propName}\`|${propName}:`, 'i');
    if (!propRegex.test(readmeContent)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if .d.ts file includes all props
 */
function validateDtsProps(componentDir: string, componentName: string, propsFromVue: Map<string, any>): boolean {
  const dtsPath = join(componentDir, `${componentName}.d.ts`);

  if (!existsSync(dtsPath)) {
    return false;
  }

  const dtsContent = readFileSync(dtsPath, 'utf-8');
  const lines = dtsContent.split('\n');

  // Find the Props interface with proper brace counting
  const propsInterfaceRegex = new RegExp(`interface ${componentName}Props\\s*\\{`, 'i');
  const interfaceStartIndex = lines.findIndex(line => propsInterfaceRegex.test(line));

  if (interfaceStartIndex === -1) {
    return false;
  }

  // Find interface end by counting braces
  let braceCount = 0;
  let interfaceEndIndex = interfaceStartIndex;
  let startCounting = false;

  for (let i = interfaceStartIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) {
      startCounting = true;
      braceCount += (line.match(/\{/g) || []).length;
    }
    if (line.includes('}')) {
      braceCount -= (line.match(/\}/g) || []).length;
    }
    if (startCounting && braceCount === 0) {
      interfaceEndIndex = i;
      break;
    }
  }

  const interfaceContent = lines.slice(interfaceStartIndex, interfaceEndIndex + 1).join('\n');

  // Check if each prop appears in interface
  for (const propName of propsFromVue.keys()) {
    const propRegex = new RegExp(`\\b${propName}[?:]`, 'i');
    if (!propRegex.test(interfaceContent)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if enrichment file exists for component
 */
function hasEnrichmentFile(componentName: string): boolean {
  const enrichmentPath = join(ENRICHMENTS_DIR, `${componentName}.json`);
  return existsSync(enrichmentPath);
}

/**
 * Determines if component needs enrichment (has complex props)
 */
function needsEnrichment(propsFromVue: Map<string, { hasJSDoc: boolean; type: string }>): boolean {
  for (const [, propData] of propsFromVue) {
    // Complex types that should have enrichments
    if (propData.type.includes('Array') || propData.type.includes('Object')) {
      return true;
    }
  }
  return false;
}

/**
 * Validates a single component
 */
function validateComponent(componentDir: string, componentName: string): ComponentValidation {
  const issues: ValidationIssue[] = [];
  const componentPath = join(componentDir, `${componentName}.vue`);
  const readmePath = join(componentDir, 'README.md');
  const dtsPath = join(componentDir, `${componentName}.d.ts`);

  // Extract props from Vue file
  const propsFromVue = extractPropsFromVue(componentPath);

  // Check 1: README.md exists
  const readmeExists = existsSync(readmePath);
  if (!readmeExists) {
    issues.push({
      file: 'README.md',
      severity: 'high',
      message: 'README.md file is missing',
      fix: `Create ${readmePath} with component documentation`
    });
  }

  // Check 2: .d.ts exists
  const dtsExists = existsSync(dtsPath);
  if (!dtsExists) {
    issues.push({
      file: `${componentName}.d.ts`,
      severity: 'high',
      message: 'TypeScript definition file is missing',
      fix: `Create ${dtsPath} with type definitions`
    });
  }

  // Check 3: JSDoc completeness (all props have JSDoc)
  let jsdocComplete = true;
  const propsWithoutJSDoc: string[] = [];

  for (const [propName, propData] of propsFromVue) {
    if (!propData.hasJSDoc) {
      jsdocComplete = false;
      propsWithoutJSDoc.push(propName);
    }
  }

  if (!jsdocComplete) {
    issues.push({
      file: `${componentName}.vue`,
      severity: 'critical',
      message: `${propsWithoutJSDoc.length} props missing JSDoc: ${propsWithoutJSDoc.slice(0, 3).join(', ')}${propsWithoutJSDoc.length > 3 ? '...' : ''}`,
      fix: 'Add JSDoc comments with @type, @default, and @example tags for all props'
    });
  }

  // Check 4: Props in README table
  const propsInReadme = readmeExists && validateReadmeProps(componentDir, propsFromVue);
  if (readmeExists && !propsInReadme) {
    issues.push({
      file: 'README.md',
      severity: 'high',
      message: 'Not all props are documented in README props table',
      fix: 'Add missing props to the Props section in README.md'
    });
  }

  // Check 5: Enrichment file exists (if needed)
  const shouldHaveEnrichment = needsEnrichment(propsFromVue);
  const enrichmentExists = hasEnrichmentFile(componentName);

  if (shouldHaveEnrichment && !enrichmentExists) {
    issues.push({
      file: `${componentName}.json`,
      severity: 'medium',
      message: 'Component has complex props but no enrichment file',
      fix: `Create enrichment file at ${ENRICHMENTS_DIR}/${componentName}.json`
    });
  }

  // Check 6: Types match between .vue and .d.ts
  const typesMatch = dtsExists && validateDtsProps(componentDir, componentName, propsFromVue);
  if (dtsExists && !typesMatch) {
    issues.push({
      file: `${componentName}.d.ts`,
      severity: 'critical',
      message: 'TypeScript definitions do not match component props',
      fix: 'Update .d.ts interface to include all props from component'
    });
  }

  return {
    component: componentName,
    passed: issues.length === 0,
    issues,
    checks: {
      readmeExists,
      dtsExists,
      jsdocComplete,
      propsInReadme,
      enrichmentExists: !shouldHaveEnrichment || enrichmentExists,
      typesMatch: !dtsExists || typesMatch
    }
  };
}

/**
 * Validates all components or specific components
 */
function validateComponents(specificComponents?: string[]): ValidationReport {
  const components: ComponentValidation[] = [];
  const summary = { critical: 0, high: 0, medium: 0, low: 0 };

  if (!existsSync(COMPONENTS_DIR)) {
    console.error(`❌ Components directory not found: ${COMPONENTS_DIR}`);
    console.error('Please set DS_PATH environment variable to your design system path');
    process.exit(1);
  }

  const entries = readdirSync(COMPONENTS_DIR);

  for (const entry of entries) {
    const entryPath = join(COMPONENTS_DIR, entry);

    if (!statSync(entryPath).isDirectory()) continue;

    const componentName = entry;

    // Skip if specific components requested and this isn't one of them
    if (specificComponents && !specificComponents.includes(componentName)) {
      continue;
    }

    console.log(`🔍 Validating: ${componentName}`);

    const validation = validateComponent(entryPath, componentName);
    components.push(validation);

    // Count issues by severity
    validation.issues.forEach(issue => {
      summary[issue.severity]++;
    });

    // Print results
    if (validation.passed) {
      console.log(`  ✅ PASSED - All documentation in sync`);
    } else {
      console.log(`  ❌ FAILED - ${validation.issues.length} issues found`);
      validation.issues.forEach(issue => {
        const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '⚪';
        console.log(`     ${icon} [${issue.severity.toUpperCase()}] ${issue.file}: ${issue.message}`);
      });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    totalComponents: components.length,
    passedComponents: components.filter(c => c.passed).length,
    failedComponents: components.filter(c => !c.passed).length,
    components,
    summary
  };
}

/**
 * Prints validation report summary
 */
function printSummary(report: ValidationReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`\n⏰ Timestamp: ${report.timestamp}`);
  console.log(`📦 Total Components: ${report.totalComponents}`);
  console.log(`✅ Passed: ${report.passedComponents} (${Math.round(report.passedComponents / report.totalComponents * 100)}%)`);
  console.log(`❌ Failed: ${report.failedComponents} (${Math.round(report.failedComponents / report.totalComponents * 100)}%)`);

  console.log('\n🚨 Issues by Severity:');
  console.log(`  🔴 Critical: ${report.summary.critical}`);
  console.log(`  🟠 High: ${report.summary.high}`);
  console.log(`  🟡 Medium: ${report.summary.medium}`);
  console.log(`  ⚪ Low: ${report.summary.low}`);

  const totalIssues = report.summary.critical + report.summary.high + report.summary.medium + report.summary.low;
  console.log(`\n📋 Total Issues: ${totalIssues}`);

  if (report.failedComponents > 0) {
    console.log('\n❌ Failed Components:');
    report.components
      .filter(c => !c.passed)
      .forEach(c => {
        console.log(`\n  📦 ${c.component}:`);
        console.log(`     Checks: ${Object.entries(c.checks).filter(([, v]) => v).length}/${Object.keys(c.checks).length} passed`);
        c.issues.slice(0, 2).forEach(issue => {
          const icon = issue.severity === 'critical' ? '🔴' : issue.severity === 'high' ? '🟠' : issue.severity === 'medium' ? '🟡' : '⚪';
          console.log(`     ${icon} ${issue.message}`);
        });
        if (c.issues.length > 2) {
          console.log(`     ... and ${c.issues.length - 2} more issues`);
        }
      });
  }

  console.log('\n' + '='.repeat(80));

  // Exit with error code if validation failed
  if (report.failedComponents > 0 || report.summary.critical > 0) {
    console.log('❌ Validation FAILED');
    process.exit(1);
  } else {
    console.log('✅ Validation PASSED');
    process.exit(0);
  }
}

/**
 * Main execution function
 */
function main(): void {
  console.log('🚀 Starting documentation validation...\n');
  console.log(`📂 Design System Path: ${DS_PATH}`);
  console.log(`📂 Components Directory: ${COMPONENTS_DIR}\n`);

  // Check for specific component argument
  const specificComponents = process.argv.slice(2);

  if (specificComponents.length > 0) {
    console.log(`🎯 Validating specific components: ${specificComponents.join(', ')}\n`);
  }

  const report = validateComponents(specificComponents.length > 0 ? specificComponents : undefined);

  printSummary(report);
}

// Execute
main();
