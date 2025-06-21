// Script para importar productos usando variables de entorno desde .env
require('dotenv').config();
const { createClient } = require('@sanity/client');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Verificar las variables de entorno
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Error: Faltan variables de entorno necesarias.');
  console.log('Verifica que tu archivo .env contenga:');
  console.log('- NEXT_PUBLIC_SANITY_PROJECT_ID');
  console.log('- NEXT_PUBLIC_SANITY_DATASET');
  console.log('- SANITY_API_TOKEN');
  process.exit(1);
}

// Configuración del cliente de Sanity
const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function importProducts() {
  try {
    // Leer el archivo YAML
    const yamlFile = path.join(process.cwd(), 'scripts', 'products.yaml');
    const fileContents = fs.readFileSync(yamlFile, 'utf8');
    const data = yaml.load(fileContents);

    console.log(`Encontrados ${data.products.length} productos para importar`);

    // Procesar cada producto
    for (const product of data.products) {
      // Generar un _id único para el documento
      const documentId = `product-${uuidv4()}`;

      // Preparar el documento para Sanity
      const sanityDocument = {
        _id: documentId,
        _type: 'product',
        ...product,
        // Asegurarse de que los campos de referencia estén correctamente formateados
        category: product.category ? {
          _type: 'reference',
          _ref: product.category
        } : undefined,
      };

      console.log(`Preparando para importar: ${product.name}`);
      
      // Crear el documento en Sanity
      await client.createOrReplace(sanityDocument);
      console.log(`¡Producto importado con éxito: ${product.name}!`);
    }

    console.log('¡Importación completada con éxito!');
  } catch (error) {
    console.error('Error importando productos:', error);
    process.exit(1);
  }
}

// Ejecutar el script
console.log('Iniciando importación usando variables de entorno desde .env...');
console.log(`Project ID: ${projectId.substring(0, 3)}...`);
console.log(`Dataset: ${dataset}`);
console.log(`Token: ${token.substring(0, 3)}...`);

importProducts();
