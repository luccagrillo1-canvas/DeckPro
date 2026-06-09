#!/bin/bash
# Pro7 Slide Builder — double-click to launch
cd "$(dirname "$0")"

echo "──────────────────────────────────────"
echo "  Pro7 Slide Builder"
echo "──────────────────────────────────────"

# Kill any existing server on port 3000
if lsof -ti tcp:3000 &>/dev/null; then
  echo "Stopping previous server..."
  lsof -ti tcp:3000 | xargs kill -9
  sleep 0.5
fi

echo "Starting server..."
node server.js &
SERVER_PID=$!

# Wait until server is up (max 5s)
for i in {1..10}; do
  sleep 0.5
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    break
  fi
done

echo "Opening http://localhost:3000"
open http://localhost:3000

echo "Server running (PID $SERVER_PID)"
echo "Keep this window open. Close it to stop the server."
echo "──────────────────────────────────────"

wait $SERVER_PID
