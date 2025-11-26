# 📝 Naming Convention Normalization

**Date:** 2025-11-26
**Status:** ✅ Complete

## 🎯 Applied Convention

**Standard:** `kebab-case.md` (lowercase with hyphens)

## 📊 Changes Made

### Before
```
docs/
├─ FIGMA_INTEGRATION.md          ❌ SCREAMING_SNAKE_CASE
├─ ENRICHMENT_STRATEGY.md         ❌ SCREAMING_SNAKE_CASE
├─ ENRICHMENT_TEMPLATE.md         ❌ SCREAMING_SNAKE_CASE
├─ AUTOMATED_ENRICHMENT.md        ❌ SCREAMING_SNAKE_CASE
├─ how-it-works.md                ✅ kebab-case
└─ smart-filter-layer.md          ✅ kebab-case
```

### After
```
docs/
├─ figma-integration.md           ✅ kebab-case
├─ enrichment-strategy.md         ✅ kebab-case
├─ enrichment-template.md         ✅ kebab-case
├─ automated-enrichment.md        ✅ kebab-case
├─ how-it-works.md                ✅ kebab-case
├─ smart-filter-layer.md          ✅ kebab-case
└─ README.md                      ✅ (exception: uppercase OK)
```

## ✅ Exceptions

Root directory special files remain UPPERCASE:
- `README.md` - Standard convention
- `CLAUDE.md` - AI assistant guide (intentionally uppercase for visibility)
- `CHANGELOG.md` - If exists
- `CONTRIBUTING.md` - If exists
- `LICENSE` - Standard

## 🔧 Automation

Created normalization script:
```bash
./scripts/normalize-doc-names.sh
```

Automatically converts all docs to kebab-case.

## 📖 Reference

See `docs/.doc-naming-convention.md` for full guidelines.

---

**Total Files Renamed:** 4
**Convention Applied:** 100% (10/10 docs)
**Automation:** ✅ Script created
