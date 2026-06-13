#!/usr/bin/env bash

if [ ! -f "backend/.venv/bin/uvicorn" ]; then
  echo ""
  echo "  ERROR: uvicorn not found in backend/.venv."
  echo ""
  echo "  Run this once to install dependencies:"
  echo "    cd backend"
  echo "    .venv/bin/pip install -r requirements.txt"
  echo "    cd .."
  echo ""
  echo "  (If backend/.venv does not exist yet, create it first:)"
  echo "    cd backend && python3 -m venv .venv && cd .."
  echo ""
  exit 1
fi

# Start backend in background
echo "▶  Backend → http://localhost:8000"
(cd backend && .venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

# Kill backend when this script exits (Ctrl+C or Expo exits)
cleanup() {
  echo ""
  echo "Stopping backend (pid $BACKEND_PID)..."
  kill "$BACKEND_PID" 2>/dev/null
  wait "$BACKEND_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "▶  Expo → starting (press Ctrl+C to stop both)"
npx expo start
