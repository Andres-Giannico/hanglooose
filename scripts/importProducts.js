const { createClient } = require('@sanity/client');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Intentar cargar la configuración desde el archivo
let config;
try {
  config = require('./importConfig.js');
} catch (e) {
  console.error('Error: No se pudo cargar la configuración.');
  console.error('Asegúrate de ejecutar el script import-products.sh en lugar de este archivo directamente.');
  process.exit(1);
}

// Configuración del cliente de Sanity
const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  token: config.token,
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Modo de prueba (si se quiere ver el output sin crear documentos)
const TEST_MODE = process.env.TEST_MODE === 'true';

async function importProducts() {
  try {
    // Leer el archivo YAML
    const yamlFile = path.join(process.cwd(), 'scripts', 'products.yaml');
    const fileContents = fs.readFileSync(yamlFile, 'utf8');
    const data = yaml.load(fileContents);

    console.log(`Found ${data.products.length} products to import`);

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

      console.log(`Preparing to import: ${product.name}`);
      
      if (TEST_MODE) {
        console.log(JSON.stringify(sanityDocument, null, 2));
      } else {
        // Crear el documento en Sanity
        await client.createOrReplace(sanityDocument);
        console.log(`Imported product: ${product.name}`);
      }
    }

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
}

// Ejecutar el script
importProducts();
