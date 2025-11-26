---
description: Run project validation checks
---

# Validate Project

Run all validation checks to ensure project follows conventions and compiles correctly.

## Steps

1. Run `./scripts/validate-conventions.sh` to check:
   - File naming conventions (kebab-case)
   - Directory structure
   - README placement (only at root)
   - Documentation organization

2. Run `npm run typecheck` to check:
   - TypeScript compilation
   - Type safety
   - No unused variables

3. If there are errors:
   - Fix automatically where possible
   - Report what needs manual attention
   - Suggest fixes for each issue

## Output Format

Provide a summary like:
```
✅ Validations Passed: X
⚠️  Warnings: Y
❌ Errors: Z

[Details of each issue with fix suggestions]
```

## Notes
- Don't commit anything, just validate
- If everything passes, just say "All validations passed!"
