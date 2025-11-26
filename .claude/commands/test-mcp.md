---
description: Test MCP server in production mode
---

# Test MCP Server

Test the MCP server build to ensure everything works correctly.

## Steps

1. Build the project:
   ```bash
   npm run build
   ```

2. Run production test:
   ```bash
   npm run test:production
   ```

3. Check that:
   - ✅ Server loads without errors
   - ✅ combined.json is loaded correctly
   - ✅ All tools are registered
   - ✅ Sample component can be fetched
   - ✅ Smart Filter Layer works

4. Report results:
   - Build time
   - Number of components loaded
   - Any warnings or errors
   - Test success/failure

## Expected Output

```
🔨 Building...
✅ Build successful (2.3s)

🧪 Testing production build...
✅ Server starts correctly
✅ Loaded 62 components
✅ Tools registered: 14
✅ Sample fetch: InButtonV2 ✅
✅ Smart Filter works

🎉 All tests passed!
```

## Notes
- This tests the actual built MCP server, not source code
- Useful before committing changes
- Should be run after any tool modifications
