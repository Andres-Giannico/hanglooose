#!/bin/bash

echo "Script para subir el barco Galea a Sanity"
echo "----------------------------------------"

# Cargar variables de entorno desde .env si existe
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Cargar variables de entorno desde .env.local si existe (prioridad)
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Verificar Project ID
if [ -z "$NEXT_PUBLIC_SANITY_PROJECT_ID" ]; then
  echo "ERROR: No se encontró NEXT_PUBLIC_SANITY_PROJECT_ID en tus archivos .env"
  exit 1
fi

# Solicitar token si no está configurado
if [ -z "$SANITY_API_TOKEN" ]; then
  echo "No se encontró el token de Sanity (SANITY_API_TOKEN)."
  echo "Por favor, ingresa tu token de Sanity con permisos de escritura:"
  read -s SANITY_API_TOKEN
  export SANITY_API_TOKEN
  echo "Token configurado temporalmente."
fi

# Dataset por defecto
if [ -z "$NEXT_PUBLIC_SANITY_DATASET" ]; then
  echo "No se encontró la variable NEXT_PUBLIC_SANITY_DATASET, usando 'production'"
  export NEXT_PUBLIC_SANITY_DATASET=production
fi

# Ejecutar el script de importación
echo "Ejecutando importación..."
node scripts/import-safe.js

echo "¡Proceso completado!"
