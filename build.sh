#!/usr/bin/env bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing Node.js via nodeenv ==="
pip install nodeenv
nodeenv --node=20.11.0 --prebuilt /opt/node

echo "=== Installing frontend dependencies ==="
/opt/node/bin/npm --prefix frontend install

echo "=== Building React frontend ==="
/opt/node/bin/npm --prefix frontend run build

echo "=== Build complete ==="
