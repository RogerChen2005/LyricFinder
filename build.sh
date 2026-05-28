#!/bin/bash
set -e

echo "Building frontend..."
cd frontEnd && npm run build && cd ..

echo "Building backend..."
cd backEnd && npx tsc && cd ..

echo "Assembling build/..."
rm -rf build
mkdir -p build/static build/cookies build/temp

cp -r backEnd/dist/* build/
cp -r frontEnd/static/* build/static/
cp backEnd/package.json build/
cp backEnd/pnpm-lock.yaml build/
cp -r backEnd/cookies/* build/cookies/ 2>/dev/null || true

echo "Done. Run with: cd build && pnpm install --prod && node src/index.js"
