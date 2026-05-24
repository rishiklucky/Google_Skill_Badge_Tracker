#!/usr/bin/env bash
# Render build script — runs once before the service starts.
# Installs Python deps and builds the React frontend.

set -e  # exit on any error

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing Node dependencies ==="
cd frontend
npm install

echo "=== Building React frontend ==="
npm run build

cd ..
echo "=== Build complete ==="
