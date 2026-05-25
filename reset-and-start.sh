#!/bin/bash

echo "🧹 Clearing all Next.js caches..."
rm -rf .next
rm -rf node_modules/.cache

echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting dev server..."
npm run dev
