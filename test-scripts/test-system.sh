#!/bin/bash

# Comprehensive End-to-End System Test
# Tests all components of the Design System MCP + Documentation Sync System

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DS_PATH="${DS_PATH:-/Users/deniz.zeybek/Documents/insider-projects/insider-design-system}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "======================================================================"
echo "🧪 DESIGN SYSTEM MCP - COMPREHENSIVE SYSTEM TEST"
echo "======================================================================"
echo ""
echo "📂 MCP Project: $SCRIPT_DIR"
echo "📂 Design System: $DS_PATH"
echo ""

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
  local test_name="$1"
  local test_command="$2"

  TESTS_RUN=$((TESTS_RUN + 1))
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE}Test $TESTS_RUN:${NC} $test_name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if eval "$test_command"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# ============================================================================
# SECTION 1: MCP PROJECT STRUCTURE
# ============================================================================

echo ""
echo "======================================================================"
echo "📦 SECTION 1: MCP Project Structure"
echo "======================================================================"

run_test "MCP package.json exists" \
  "test -f $SCRIPT_DIR/package.json"

run_test "MCP source files exist" \
  "test -f $SCRIPT_DIR/src/index.ts && test -f $SCRIPT_DIR/src/tools/index.ts"

run_test "Extraction scripts exist" \
  "test -f $SCRIPT_DIR/scripts/extract-components.ts && \
   test -f $SCRIPT_DIR/scripts/extract-storybook.ts && \
   test -f $SCRIPT_DIR/scripts/merge-datasets.ts"

run_test "Validation scripts exist" \
  "test -f $SCRIPT_DIR/scripts/validate-docs.ts && \
   test -f $SCRIPT_DIR/scripts/sync-docs.ts"

run_test "Combined data file exists" \
  "test -f $SCRIPT_DIR/data/combined.json"

run_test "Enrichment files exist" \
  "test -f $SCRIPT_DIR/src/registry/enrichments/InButtonV2.json && \
   test -f $SCRIPT_DIR/src/registry/enrichments/InDatePickerV2.json"

run_test "Claude agents exist" \
  "test -f $SCRIPT_DIR/.claude/agents/enrichment-maker.md && \
   test -f $SCRIPT_DIR/.claude/agents/doc-sync-agent.md"

# ============================================================================
# SECTION 2: DESIGN SYSTEM IMPROVEMENTS
# ============================================================================

echo ""
echo "======================================================================"
echo "🎨 SECTION 2: Design System Improvements"
echo "======================================================================"

run_test "InButtonV2 component exists" \
  "test -f $DS_PATH/src/components/InButtonV2/InButtonV2.vue"

run_test "InButtonV2 TypeScript definitions exist" \
  "test -f $DS_PATH/src/components/InButtonV2/InButtonV2.d.ts"

run_test "InButtonV2 README exists" \
  "test -f $DS_PATH/src/components/InButtonV2/README.md"

run_test "InButtonV2.vue has exported constants" \
  "grep -q 'export const STYLES' $DS_PATH/src/components/InButtonV2/InButtonV2.vue"

run_test "InButtonV2.vue has comprehensive JSDoc" \
  "grep -q '@example' $DS_PATH/src/components/InButtonV2/InButtonV2.vue && \
   grep -q '@type' $DS_PATH/src/components/InButtonV2/InButtonV2.vue"

run_test "InButtonV2.d.ts has proper types" \
  "grep -q 'export interface InButtonV2Props' $DS_PATH/src/components/InButtonV2/InButtonV2.d.ts && \
   grep -q 'export type ButtonStyling' $DS_PATH/src/components/InButtonV2/InButtonV2.d.ts"

run_test "README has props table" \
  "grep -q '## Props' $DS_PATH/src/components/InButtonV2/README.md && \
   grep -q '| Prop |' $DS_PATH/src/components/InButtonV2/README.md"

run_test "README has examples" \
  "grep -q '## Examples' $DS_PATH/src/components/InButtonV2/README.md"

run_test "README has common mistakes" \
  "grep -q '## Common Mistakes' $DS_PATH/src/components/InButtonV2/README.md"

# ============================================================================
# SECTION 3: DOCUMENTATION SYNC TOOLS
# ============================================================================

echo ""
echo "======================================================================"
echo "🔄 SECTION 3: Documentation Sync Tools"
echo "======================================================================"

run_test "Git hooks directory exists" \
  "test -d $DS_PATH/.git-hooks"

run_test "Pre-commit hook exists and executable" \
  "test -x $DS_PATH/.git-hooks/pre-commit"

run_test "Git hooks install script exists" \
  "test -x $DS_PATH/.git-hooks/install.sh"

run_test "PR template exists" \
  "test -f $DS_PATH/.github/PULL_REQUEST_TEMPLATE.md"

run_test "GitHub Actions workflow exists" \
  "test -f $DS_PATH/.github/workflows/docs-validation.yml"

# ============================================================================
# SECTION 4: NPM SCRIPTS
# ============================================================================

echo ""
echo "======================================================================"
echo "📝 SECTION 4: NPM Scripts"
echo "======================================================================"

run_test "validate:docs script exists" \
  "grep -q '\"validate:docs\"' $SCRIPT_DIR/package.json"

run_test "sync:docs script exists" \
  "grep -q '\"sync:docs\"' $SCRIPT_DIR/package.json"

run_test "extract:merge script exists" \
  "grep -q '\"extract:merge\"' $SCRIPT_DIR/package.json"

# ============================================================================
# SECTION 5: FUNCTIONAL TESTS
# ============================================================================

echo ""
echo "======================================================================"
echo "⚙️  SECTION 5: Functional Tests"
echo "======================================================================"

run_test "MCP build succeeds" \
  "cd $SCRIPT_DIR && npm run build > /dev/null 2>&1"

run_test "Validation script runs" \
  "cd $SCRIPT_DIR && npm run validate:docs InButtonV2 > /dev/null 2>&1"

run_test "Combined data is valid JSON" \
  "python3 -m json.tool $SCRIPT_DIR/data/combined.json > /dev/null 2>&1"

run_test "Combined data has InButtonV2" \
  "grep -q '\"InButtonV2\"' $SCRIPT_DIR/data/combined.json"

run_test "Enrichment is valid JSON" \
  "python3 -m json.tool $SCRIPT_DIR/src/registry/enrichments/InButtonV2.json > /dev/null 2>&1"

# ============================================================================
# SECTION 6: DOCUMENTATION QUALITY
# ============================================================================

echo ""
echo "======================================================================"
echo "📚 SECTION 6: Documentation Quality"
echo "======================================================================"

run_test "PRESENTATION.md exists" \
  "test -f $SCRIPT_DIR/PRESENTATION.md"

run_test "CLAUDE.md exists" \
  "test -f $SCRIPT_DIR/CLAUDE.md"

run_test "HOW_IT_WORKS.md exists" \
  "test -f $SCRIPT_DIR/HOW_IT_WORKS.md"

run_test "Git hooks README exists" \
  "test -f $DS_PATH/.git-hooks/README.md"

# ============================================================================
# SECTION 7: DATA INTEGRITY
# ============================================================================

echo ""
echo "======================================================================"
echo "🔍 SECTION 7: Data Integrity"
echo "======================================================================"

run_test "Combined data has all sections" \
  "grep -q '\"props\"' $SCRIPT_DIR/data/combined.json && \
   grep -q '\"emits\"' $SCRIPT_DIR/data/combined.json && \
   grep -q '\"enums\"' $SCRIPT_DIR/data/combined.json"

run_test "Enrichment has propEnrichments" \
  "grep -q '\"propEnrichments\"' $SCRIPT_DIR/src/registry/enrichments/InButtonV2.json"

run_test "Enrichment has commonMistakes" \
  "grep -q '\"commonMistakes\"' $SCRIPT_DIR/src/registry/enrichments/InButtonV2.json"

run_test "Enrichment has bestPractices" \
  "grep -q '\"bestPractices\"' $SCRIPT_DIR/src/registry/enrichments/InButtonV2.json"

# ============================================================================
# TEST SUMMARY
# ============================================================================

echo ""
echo "======================================================================"
echo "📊 TEST SUMMARY"
echo "======================================================================"
echo ""
echo "Total Tests Run:    $TESTS_RUN"
echo -e "Tests Passed:       ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed:       ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ ALL TESTS PASSED - System is fully operational!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "🎉 The Design System MCP + Documentation Sync System is ready!"
  echo ""
  echo "Next steps:"
  echo "  1. Start MCP server: cd $SCRIPT_DIR && npm start"
  echo "  2. Install git hooks: $DS_PATH/.git-hooks/install.sh"
  echo "  3. Review presentation: $SCRIPT_DIR/PRESENTATION.md"
  echo ""
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ SOME TESTS FAILED - Please review errors above${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  exit 1
fi
