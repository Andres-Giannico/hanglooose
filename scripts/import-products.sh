#!/bin/bash

# Generic script to import products from YAML files to Sanity
# Usage: ./import-products.sh path/to/products.yaml

# Check if a file path was provided
if [ -z "$1" ]; then
  echo "Error: No YAML file specified."
  echo "Usage: ./import-products.sh path/to/products.yaml"
  exit 1
fi

# Check if the file exists
if [ ! -f "$1" ]; then
  echo "Error: File $1 does not exist."
  exit 1
fi

# Ask for Sanity credentials if not set
if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
  echo "Enter your Sanity Project ID:"
  read NEXT_PUBLIC_SANITY_PROJECT_ID
fi

if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
  echo "Enter your Sanity Dataset (default: production):"
  read NEXT_PUBLIC_SANITY_DATASET
  if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
    NEXT_PUBLIC_SANITY_DATASET="production"
  fi
fi

if [ -z "$SANITY_API_TOKEN" ]; then
  echo "Enter your Sanity API Token (with write permissions):"
  read -s SANITY_API_TOKEN
fi

# Create temporary config file
echo "Creating temporary configuration file..."
cat > scripts/temp-config.js << EOF
require('dotenv').config();
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '${NEXT_PUBLIC_SANITY_PROJECT_ID}';
process.env.NEXT_PUBLIC_SANITY_DATASET = '${NEXT_PUBLIC_SANITY_DATASET}';
process.env.SANITY_API_TOKEN = '${SANITY_API_TOKEN}';
EOF

echo "Importing products from $1..."
node -r ./scripts/temp-config.js scripts/importProducts.js "$1"

# Clean up
rm scripts/temp-config.js

echo "Import process completed."
