#!/usr/bin/env bash
# LeadGuard Launcher for macOS and Linux
set -e

cd "$(dirname "$0")"

echo "================================================================"
echo " Starting LeadGuard CRM (SE 4525) - Musa, Emaan, Aqsa H."
echo "================================================================"

# Check for node
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed or not in PATH."
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Ensure node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
fi

# Run the cross-platform launcher
node scripts/launch.mjs "$@"

