#!/bin/bash
echo "Validating code formatting (yarn prettier)..."
yarn prettier
if [ $? -eq 0 ]; then
  echo "Success: All code has been formatted correctly."
else
  echo "ERROR: Part of the code is not formatted correctly."
  exit 1
fi