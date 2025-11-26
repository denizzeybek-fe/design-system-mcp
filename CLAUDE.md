# CLAUDE.md

This file provides guidance to Claude Code and other AI assistants when using the Insider Design System MCP server.

## 🎯 Code Writing Conventions

**IMPORTANT:** When writing code for this project, always follow these rules:

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| **TypeScript source** | `kebab-case.ts` | `smart-enrichment-selector.ts` |
| **TypeScript types** | `kebab-case.ts` | `enrichment-options.ts` |
| **Test files** | `kebab-case.test.ts` | `enrichment-filter.test.ts` |
| **Scripts** | `kebab-case.sh/ts` | `validate-conventions.sh` |
| **Documentation** | `kebab-case.md` | `smart-filter-layer.md` |

**Exceptions:**
- Root-level docs: `README.md`, `CLAUDE.md`, `GOVERNANCE.md` (UPPERCASE allowed)
- React/Vue components: `PascalCase.tsx/vue` (not used in this project)

### Variable & Function Naming

```typescript
// ✅ CORRECT
const componentAdapter = new ComponentAdapter();        // camelCase variables
function selectEnrichments() { }                        // camelCase functions
class EnrichmentFilter { }                              // PascalCase classes
interface EnrichmentOptions { }                         // PascalCase interfaces
type EnrichmentCategory = string;                       // PascalCase types
const ENRICHMENT_PRESETS = { };                         // SCREAMING_SNAKE_CASE constants

// ❌ WRONG
const component_adapter = ...;                          // snake_case
const ComponentAdapter = ...;                           // PascalCase for variables
function SelectEnrichments() { }                        // PascalCase for functions
```

### TypeScript Rules

**Always use strict TypeScript:**

```typescript
// ✅ CORRECT - Explicit types
export function filterComponent(
  component: Component,
  categories: EnrichmentCategory[]
): FilteredComponent {
  return { ... };
}

// ✅ CORRECT - Type imports
import type { Component, EnrichmentOptions } from '../types';

// ✅ CORRECT - No 'any'
const result: unknown = JSON.parse(data);
if (typeof result === 'object') { ... }

// ❌ WRONG - No types
export function filterComponent(component, categories) {
  return { ... };
}

// ❌ WRONG - Using 'any'
const result: any = JSON.parse(data);
```

**Unused variables:**
```typescript
// ✅ CORRECT - Prefix with underscore
function buildMetadata(
  _original: Component,    // Not used, but required for signature
  filtered: Component
): Metadata {
  return analyze(filtered);
}

// ❌ WRONG - TypeScript error
function buildMetadata(
  original: Component,     // Declared but never used
  filtered: Component
): Metadata { ... }
```

### File Organization

**Where to create files:**

```
src/
├── services/          # Business logic (adapters, filters, selectors)
├── tools/             # MCP tool implementations
├── types/             # TypeScript type definitions
├── registry/          # Data loaders and enrichments
└── index.ts           # Main entry point

scripts/
├── extraction/        # Data extraction scripts
├── enrichment/        # Enrichment utilities
└── utilities/         # Helper scripts

docs/
├── architecture/      # System design documents
├── guides/            # How-to guides
└── reference/         # API documentation

archive/               # Historical documentation
```

**File structure conventions:**

```typescript
// ✅ CORRECT - Each file exports one main thing
// src/services/enrichment-filter.ts
import type { Component, EnrichmentOptions } from '../types';

export class EnrichmentFilter {
  filter(component: Component): Component {
    // Implementation
  }
}

// ✅ CORRECT - Barrel exports
// src/services/index.ts
export { ComponentAdapter } from './component-adapter';
export { EnrichmentFilter } from './enrichment-filter';
export { SmartEnrichmentSelector } from './smart-enrichment-selector';
```

### Documentation Requirements

**Every new file needs:**

```typescript
/**
 * Brief description of what this file does
 *
 * @example
 * const filter = new EnrichmentFilter();
 * const result = filter.filter(component, options);
 */

/**
 * JSDoc for public functions/classes
 *
 * @param component - The component to filter
 * @param options - Filtering options
 * @returns Filtered component with metadata
 */
export function filterComponent(
  component: Component,
  options: EnrichmentOptions
): FilteredResult {
  // ...
}
```

### README.md Rules

**CRITICAL:** Only ONE `README.md` allowed at project root!

```
✅ CORRECT:
./README.md                          # Only one
./docs/index.md                      # Use index.md in subdirs
./src/services/index.md              # Use index.md in subdirs

❌ WRONG:
./README.md
./docs/README.md                     # NO! Use index.md
./src/services/README.md             # NO! Use index.md
```

### Before Creating New Files

1. **Check if file already exists** - Use Read/Grep to search
2. **Follow naming convention** - kebab-case for source files
3. **Put in correct directory** - See file organization above
4. **Add JSDoc comments** - Document purpose and usage
5. **Export from index.ts** - Make it discoverable

### Before Committing

**Always run these checks:**

```bash
npm run typecheck    # Must pass with no errors
npm run build        # Must compile successfully
./scripts/validate-conventions.sh  # Must follow conventions
```

**Don't commit if:**
- TypeScript has errors
- Build fails
- Validation script shows errors (warnings are OK)

### Commit Message Convention

**CRITICAL:** Always use Conventional Commits format.

**Format:**
```
<type>(<scope>): <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat:` - New feature (user-facing)
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring (no behavior change)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (deps, configs)
- `perf:` - Performance improvements
- `style:` - Code style changes (formatting)

**Scope (optional):**
- `filter` - Smart filter layer
- `adapter` - Component adapter
- `tools` - MCP tools
- `enrichment` - Enrichment system
- `docs` - Documentation
- `conventions` - Project conventions

**Subject:**
- Use imperative mood: "add feature" not "added feature"
- Lowercase, no period at end
- Max 50 characters
- Be specific and descriptive

**Body (optional):**
- Explain what and why (not how)
- Use bullet points for multiple changes
- Include breaking changes if any
- Reference issues: `Closes #123`

**Examples:**

```bash
# Simple feature
feat(filter): add auto mode for enrichment selection

# Bug fix with explanation
fix(adapter): handle missing props in legacy components

Legacy components may not have all required fields.
Added null checks and default values.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

# Multiple changes
feat(tools): add Smart Filter Layer for token optimization

- Add ComponentAdapter for format conversion
- Add SmartEnrichmentSelector for intent detection
- Add EnrichmentFilter for in-memory filtering
- Integrate with get-component tool

Token savings: 30-70% depending on mode
Performance: <2ms overhead

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

# Documentation update
docs: reorganize documentation structure

- Move 18 files from root to organized structure
- Create docs/, archive/ hierarchy
- Normalize all filenames to kebab-case
- Update all cross-references

Root directory: 21 files → 12 files

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

# Breaking change
feat(tools)!: change get-component API to support filtering

BREAKING CHANGE: get-component now requires enrichments parameter

Before:
  get-component("InButton")

After:
  get-component("InButton", { enrichments: { strategy: "auto" } })

Migration: Add enrichments parameter to all get-component calls

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Always include:**
- ✅ Type prefix (feat/fix/docs/etc.)
- ✅ Descriptive subject
- ✅ Co-authored-by footer
- ✅ Claude Code attribution

**Never:**
- ❌ Vague messages: "fix stuff", "update code"
- ❌ Missing type prefix
- ❌ ALL CAPS subjects
- ❌ Multiple unrelated changes in one commit

### Common Mistakes to Avoid

❌ Using snake_case for file names
❌ Creating README.md in subdirectories
❌ Using `any` type in TypeScript
❌ Not prefixing unused parameters with `_`
❌ Creating files in root directory
❌ Not exporting from index.ts
❌ Missing JSDoc on public APIs
❌ Not running typecheck before committing

## Overview

This MCP server provides tools and resources for working with the Insider Design System - a Vue 2.7 component library. Use this server to:

- Discover available components
- Get detailed component documentation (props, events, slots)
- Generate Vue component code with proper imports
- Map Figma components to Design System components

## Available Tools

### Discovery Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `list-components` | List all components, optionally by category | Starting a new feature, exploring available components |
| `search-components` | Search by name/description | Looking for specific functionality |
| `get-component` | **🆕 Smart filtering** - Get component details with context-aware enrichment filtering | Need documentation tailored to your specific task (migration, implementation, debugging, etc.) |

### Documentation Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `get-props` | Get all props with types and defaults | Configuring a component |
| `get-events` | Get all emitted events | Setting up event handlers |
| `get-examples` | Get usage code examples | Need implementation reference |

### Code Generation Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| `generate-code` | Generate Vue component code | Implementing a component with specific props |
| `map-figma-component` | Map Figma name to DS component | Implementing from Figma designs |

## Usage Patterns

### Pattern 1: Implementing a Component (with Smart Filtering)

```
1. get-component("InDatePickerV2", {
     context: "implement date range picker feature",
     enrichments: { strategy: "auto" }
   })  → AI selects relevant enrichments for implementation
2. generate-code("InDatePickerV2", { compare: true, range: true })
3. Add generated code to Vue file
```

**Smart Filtering Options:**
- **Auto Mode**: Let AI analyze your context and select relevant enrichments
  ```javascript
  get-component("InButtonV2", {
    context: "migrate from v1 to v2"
  })
  // Returns: props, events, propEnrichments (migration guides), helperFunctions
  ```

- **Preset Mode**: Use predefined strategies
  ```javascript
  get-component("InButtonV2", {
    enrichments: { strategy: "minimal" }
  })
  // Returns: Only props + events (fastest, minimal tokens)

  get-component("InButtonV2", {
    enrichments: { strategy: "standard" }
  })
  // Returns: props, events, examples, helperFunctions

  get-component("InButtonV2", {
    enrichments: { strategy: "comprehensive" }
  })
  // Returns: Everything (default if no options provided)
  ```

- **Manual Mode**: Explicitly choose enrichments
  ```javascript
  get-component("InButtonV2", {
    enrichments: {
      include: ["props", "events", "examples"],
      strategy: "manual"
    }
  })
  // Returns: Only specified categories
  ```

### Pattern 2: Implementing from Figma

```
1. map-figma-component("DatePicker/Compare")  → Get DS component + default props
2. get-component("InDatePickerV2")            → Get full documentation
3. generate-code with merged props
```

### Pattern 3: Finding the Right Component

```
1. search-components("date")           → Find date-related components
2. list-components({ category: "Form" }) → Browse by category
3. get-component for detailed info
```

## Example Prompts

### Basic Implementation

User: "Add a DatePicker with compare feature"

```
1. Call get-component("InDatePickerV2")
2. Call generate-code("InDatePickerV2", { compare: true, range: true })
3. Insert code into user's file
4. Add necessary imports
```

### From Figma Design

User: "Implement this Figma frame" (contains Button/Primary)

```
1. Call map-figma-component("Button/Primary")
   → Returns: { dsComponent: "InButton", defaultProps: { variant: "primary" } }
2. Call generate-code("InButton", { variant: "primary" })
3. Insert code
```

### Discovery

User: "What form components are available?"

```
1. Call list-components({ category: "Form" })
2. Present list to user
3. Offer to show details for specific components
```

## Important Notes

### Import Pattern
Always use this import pattern for Design System components:

```javascript
import { ComponentName } from '@useinsider/design-system-vue';
import '@useinsider/design-system-vue/dist/design-system-vue.css';
```

### Vue Version
Components are built for Vue 2.7 with Composition API support. Use `<script setup>` syntax.

### Props Naming
- Boolean props: `disabled`, `loading`, `skeleton`
- v-model: Use `modelValue` and `update:modelValue`

### Common Props
Most components support:
- `disabled` / `disable` - Disable state
- `loading` / `loadingStatus` - Loading spinner
- `skeleton` / `skeletonStatus` - Skeleton loader
- `status` - Validation status (success, warning, error)
- `size` - Component size (small, medium, large)

## Resources

Access these resources for quick reference:

- `ds://components` - All components list
- `ds://registry` - Registry version info
- `ds://component/{name}` - Individual component details
- `ds://categories` - Component categories

## Figma Mapping Reference

| Figma Name | DS Component | Default Props |
|------------|--------------|---------------|
| Button/Primary | InButton | `{ variant: "primary" }` |
| Button/Secondary | InButton | `{ variant: "secondary" }` |
| DatePicker/Range | InDatePickerV2 | `{ range: true }` |
| DatePicker/Compare | InDatePickerV2 | `{ compare: true }` |
| Input/Text | InInput | `{ type: "text" }` |
| Select/Multiple | InSelect | `{ multiple: true }` |

## Best Practices

1. **Always check props first** - Use `get-props` before implementing
2. **Use generate-code** - Don't manually write boilerplate
3. **Include CSS import** - Always import the CSS file
4. **Check events** - Use `get-events` to set up proper handlers
5. **Use examples** - Reference `get-examples` for complex implementations

## Troubleshooting

### Component Not Found
- Check spelling (components use PascalCase: `InButton`, not `in-button`)
- Use `search-components` to find similar names
- Check if it's a V2 component (e.g., `InDatePickerV2`)

### Props Not Working
- Verify prop name with `get-props`
- Check if prop requires `:` binding for non-string values
- Some props may be `disable` vs `disabled`

### Missing Styles
Ensure CSS is imported:
```javascript
import '@useinsider/design-system-vue/dist/design-system-vue.css';
```

## Development Tools

### Available Agents

This project includes specialized agents for specific tasks:

#### 1. enrichment-maker Agent
**Purpose**: Generate enrichment files for complex components

**When to use**:
- Adding detailed metadata for a new critical component
- Documenting complex prop structures (Object/Array types)
- Creating common mistakes documentation
- Need valueFormat examples

**How to invoke**:
```
User: "Use enrichment-maker agent to create enrichment for InTooltipV2"
```

**What it does**:
1. Analyzes component metadata from combined.json via MCP
2. Identifies critical props needing enrichment (complex types)
3. Learns patterns from existing enrichments (InButtonV2, InDatePickerV2, InSelect)
4. Generates `src/registry/enrichments/InTooltipV2.json` with:
   - valueFormat for complex props (structure, examples, typescript)
   - commonMistakes with severity levels
   - Real-world usage examples
   - Helper functions (if needed)

**After agent completes**:
```bash
npm run extract:merge  # Merge enrichment into combined.json
npm run build           # Rebuild MCP server
```

#### 2. migrate-ds-components-v1-v2 Agent
**Purpose**: Migrate Vue components from V1 to V2 Design System components

**When to use**:
- Upgrading V1 components to V2 equivalents
- Need transformation guides (e.g., InDatePicker → InDatePickerV2)
- Understanding breaking changes

**How to invoke**:
```
User: "Migrate this component from InDatePicker V1 to V2"
```

**What it does**:
1. Uses MCP to get V2 component metadata
2. Checks for migration guides (e.g., InDatePicker-to-V2)
3. Reviews enrichment data for common mistakes
4. Provides mapped V2 code with proper props/events

### When to Use Agents

| Task | Agent | Use Case |
|------|-------|----------|
| Create enrichment | enrichment-maker | Adding metadata for InTooltipV2, InMultiSelect, etc. |
| V1→V2 migration | migrate-ds-components-v1-v2 | Upgrading InDatePicker to V2 |
| Implementation | (use MCP tools directly) | Implementing new components |
| Discovery | (use MCP tools directly) | Finding components |

### Enrichment Priority

Focus enrichments on components with:
- ✅ Complex Object/Array props
- ✅ Validators with enum references
- ✅ Common developer mistakes
- ✅ Non-obvious value formats
- ❌ Skip simple String/Boolean/Number props

**Recommended enrichments**: InTooltipV2, InMultiSelect, InCheckBoxV2, InModalV2, InDropdownMenu

## 🔧 Claude Code Configuration

This project uses `.claude/` directory for custom configuration, automation, and workflows.

### Available Slash Commands

Quick shortcuts for common tasks:

| Command | Description | Usage |
|---------|-------------|-------|
| `/validate` | Run all project validation checks | When you want to verify conventions and TypeScript |
| `/test-mcp` | Test MCP server in production mode | After making changes to tools/services |
| `/clean-root` | Clean and organize root directory | When root gets cluttered |
| `/enrichment-maker` | Generate enrichment for a component | For complex components needing metadata |
| `/migrate-v1-v2` | Migrate V1 component to V2 | When upgrading components |

**Example:**
```
User: "/validate"
Assistant: [Runs validation and reports results]
```

### Project Permissions

**Auto-approved actions** (no confirmation needed):
- ✅ Read operations: `cat`, `ls`, `grep`, `find`
- ✅ Build commands: `npm run build`, `npm run typecheck`
- ✅ Test commands: `npm test`, `node test-*.js`
- ✅ Extract commands: `npm run extract:*`
- ✅ Validation scripts: `./scripts/*.sh`
- ✅ MCP tools: `get-component`, `search-components`, `list-components`

**Always ask for confirmation:**
- ⚠️ `git push` - Pushing to remote
- ⚠️ `git commit` - Creating commits
- ⚠️ `npm install` - Installing dependencies

**Explicitly denied:**
- ❌ `rm -rf` - Destructive operations
- ❌ `git push --force` - Force pushing
- ❌ `npm publish` - Publishing packages

### Automatic Hooks

**After Write/Edit operations:**
- Automatically runs `npm run typecheck` to catch TypeScript errors
- Continues execution even if typecheck fails (non-blocking)
- Helps catch issues early

### Project Conventions

This project follows strict conventions enforced by `.project-conventions.md`:

**File Naming:**
- Source files: `kebab-case.ts`
- Documentation: `kebab-case.md`
- React/Vue components: `PascalCase.tsx`
- Only one `README.md` at root (use `index.md` in subdirectories)

**Directory Structure:**
```
src/services/     # Business logic
src/tools/        # MCP tools
docs/             # Active documentation
archive/          # Historical documentation
scripts/          # Automation scripts
```

**Before committing, always:**
1. Run validation: `./scripts/validate-conventions.sh`
2. Check TypeScript: `npm run typecheck`
3. Build successfully: `npm run build`

### Learn More

See [`.claude/README.md`](.claude/README.md) for:
- Complete configuration guide
- How to create custom slash commands
- How to add new agents
- Hook configuration examples
- Permission management
- Best practices

See [`.project-conventions.md`](.project-conventions.md) for:
- Complete governance strategy
- Naming conventions
- Testing requirements
- Git workflow
- Documentation standards
