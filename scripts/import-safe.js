// Script para importar productos usando variables de entorno desde .env
require('dotenv').config({ path: '.env.local' });  // Intentar cargar .env.local primero
const { createClient } = require('@sanity/client');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Verificar las variables de entorno
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('Error: No se encontró la variable NEXT_PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}

if (!token) {
  console.error('Error: No se encontró la variable SANITY_API_TOKEN');
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
      console.log(`Categoría: ${product.category}`);
      
      try {
        // Crear el documento en Sanity
        const result = await client.createOrReplace(sanityDocument);
        console.log(`¡Producto importado con éxito: ${product.name}!`);
        console.log(`ID del documento: ${result._id}`);
      } catch (importError) {
        console.error(`Error importando el producto ${product.name}:`, importError.message);
        
        if (importError.message.includes("reference") || importError.message.includes("category")) {
          console.log("\n¡ATENCIÓN! Parece haber un problema con la referencia de categoría.");
          console.log("Verifica que la categoría 'boat-rental' exista en tu dataset de Sanity.");
          console.log("Si no existe, primero debes crear la categoría o modificar el archivo YAML para usar una categoría existente.\n");
        }
      }
    }

    console.log('¡Proceso completado!');
  } catch (error) {
    console.error('Error procesando productos:', error);
    process.exit(1);
  }
}

// Ejecutar el script
console.log('Iniciando importación usando variables de entorno...');
console.log(`Project ID: ${projectId.substring(0, 3)}...`);
console.log(`Dataset: ${dataset}`);
console.log(`Token: ${token ? '(configurado)' : '(no configurado)'}`);

importProducts();
