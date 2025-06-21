#!/bin/bash

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Script de importación de productos a Sanity${NC}"
echo "------------------------------------------"

# Verificar que las variables de entorno necesarias estén configuradas
if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
  echo -e "${RED}Error: La variable de entorno NEXT_PUBLIC_SANITY_PROJECT_ID no está configurada${NC}"
  echo "Por favor, configura las variables de entorno necesarias:"
  echo "export NEXT_PUBLIC_SANITY_PROJECT_ID=tu-project-id"
  echo "export NEXT_PUBLIC_SANITY_DATASET=production"
  echo "export SANITY_API_TOKEN=tu-token-con-permisos-de-escritura"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
  echo -e "${YELLOW}Advertencia: Variable NEXT_PUBLIC_SANITY_DATASET no configurada, usando 'production' por defecto${NC}"
  export NEXT_PUBLIC_SANITY_DATASET=production
fi

if [ -z "$SANITY_API_TOKEN" ]; then
  echo -e "${RED}Error: La variable SANITY_API_TOKEN no está configurada${NC}"
  echo "Esta variable es necesaria para poder escribir en Sanity."
  echo "export SANITY_API_TOKEN=tu-token-con-permisos-de-escritura"
  exit 1
fi

# Comprobar si el archivo YAML existe
if [ ! -f "scripts/products.yaml" ]; then
  echo -e "${RED}Error: No se encontró el archivo scripts/products.yaml${NC}"
  exit 1
fi

# Mostrar información de la configuración
echo -e "${GREEN}Usando configuración:${NC}"
echo "Project ID: $NEXT_PUBLIC_SANITY_PROJECT_ID"
echo "Dataset: $NEXT_PUBLIC_SANITY_DATASET"
echo "Token: ${SANITY_API_TOKEN:0:5}..."

# Crear un archivo temporal con los valores reales
cat > scripts/importConfig.js << EOF
module.exports = {
  projectId: '$NEXT_PUBLIC_SANITY_PROJECT_ID',
  dataset: '$NEXT_PUBLIC_SANITY_DATASET',
  token: '$SANITY_API_TOKEN'
};
EOF

# Ejecutar el script
echo -e "${YELLOW}Ejecutando importación...${NC}"
node scripts/importProducts.js

# Limpiar
rm scripts/importConfig.js

echo -e "${GREEN}Proceso completado!${NC}"
