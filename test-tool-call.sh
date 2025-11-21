#!/bin/bash

echo "🧪 Testing MCP Tool Call"
echo ""
echo "Starting MCP server and calling list-components..."
echo ""

# Send MCP initialize and tool call via stdin
node dist/index.js 2>&1 <<'EOF' &
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "1.0.0", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}
{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "list-components", "arguments": {}}}
EOF

PID=$!
sleep 2
kill $PID 2>/dev/null

echo ""
echo "Check stderr output above for data loading confirmation"
