#!/bin/bash
echo "Validating code formatting (npm run prettier)..."
npm run prettier
if [ $? -eq 0 ]; then
  echo "SUCCESS: All code has been formatted correctly."
else
  echo "ERROR: Part of the code is not formatted correctly."
  exit 1
fi

echo "Validing code pattern (npm run eslint)..."
npm run eslint
if [ $? -eq 0 ]; then
  echo "SUCCESS: eslint has paassed."
else
  echo "ERROR: eslint has failed."
  exit 1
fi