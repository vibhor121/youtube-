#!/bin/bash

echo "🚀 Starting YouTube Dashboard Server..."

echo "📊 Pushing database schema..."
npx prisma db push --accept-data-loss || echo "⚠️ Database push had issues, but continuing..."

echo "🌍 Starting server..."
npm start
