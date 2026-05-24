#!/usr/bin/env bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r backend/requirements.txt

echo "=== Installing Node.js via nodeenv ==="
pip install nodeenv
nodeenv --node=20.11.0 --prebuilt "$HOME/.nodeenv"

echo "=== Installing frontend dependencies ==="
"$HOME/.nodeenv/bin/npm" --prefix frontend install

echo "=== Building React frontend ==="
"$HOME/.nodeenv/bin/npm" --prefix frontend run build

echo "=== Build complete ==="
