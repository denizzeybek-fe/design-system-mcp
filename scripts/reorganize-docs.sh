#!/bin/bash

# Documentation Reorganization Script
# Cleans up and restructures project documentation

set -e

echo "📚 Reorganizing documentation..."

# Create new structure
mkdir -p docs/architecture
mkdir -p docs/guides
mkdir -p docs/reference
mkdir -p archive/completion-reports
mkdir -p archive/presentations
mkdir -p archive/analysis

# Move active docs
echo "Moving architecture docs..."
mv HOW_IT_WORKS.md docs/architecture/how-it-works.md 2>/dev/null || true
mv FIGMA_ARCHITECTURE.md docs/architecture/figma-integration.md 2>/dev/null || true
mv FIGMA_INTEGRATION.md docs/architecture/ 2>/dev/null || true

echo "Moving guides..."
mv WORKFLOW.md docs/guides/workflow.md 2>/dev/null || true
mv docs/ENRICHMENT_STRATEGY.md docs/guides/ 2>/dev/null || true
mv docs/ENRICHMENT_TEMPLATE.md docs/guides/ 2>/dev/null || true
mv docs/AUTOMATED_ENRICHMENT.md docs/guides/ 2>/dev/null || true

echo "Moving reference docs..."
mv .claude/AGENT_USAGE.md docs/reference/agent-usage.md 2>/dev/null || true

echo "Archiving obsolete docs..."
mv COMPLETION_REPORT.md archive/completion-reports/ 2>/dev/null || true
mv CLEANUP_SUMMARY.md archive/completion-reports/ 2>/dev/null || true
mv METADATA_UPDATE_SUMMARY.md archive/completion-reports/ 2>/dev/null || true

mv PRESENTATION.md archive/presentations/ 2>/dev/null || true
mv SUNUM_OZET.md archive/presentations/ 2>/dev/null || true
mv PRESENTATION_FIGMA_MCP.md archive/presentations/ 2>/dev/null || true
mv FIGMA_DESIGN_GUIDELINES.md archive/presentations/ 2>/dev/null || true

mv INSIDER_DS_MCP_ANALYSIS.md archive/analysis/ 2>/dev/null || true
mv DS_MCP_COMPATIBILITY_ANALYSIS.md archive/analysis/ 2>/dev/null || true
mv ENRICHMENT_ANALYSIS.md archive/analysis/ 2>/dev/null || true
mv ENRICHMENT_RECOMMENDATIONS.md archive/analysis/ 2>/dev/null || true
mv NEXT_PHASE.md archive/analysis/ 2>/dev/null || true

# Delete QUICK_START.md (content already in README)
rm -f QUICK_START.md

# Create index files
cat > docs/README.md << 'DOCEOF'
# Design System MCP Documentation

## Architecture
- [How It Works](architecture/how-it-works.md) - System architecture and data flow
- [Smart Filter Layer](architecture/smart-filter-layer.md) - Token optimization system
- [Figma Integration](architecture/figma-integration.md) - Figma to Vue workflow

## Guides
- [Developer Workflow](guides/workflow.md) - Day-to-day usage
- [Enrichment Strategy](guides/enrichment-strategy.md) - How to enrich components
- [Enrichment Template](guides/enrichment-template.md) - Template for enrichments

## Reference
- [Agent Usage](reference/agent-usage.md) - Specialized agents guide
DOCEOF

cat > archive/README.md << 'ARCHEOF'
# Archive

Historical documentation and analysis reports.

## Completion Reports
Reports from major milestones and cleanup phases.

## Presentations
Internal presentations and summaries.

## Analysis
Initial analysis and compatibility reports.
ARCHEOF

echo "✅ Documentation reorganized!"
echo ""
echo "New structure:"
echo "  docs/architecture/ - System design"
echo "  docs/guides/ - How-to guides"
echo "  docs/reference/ - Reference docs"
echo "  archive/ - Historical docs"
