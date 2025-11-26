# 📁 Documentation Structure

**Convention:** All documentation uses `kebab-case.md` naming

## Root Level (Core Docs)

```
.
├── README.md                           # 📖 Main entry point (exception: UPPERCASE)
├── CLAUDE.md                           # 🤖 AI assistant guide (exception: UPPERCASE)
├── GOVERNANCE.md                       # 🎯 Quick governance guide (exception: UPPERCASE)
└── .project-conventions.md             # 📋 Complete conventions (hidden file)
```

## docs/ (Active Documentation)

```
docs/
├── index.md                            # 📑 Documentation index (not README)
├── documentation-structure.md          # 📁 Documentation structure guide
├── .doc-naming-convention.md           # 📏 Naming rules
│
├── architecture/                       # 🏗️ System Design
│   ├── how-it-works.md                # Complete architecture
│   ├── smart-filter-layer.md          # Token optimization
│   └── figma-integration.md           # Figma workflow
│
├── guides/                             # 📘 How-to Guides
│   ├── workflow.md                    # Developer workflow
│   ├── enrichment-strategy.md         # Enrichment guide
│   ├── enrichment-template.md         # Templates
│   └── automated-enrichment.md        # Automation
│
└── reference/                          # 📚 API Reference
    └── agent-usage.md                 # Agent documentation
```

## archive/ (Historical Documentation)

```
archive/
├── index.md                            # 🗄️ Archive index (not README)
│
├── analysis/                           # 📊 Initial Analysis
│   ├── ds-mcp-compatibility-analysis.md
│   ├── enrichment-analysis.md
│   ├── enrichment-recommendations.md
│   ├── insider-ds-mcp-analysis.md
│   └── next-phase.md
│
├── completion-reports/                 # ✅ Milestone Reports
│   ├── cleanup-summary.md
│   ├── completion-report.md
│   ├── metadata-update-summary.md
│   ├── documentation-reorganization.md  # Doc reorganization summary
│   └── naming-convention-update.md      # Naming convention changes
│
└── presentations/                      # 🎤 Presentations
    ├── figma-design-guidelines.md
    ├── presentation.md
    ├── presentation-figma-mcp.md
    └── sunum-ozet.md
```

## Naming Rules

### ✅ Standard Format
- **All docs:** `kebab-case.md` (lowercase with hyphens)
- **Examples:** `how-it-works.md`, `smart-filter-layer.md`

### 🎯 Exceptions

**Root files (UPPERCASE allowed):**
- `README.md` - **ONLY** at project root (industry standard)
- `CLAUDE.md` - AI guide (uppercase for visibility)
- `CHANGELOG.md` - If exists
- `CONTRIBUTING.md` - If exists
- `LICENSE` - Standard

**Subdirectory indexes:**
- Use `index.md` (lowercase) for directory indexes
- Never use `README.md` in subdirectories (only root!)

### ❌ Avoid
- `SCREAMING_SNAKE_CASE.md`
- `PascalCase.md`
- `snake_case.md`
- `mixedCase.md`

## Statistics

- **Total Docs:** 27 files
- **Naming Compliance:** 100% (27/27)
- **Root Docs:** 4 files (3 uppercase exceptions: README, CLAUDE, GOVERNANCE)
- **Active Docs:** 12 files (100% kebab-case)
- **Archived Docs:** 15 files (100% kebab-case)

---

**Last Updated:** 2025-11-26
**Maintained By:** Design System Team
