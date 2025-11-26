#!/bin/bash

# Validate commit message format
# Usage: ./scripts/validate-commit-msg.sh "commit message"

set -e

COMMIT_MSG="$1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Valid types
VALID_TYPES="feat|fix|docs|refactor|test|chore|perf|style"

# Extract first line
FIRST_LINE=$(echo "$COMMIT_MSG" | head -1)

echo "🔍 Validating commit message..."
echo ""

# Check if message is empty
if [ -z "$FIRST_LINE" ]; then
  echo -e "${RED}❌ ERROR: Commit message is empty${NC}"
  exit 1
fi

# Check format: type(scope): subject or type: subject
if ! echo "$FIRST_LINE" | grep -qE "^($VALID_TYPES)(\([a-z-]+\))?!?: .+"; then
  echo -e "${RED}❌ ERROR: Invalid commit message format${NC}"
  echo ""
  echo "Expected format:"
  echo "  <type>(<scope>): <subject>"
  echo "  or"
  echo "  <type>: <subject>"
  echo ""
  echo "Valid types: $VALID_TYPES"
  echo ""
  echo "Examples:"
  echo "  feat(filter): add auto mode"
  echo "  fix: handle edge case"
  echo "  docs: update readme"
  echo ""
  echo "Your message:"
  echo "  $FIRST_LINE"
  exit 1
fi

# Check subject length (after type and scope)
SUBJECT=$(echo "$FIRST_LINE" | sed -E "s/^($VALID_TYPES)(\([a-z-]+\))?!?: //")
SUBJECT_LENGTH=${#SUBJECT}

if [ "$SUBJECT_LENGTH" -gt 50 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Subject is too long ($SUBJECT_LENGTH chars, max 50)${NC}"
  echo "  Subject: $SUBJECT"
fi

# Check if subject starts with lowercase
FIRST_CHAR=$(echo "$SUBJECT" | cut -c1)
if [[ "$FIRST_CHAR" =~ [A-Z] ]]; then
  echo -e "${YELLOW}⚠️  WARNING: Subject should start with lowercase${NC}"
  echo "  Subject: $SUBJECT"
fi

# Check if subject ends with period
if [[ "$SUBJECT" =~ \.$ ]]; then
  echo -e "${YELLOW}⚠️  WARNING: Subject should not end with period${NC}"
  echo "  Subject: $SUBJECT"
fi

# Check for Claude attribution
if ! echo "$COMMIT_MSG" | grep -q "Generated with \[Claude Code\]"; then
  echo -e "${YELLOW}⚠️  WARNING: Missing Claude Code attribution${NC}"
  echo "  Add: 🤖 Generated with [Claude Code](https://claude.com/claude-code)"
fi

if ! echo "$COMMIT_MSG" | grep -q "Co-Authored-By: Claude"; then
  echo -e "${YELLOW}⚠️  WARNING: Missing Co-Authored-By footer${NC}"
  echo "  Add: Co-Authored-By: Claude <noreply@anthropic.com>"
fi

echo ""
echo -e "${GREEN}✅ Commit message format is valid${NC}"
exit 0
