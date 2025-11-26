import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache for markdown content
let markdownCache: Map<string, string> = new Map();
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get the path to markdown directory
 */
function getMarkdownDir(): string {
  // When running from built dist/index.js: dist -> data/markdown
  const paths = [
    join(__dirname, 'data/markdown'),
    join(__dirname, '../data/markdown'),
    join(__dirname, '../../data/markdown'),
  ];

  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error('Markdown directory not found. Please run: npm run generate:markdown');
}

/**
 * Load markdown content for a component
 */
export function getComponentMarkdown(name: string): string | null {
  const isDev = process.env.NODE_ENV !== 'production';
  const now = Date.now();

  // Clear cache in dev mode or if TTL expired
  if (isDev || (now - cacheTimestamp) > CACHE_TTL) {
    markdownCache.clear();
    cacheTimestamp = now;
  }

  // Return from cache if available
  if (markdownCache.has(name)) {
    return markdownCache.get(name)!;
  }

  // Load from file
  try {
    const markdownDir = getMarkdownDir();
    const filePath = join(markdownDir, `${name}.md`);

    if (!existsSync(filePath)) {
      return null;
    }

    const content = readFileSync(filePath, 'utf-8');
    markdownCache.set(name, content);

    return content;
  } catch (error) {
    console.error(`Failed to load markdown for ${name}:`, error);
    return null;
  }
}

/**
 * Get list of all available components
 */
export function getAllComponentNames(): string[] {
  try {
    const markdownDir = getMarkdownDir();
    const files = readdirSync(markdownDir);

    return files
      .filter(f => f.endsWith('.md') && !f.startsWith('_'))
      .map(f => f.replace('.md', ''))
      .sort();
  } catch (error) {
    console.error('Failed to list components:', error);
    return [];
  }
}

/**
 * Get metadata from markdown directory
 */
export function getMarkdownMetadata(): any {
  try {
    const markdownDir = getMarkdownDir();
    const metadataPath = join(markdownDir, '_metadata.json');

    if (!existsSync(metadataPath)) {
      return null;
    }

    const content = readFileSync(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load markdown metadata:', error);
    return null;
  }
}

/**
 * Check if markdown files are available
 */
export function isMarkdownAvailable(): boolean {
  try {
    getMarkdownDir();
    return true;
  } catch {
    return false;
  }
}
