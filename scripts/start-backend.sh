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

echo "▶  Backend → http://localhost:8000"
cd backend
.venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000
