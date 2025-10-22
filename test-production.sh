#!/bin/bash
# Build and test production mode

echo "Building application..."
npm run build

echo ""
echo "Starting production server..."
echo "Test 404: http://localhost:3000/en/page-inexistante"
echo "Test 500: Manually trigger an error"
echo ""

npm start
