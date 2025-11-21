import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { globby } from 'globby';
import * as cheerio from 'cheerio';

// Configuration
const DS_PATH = process.env.DS_PATH || '/Users/deniz.zeybek/Documents/insider-projects/insider-design-system';
const STORYBOOK_DIR = `${DS_PATH}/storybook/stories`;
const OUTPUT_PATH = resolve('data/storybook.json');

// Type definitions
interface CodeExample {
  title: string;
  code: string;
  language: string;
  description?: string;
}

interface StorybookData {
  component: string;
  examples: CodeExample[];
  description?: string;
  categories?: string[];
}

type StorybookMap = Record<string, StorybookData>;

/**
 * Extracts code blocks from MDX content
 */
function extractCodeBlocks(content: string): CodeExample[] {
  const examples: CodeExample[] = [];

  // Pattern 1: ```vue ... ```
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content))) {
    const language = match[1];
    const code = match[2].trim();

    // Only include Vue, JavaScript, and TypeScript code
    if (['vue', 'javascript', 'typescript', 'js', 'ts', 'html'].includes(language.toLowerCase())) {
      // Try to find a title from nearby heading
      const beforeCode = content.substring(0, match.index);
      const lastHeading = beforeCode.match(/#{1,4}\s+(.+)$/m);

      examples.push({
        title: lastHeading ? lastHeading[1].trim() : 'Example',
        code,
        language
      });
    }
  }

  // Pattern 2: <Canvas> or <Preview> components with source
  const canvasRegex = /<(?:Canvas|Preview).*?>([\s\S]*?)<\/(?:Canvas|Preview)>/g;

  while ((match = canvasRegex.exec(content))) {
    const canvasContent = match[1];

    // Extract code from within Canvas
    const innerCodeMatch = canvasContent.match(/```(\w+)\n([\s\S]*?)```/);
    if (innerCodeMatch) {
      examples.push({
        title: 'Story Example',
        code: innerCodeMatch[2].trim(),
        language: innerCodeMatch[1]
      });
    }
  }

  return examples;
}

/**
 * Extracts description from MDX frontmatter or content
 */
function extractDescription(content: string): string | undefined {
  // Try frontmatter
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const descMatch = frontmatter.match(/description:\s*(.+)/);
    if (descMatch) return descMatch[1].trim().replace(/['"]/g, '');
  }

  // Try first paragraph
  const paragraphMatch = content.match(/^[^#\n].*$/m);
  if (paragraphMatch) {
    return paragraphMatch[0].trim();
  }

  return undefined;
}

/**
 * Extracts categories/tags from MDX
 */
function extractCategories(content: string): string[] {
  const categories: string[] = [];

  // From frontmatter
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
    if (tagsMatch) {
      const tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
      categories.push(...tags);
    }
  }

  return categories;
}

/**
 * Determines component name from file path
 */
function getComponentNameFromPath(filePath: string): string {
  // Extract component name from path like: storybook/stories/components/InButton.stories.mdx
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];

  // Remove .stories.mdx
  return fileName.replace(/\.stories\.mdx?$/, '');
}

/**
 * Processes a single Storybook MDX file
 */
function processStorybookFile(filePath: string): StorybookData | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const componentName = getComponentNameFromPath(filePath);

    const examples = extractCodeBlocks(content);
    const description = extractDescription(content);
    const categories = extractCategories(content);

    // Only include if we found examples
    if (examples.length === 0) {
      return null;
    }

    return {
      component: componentName,
      examples,
      description,
      categories: categories.length > 0 ? categories : undefined
    };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * Scans Storybook directory for MDX files
 */
async function scanStorybook(): Promise<StorybookMap> {
  const storybook: StorybookMap = {};

  if (!existsSync(STORYBOOK_DIR)) {
    console.warn(`⚠️  Storybook directory not found: ${STORYBOOK_DIR}`);
    return storybook;
  }

  // Find all .stories.mdx files
  const files = await globby([
    `${STORYBOOK_DIR}/**/*.stories.mdx`,
    `${STORYBOOK_DIR}/**/*.stories.md`
  ]);

  console.log(`📚 Found ${files.length} Storybook files\n`);

  for (const file of files) {
    console.log(`🔍 Processing: ${file.replace(STORYBOOK_DIR, '')}`);

    const data = processStorybookFile(file);

    if (data) {
      storybook[data.component] = data;
      console.log(`  ✅ Extracted ${data.examples.length} examples`);
    } else {
      console.log(`  ⚠️  No examples found`);
    }
  }

  return storybook;
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Storybook extraction...\n');
  console.log(`📂 Storybook Path: ${STORYBOOK_DIR}\n`);

  const storybook = await scanStorybook();

  // Write results
  writeFileSync(OUTPUT_PATH, JSON.stringify(storybook, null, 2));

  console.log(`\n✅ Successfully extracted Storybook data for ${Object.keys(storybook).length} components`);
  console.log(`📁 Output written to: ${OUTPUT_PATH}`);

  // Stats
  const totalExamples = Object.values(storybook).reduce((sum, s) => sum + s.examples.length, 0);
  const withDescription = Object.values(storybook).filter(s => s.description).length;

  console.log('\n📊 Statistics:');
  console.log(`   Components with stories: ${Object.keys(storybook).length}`);
  console.log(`   Total examples: ${totalExamples}`);
  console.log(`   With descriptions: ${withDescription}`);
}

// Execute
main().catch(console.error);
