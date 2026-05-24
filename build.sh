#!/usr/bin/env bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing Node.js ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== Installing frontend dependencies ==="
cd frontend
npm install

echo "=== Building React frontend ==="
npm run build

cd ..
echo "=== Build complete ==="
