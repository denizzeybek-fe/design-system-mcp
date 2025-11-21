# Design System MCP

MCP (Model Context Protocol) server for the Insider Design System. Enables AI assistants like Claude to discover, document, and generate code for Design System components.

## Features

- **Component Discovery**: List and search 60+ components
- **Documentation**: Full props, events, slots documentation
- **Code Generation**: Generate Vue component code with imports
- **Figma Integration**: Map Figma component names to DS components

## Installation

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Install Package

```bash
# From npm (when published)
npm install -g @anthropic/design-system-mcp

# Or from source
git clone <repo-url>
cd design-system-mcp
npm install
npm run build
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "design-system-mcp"
    }
  }
}
```

Or with full path:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "node",
      "args": ["/path/to/design-system-mcp/dist/index.js"]
    }
  }
}
```

### Claude Code (CLI)

```bash
claude mcp add design-system design-system-mcp
```

Or manually add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "design-system": {
      "command": "design-system-mcp"
    }
  }
}
```

## Available Tools

### list-components

List all components, optionally filtered by category.

```
Input: { category?: string }
Output: { total, categories, components[] }
```

### get-component

Get detailed component information.

```
Input: { name: string }
Output: { name, description, props[], events[], slots[], examples[] }
```

### search-components

Search components by name or description.

```
Input: { query: string }
Output: { query, total, results[] }
```

### get-props

Get component props with types and defaults.

```
Input: { name: string }
Output: { component, props[] }
```

### get-events

Get component events with payloads.

```
Input: { name: string }
Output: { component, events[] }
```

### get-examples

Get usage examples for a component.

```
Input: { name: string }
Output: { component, examples[] }
```

### generate-code

Generate Vue component code.

```
Input: { component: string, props?: object, includeScript?: boolean }
Output: Vue template + script code
```

### map-figma-component

Map Figma component name to DS component.

```
Input: { figmaComponentName: string }
Output: { figmaName, matched, dsComponent, defaultProps }
```

## Resources

- `ds://components` - All components list
- `ds://registry` - Registry metadata
- `ds://component/{name}` - Individual component
- `ds://categories` - Component categories

## Development

### Setup

```bash
npm install
npm run dev    # Watch mode
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
npm run test:coverage
```

### Update Registry

When Design System components change:

```bash
npm run generate-registry
```

## Registry Synchronization

The component registry (`src/registry/components.json`) must be updated when the Design System changes.

### Manual Update

1. Run the generator script in Design System project
2. Copy output to `src/registry/components.json`
3. Rebuild and publish

### Automated (CI/CD)

Design System CI can trigger updates via:

1. GitHub Actions workflow dispatch
2. Webhook to regenerate registry
3. Automated PR creation

## Project Structure

```
design-system-mcp/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server setup
│   ├── tools/                # Tool implementations
│   ├── resources/            # Resource definitions
│   ├── registry/             # Component metadata
│   │   ├── components.json   # Component registry
│   │   └── loader.ts         # Registry loader
│   └── types/                # TypeScript types
├── scripts/
│   └── generate-registry.ts  # Registry generator
├── CLAUDE.md                 # AI assistant guide
└── README.md
```

## Usage Examples

### Prompt: "Add a button with loading state"

Claude will:
1. Call `get-component("InButton")`
2. Call `generate-code("InButton", { loading: true })`
3. Return generated code

### Prompt: "What date picker options are available?"

Claude will:
1. Call `search-components("date")`
2. Call `get-component("InDatePickerV2")`
3. Show available props and examples

### Prompt: "Implement this Figma button"

Claude will:
1. Call `map-figma-component("Button/Primary")`
2. Call `generate-code` with mapped props
3. Insert code with proper imports

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `npm test`
5. Submit PR

## License

UNLICENSED - Internal use only

## Support

For issues and questions:
- Create GitHub issue
- Contact Design System team
