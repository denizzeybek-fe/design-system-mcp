#!/bin/bash

# Project Conventions Validator
# Checks if project follows defined conventions

set -e

ERRORS=0
WARNINGS=0

echo "🔍 Validating Project Conventions..."
echo ""

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

error() {
  echo -e "${RED}❌ ERROR: $1${NC}"
  ERRORS=$((ERRORS + 1))
}

warning() {
  echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
  WARNINGS=$((WARNINGS + 1))
}

success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# 1. Check file naming in src/
echo "📁 Checking src/ naming conventions..."
BAD_SRC_FILES=$(find src -name "*.ts" -not -path "*/node_modules/*" | grep -E '[A-Z]' | grep -v -E '(README|index\.ts$)' || true)
if [ -n "$BAD_SRC_FILES" ]; then
  error "Source files should use kebab-case:"
  echo "$BAD_SRC_FILES"
else
  success "All source files follow kebab-case"
fi

# 2. Check documentation naming
echo ""
echo "📝 Checking documentation naming..."
BAD_DOCS=$(find docs -name "*.md" | grep -E '[A-Z_]' | grep -v "README.md" || true)
if [ -n "$BAD_DOCS" ]; then
  error "Documentation should use kebab-case:"
  echo "$BAD_DOCS"
else
  success "All docs follow kebab-case"
fi

# 3. Check root directory cleanliness
echo ""
echo "🧹 Checking root directory cleanliness..."
ROOT_FILES=$(find . -maxdepth 1 -type f -name "*.md" -o -name "*.ts" -o -name "*.js" | wc -l)
if [ "$ROOT_FILES" -gt 10 ]; then
  warning "Root has $ROOT_FILES files (max recommended: 10)"
else
  success "Root directory is clean ($ROOT_FILES files)"
fi

# 4. Check for README files in major directories
echo ""
echo "📖 Checking README presence..."
MISSING_READMES=""
for dir in docs archive scripts src/services; do
  if [ -d "$dir" ] && [ ! -f "$dir/README.md" ]; then
    MISSING_READMES="$MISSING_READMES\n  - $dir/"
  fi
done

if [ -n "$MISSING_READMES" ]; then
  warning "Missing README.md in:$MISSING_READMES"
else
  success "All major directories have READMEs"
fi

# 5. Check for test files
echo ""
echo "🧪 Checking test coverage..."
SRC_FILES=$(find src -name "*.ts" -not -name "*.test.ts" -not -name "index.ts" | wc -l)
TEST_FILES=$(find src -name "*.test.ts" | wc -l)
COVERAGE_RATIO=$(echo "scale=2; $TEST_FILES / $SRC_FILES * 100" | bc 2>/dev/null || echo "0")

if [ "$TEST_FILES" -eq 0 ]; then
  warning "No test files found"
elif (( $(echo "$COVERAGE_RATIO < 50" | bc -l) )); then
  warning "Test coverage: ${COVERAGE_RATIO}% (target: 50%+)"
else
  success "Test coverage: ${COVERAGE_RATIO}%"
fi

# 6. Check TypeScript compilation
echo ""
echo "🔨 Checking TypeScript compilation..."
if npm run build &> /dev/null; then
  success "TypeScript compiles successfully"
else
  error "TypeScript compilation failed"
fi

# 7. Check for loose scripts in root
echo ""
echo "📜 Checking for loose scripts..."
LOOSE_SCRIPTS=$(find . -maxdepth 1 -name "*.sh" -o -name "test-*.js" | wc -l)
if [ "$LOOSE_SCRIPTS" -gt 0 ]; then
  warning "$LOOSE_SCRIPTS script(s) in root (should be in scripts/)"
else
  success "No loose scripts in root"
fi

# 8. Check documentation links
echo ""
echo "🔗 Checking documentation links..."
BROKEN_LINKS=$(find docs -name "*.md" -exec grep -o '\[.*\](.*.md)' {} \; | grep -o '(.*\.md)' | tr -d '()' | while read link; do
  if [ ! -f "docs/$link" ]; then
    echo "$link"
  fi
done)

if [ -n "$BROKEN_LINKS" ]; then
  warning "Potential broken links found:"
  echo "$BROKEN_LINKS"
else
  success "No broken documentation links"
fi

# 9. Check for CLAUDE.md updates
echo ""
echo "🤖 Checking CLAUDE.md freshness..."
if [ -f "CLAUDE.md" ]; then
  CLAUDE_AGE=$(( ($(date +%s) - $(stat -f %m CLAUDE.md 2>/dev/null || stat -c %Y CLAUDE.md)) / 86400 ))
  if [ "$CLAUDE_AGE" -gt 30 ]; then
    warning "CLAUDE.md last updated $CLAUDE_AGE days ago (review if needed)"
  else
    success "CLAUDE.md is up to date"
  fi
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}✨ All conventions passed!${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS error(s), $WARNINGS warning(s) found${NC}"
  echo ""
  echo "Fix errors and re-run validation."
  exit 1
fi
