#!/bin/bash
# Infomaniak deployment script

echo "Installing dependencies..."
npm install --production

echo "Building application..."
npm run build

echo "Starting Next.js server..."
npm start
