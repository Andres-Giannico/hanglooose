// Script para importar productos sin imágenes
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
    const yamlFile = path.join(process.cwd(), 'scripts', 'products-without-images.yaml');
    const fileContents = fs.readFileSync(yamlFile, 'utf8');
    const data = yaml.load(fileContents);

    console.log(`Encontrados ${data.products.length} productos para importar`);

    // Procesar cada producto
    for (const product of data.products) {
      // Generar un _id único para el documento
      const documentId = `product-${uuidv4()}`;

      // Verificar si existe la categoría antes de importar
      let categoryExists = false;
      try {
        if (product.category) {
          const categoryDoc = await client.fetch(`*[_id == $id][0]`, { id: product.category });
          categoryExists = !!categoryDoc;
          if (!categoryExists) {
            console.log(`Advertencia: La categoría '${product.category}' no existe en Sanity.`);
            console.log('Intentando crear la categoría automáticamente...');
            
            // Crear la categoría si no existe
            const categoryResult = await client.create({
              _id: product.category,
              _type: 'category',
              title: 'Boat Rental',
              slug: {
                _type: 'slug',
                current: 'boat-rental'
              },
              description: 'Boat rentals without license and with skipper'
            });
            
            console.log(`Categoría creada con ID: ${categoryResult._id}`);
            categoryExists = true;
          }
        }
      } catch (categoryError) {
        console.error('Error verificando/creando categoría:', categoryError.message);
      }

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
      
      try {
        // Crear el documento en Sanity
        const result = await client.createOrReplace(sanityDocument);
        console.log(`¡Producto importado con éxito: ${product.name}!`);
        console.log(`ID del documento: ${result._id}`);
      } catch (importError) {
        console.error(`Error importando el producto ${product.name}:`, importError.message);
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
