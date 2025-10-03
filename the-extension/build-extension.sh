#!/bin/bash

# Build the React components
echo "Building extension..."
npm run build

# Copy the floating pill to public directory
echo "Copying floating-pill.js to public directory..."
cp dist/floating-pill.js public/floating-pill.js

echo "Extension build complete! The public directory now contains:"
echo "- floating-pill.js (React-based floating pill content script)"
echo "- background.js (timer logic)"
echo "- manifest.json (extension configuration)"
echo ""
echo "Load the public/ directory in Chrome Extensions to test!"
