---
description: Clean up root directory and organize files
---

# Clean Root Directory

Organize files in root directory according to project conventions.

## Goal
Keep root directory clean (max 10 files recommended, currently checking).

## Steps

1. Check current root file count:
   ```bash
   find . -maxdepth 1 -type f | wc -l
   ```

2. Identify files that should be moved:
   - Documentation → `docs/`
   - Scripts → `scripts/`
   - Historical → `archive/`
   - Test files → `tests/` or delete if obsolete

3. For each file to move:
   - Determine correct location
   - Check for references in other files
   - Move using `git mv`
   - Update references

4. Update documentation:
   - Update `docs/documentation-structure.md`
   - Update any indexes

5. Validate:
   ```bash
   ./scripts/validate-conventions.sh
   ```

## Files That Should Stay in Root
- `README.md` - Project overview
- `CLAUDE.md` - AI guide
- `GOVERNANCE.md` - Quick governance
- `package.json` - npm config
- `tsconfig.json` - TypeScript config
- `tsup.config.ts` - Build config
- `.gitignore`
- `LICENSE`
- Config files (`.prettierrc`, `.eslintrc`, etc.)

## Output
Provide summary:
```
📂 Root Directory Cleanup

Before: 15 files
After: 10 files

Moved:
- file1.md → docs/guides/
- file2.sh → scripts/utilities/
- file3.md → archive/

Updated references in:
- README.md
- docs/index.md

✅ Root is now clean!
```
