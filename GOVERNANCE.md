# 🎯 Project Governance Quick Start

**TL;DR:** Rules for keeping this project organized and scalable.

---

## 📖 Full Documentation

See [`.project-conventions.md`](.project-conventions.md) for complete governance strategy (280+ lines).

---

## ⚡ Quick Reference

### File Naming

```bash
✅ kebab-case.ts        # Source files
✅ kebab-case.md        # Documentation
✅ PascalCase.tsx       # React/Vue components
✅ kebab-case.test.ts   # Tests

❌ snake_case.ts
❌ SCREAMING_CASE.ts
❌ mixedCase.ts
```

### Directory Structure

```
src/services/          # Business logic
src/tools/             # MCP tools
docs/architecture/     # System design
docs/guides/           # How-to guides
scripts/utilities/     # Helper scripts
archive/              # Historical docs
```

### Documentation Rules

1. Every feature needs docs
2. Update docs with code
3. Archive old docs (don't delete)
4. Keep CLAUDE.md in sync

### Git Workflow

```bash
# Branch naming
feat/smart-filter-layer
fix/token-calculation
docs/update-readme

# Commit format
feat(scope): description
fix(scope): description
docs(scope): description
```

---

## 🔧 Tools

### Validate Conventions

```bash
# Check if project follows conventions
./scripts/validate-conventions.sh

# Output:
# ✅ All source files follow kebab-case
# ✅ All docs follow kebab-case
# ⚠️  Root has 8 files (max recommended: 10)
```

### Normalize Documentation

```bash
# Auto-fix documentation naming
./scripts/normalize-doc-names.sh

# Converts UPPERCASE_FILES.md → lowercase-files.md
```

### Reorganize Documentation

```bash
# Move docs to proper structure
./scripts/reorganize-docs.sh

# Moves files to docs/, archive/
```

---

## ✅ Pre-commit Checklist

Before committing:

- [ ] TypeScript compiles: `npm run build`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Conventions validated: `./scripts/validate-conventions.sh`
- [ ] Documentation updated
- [ ] Tests added/updated (if needed)

---

## 🚨 Common Issues

### "TypeScript errors after adding new service"

```bash
# 1. Check imports
# 2. Export from src/services/index.ts
# 3. Run typecheck
npm run typecheck
```

### "Documentation not following naming"

```bash
# Auto-fix
./scripts/normalize-doc-names.sh

# Verify
./scripts/validate-conventions.sh
```

### "Too many files in root"

```bash
# Move to proper location:
# - Docs → docs/
# - Scripts → scripts/
# - Archives → archive/
```

---

## 📚 Learn More

| Document | Purpose |
|----------|---------|
| [`.project-conventions.md`](.project-conventions.md) | Complete governance guide |
| [`docs/README.md`](docs/README.md) | Documentation index |
| [`CLAUDE.md`](CLAUDE.md) | AI assistant guide |
| [`README.md`](README.md) | Project overview |

---

## 🤝 Contributing

1. Read [`.project-conventions.md`](.project-conventions.md)
2. Follow naming conventions
3. Run validation before committing
4. Update documentation with changes
5. Use conventional commits

---

**Questions?** Open an issue or update this document.

**Last Updated:** 2025-11-26
