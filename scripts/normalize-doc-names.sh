#!/bin/bash

# Documentation Naming Convention Normalization
# Converts all docs to kebab-case.md (except root READMEs)

set -e

echo "📝 Normalizing documentation naming convention..."
echo "Standard: kebab-case.md"
echo ""

# Function to convert to kebab-case
to_kebab_case() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | tr '_' '-'
}

# Rename files in docs/
echo "Processing docs/..."

find docs -type f -name "*.md" ! -name "README.md" | while read -r file; do
  dir=$(dirname "$file")
  base=$(basename "$file")

  # Convert to kebab-case
  new_base=$(to_kebab_case "$base")

  if [ "$base" != "$new_base" ]; then
    new_file="$dir/$new_base"
    echo "  Rename: $base → $new_base"
    mv "$file" "$new_file"
  fi
done

# Rename files in archive/
echo ""
echo "Processing archive/..."

find archive -type f -name "*.md" ! -name "README.md" | while read -r file; do
  dir=$(dirname "$file")
  base=$(basename "$file")

  # Convert to kebab-case
  new_base=$(to_kebab_case "$base")

  if [ "$base" != "$new_base" ]; then
    new_file="$dir/$new_base"
    echo "  Rename: $base → $new_base"
    mv "$file" "$new_file"
  fi
done

echo ""
echo "✅ Documentation naming normalized!"
echo ""
echo "Convention:"
echo "  ✅ kebab-case.md (all docs)"
echo "  ✅ README.md (root files, uppercase OK)"
echo "  ✅ CLAUDE.md (special AI guide, uppercase OK)"
