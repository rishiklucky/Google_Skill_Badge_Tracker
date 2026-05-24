#!/usr/bin/env bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing Node.js via nodeenv ==="
pip install nodeenv
nodeenv --node=20.11.0 --prebuilt --force .nodeenv

echo "=== Installing frontend dependencies ==="
.nodeenv/bin/npm --prefix frontend install

echo "=== Building React frontend ==="
.nodeenv/bin/npm --prefix frontend run build

echo "=== Build complete ==="
