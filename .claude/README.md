# .claude/ Configuration Guide

This directory contains Claude Code configuration for project-specific automation, permissions, and agents.

## 📁 Structure

```
.claude/
├── README.md                           # This file
├── settings.local.json                 # Permissions & hooks
├── commands/                           # Slash commands
│   ├── enrichment-maker.md
│   └── migrate-v1-v2.md
└── agents/                             # Specialized agents
    ├── enrichment-maker.md
    ├── migrate-ds-components-v1-v2.md
    └── doc-sync-agent.md
```

## ⚙️ settings.local.json

Controls permissions and hooks for Claude Code.

### Permissions

**What they do:** Auto-approve specific tool calls without asking permission.

**Current auto-approved:**
- ✅ MCP tools: `get-component`, `search-components`, `list-components`
- ✅ Build commands: `npm run build`, `npm run typecheck`
- ✅ Test commands: `node test-*.js`
- ✅ Extract commands: `npm run extract:*`
- ✅ Utility scripts: `./scripts/*.sh`
- ✅ Slash commands: `/enrichment-maker`, `/migrate-v1-v2`

**When to add new permissions:**
- You run a command frequently (e.g., `npm test`)
- Command is safe and non-destructive
- You trust Claude to run it without confirmation

**Example:**
```json
{
  "permissions": {
    "allow": [
      "Bash(npm test:*)",           // Auto-approve npm test
      "Bash(./scripts/validate-*)"  // Auto-approve validation scripts
    ]
  }
}
```

### Hooks

**What they do:** Run commands automatically on events.

**Available hooks:**
- `user-prompt-submit-hook` - Runs when you send a message
- `tool-pre-hook` - Runs before tool execution
- `tool-post-hook` - Runs after tool execution

**Example use cases:**
```json
{
  "hooks": {
    "user-prompt-submit-hook": [
      {
        "command": "./scripts/validate-conventions.sh",
        "description": "Validate conventions before processing"
      }
    ],
    "tool-post-hook": [
      {
        "tool": "Write",
        "command": "npm run typecheck",
        "description": "Type check after file writes"
      }
    ]
  }
}
```

⚠️ **Warning:** Hooks run on EVERY event, so keep them fast (<1s).

## 📜 Slash Commands

**Location:** `.claude/commands/*.md`

**What they do:** Define custom shortcuts that expand to full prompts.

**Current commands:**
- `/enrichment-maker` - Generate enrichment files
- `/migrate-v1-v2` - Migrate V1 components to V2

**When to create:**
- You repeat the same prompt often
- Task requires specific context/instructions
- Want to standardize a workflow

**Template:**
```markdown
---
description: Short description for command list
---

# Command Name

Full prompt that Claude will execute when you type /command-name

## Context
[Provide background information]

## Task
[Detailed instructions]

## Output
[What you expect]
```

**Example:**
```markdown
---
description: Validate and fix project conventions
---

# Validate Conventions

Run the convention validator and fix any issues found.

## Steps
1. Run ./scripts/validate-conventions.sh
2. Review warnings and errors
3. Fix automatically if possible
4. Report what was fixed and what needs manual attention

## Output
- Summary of validation results
- List of auto-fixes applied
- List of issues requiring manual intervention
```

## 🤖 Agents

**Location:** `.claude/agents/*.md`

**What they do:** Specialized AI agents with specific domain knowledge.

**Current agents:**
- `enrichment-maker` - Generate enrichment files for components
- `migrate-ds-components-v1-v2` - Migrate V1 to V2 components
- `doc-sync-agent` - Sync documentation between repos

**When to create:**
- Task requires 5+ steps
- Needs domain-specific knowledge
- Will be reused multiple times
- Complex decision-making required

**Template:**
```markdown
# Agent Name

**Purpose:** One-line description

## When to Use
- Scenario 1
- Scenario 2

## Capabilities
- Capability 1
- Capability 2

## Process
1. Step 1
2. Step 2
3. ...

## Inputs
- Input 1
- Input 2

## Outputs
- Output 1
- Output 2

## Examples
[Provide 2-3 real examples]
```

## 🎯 Best Practices

### 1. Permissions Strategy

✅ **DO auto-approve:**
- Read-only operations (`cat`, `ls`, `grep`)
- Tests that don't modify code
- Build commands
- Validation scripts

❌ **DON'T auto-approve:**
- `git push`
- `rm -rf`
- Production deployments
- Database operations

### 2. Slash Command Strategy

**Good candidates:**
- `/validate` - Run all validation checks
- `/test-component [name]` - Test specific component
- `/sync-docs` - Sync documentation
- `/check-conventions` - Check naming/structure

**Bad candidates:**
- One-time tasks
- Tasks requiring complex user input
- Generic tasks ("fix this")

### 3. Agent Strategy

**Good candidates:**
- Complex workflows (enrichment generation)
- Domain-specific tasks (migration)
- Multi-file operations
- Tasks requiring analysis

**Bad candidates:**
- Simple file edits
- Generic coding tasks
- Tasks covered by slash commands

## 📚 Recommended Setup

### For This Project

**1. Add validation hook:**
```json
{
  "hooks": {
    "user-prompt-submit-hook": [
      {
        "command": "npm run typecheck",
        "description": "Quick type check",
        "continueOnError": true
      }
    ]
  }
}
```

**2. Create useful slash commands:**
```bash
# .claude/commands/validate.md - Run all checks
# .claude/commands/test-mcp.md - Test MCP server
# .claude/commands/sync-enrichments.md - Sync enrichment data
```

**3. Consider additional agents:**
```bash
# .claude/agents/component-analyzer.md - Analyze component complexity
# .claude/agents/doc-generator.md - Generate missing documentation
```

## 🔧 Troubleshooting

### Hook blocking execution

**Problem:** Hook fails and blocks your work.

**Solution:**
```json
{
  "hooks": {
    "user-prompt-submit-hook": [
      {
        "command": "your-command",
        "continueOnError": true  // Add this
      }
    ]
  }
}
```

### Permission not working

**Problem:** Claude still asks permission for allowed command.

**Solution:**
1. Check exact command format (case-sensitive)
2. Use wildcards: `Bash(npm run build:*)` instead of specific commands
3. Restart Claude Code after changing settings

### Slash command not appearing

**Problem:** `/command` doesn't show in autocomplete.

**Solution:**
1. Check file is in `.claude/commands/`
2. File must have `.md` extension
3. Must have `description` in frontmatter
4. Restart Claude Code

## 📖 Learn More

- [Claude Code Docs](https://docs.claude.com/claude-code)
- [MCP Documentation](https://modelcontextprotocol.io)
- `.project-conventions.md` - Project governance

---

**Last Updated:** 2025-11-26
**Maintained By:** Design System Team
