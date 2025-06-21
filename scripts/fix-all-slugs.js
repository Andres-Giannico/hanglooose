// Script para corregir el formato de slug en todos los productos
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

// Configuración del cliente de Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function fixAllSlugs() {
  try {
    // Buscar todos los productos
    const products = await client.fetch(`*[_type == "product"]`);
    
    if (products.length === 0) {
      console.log('No se encontraron productos');
      return;
    }
    
    console.log(`Se encontraron ${products.length} productos en total.`);
    
    for (const product of products) {
      console.log(`Procesando: ${product.name} (ID: ${product._id})`);
      console.log(`  Slug actual: ${JSON.stringify(product.slug)}`);
      
      // Verificar si el slug está en el formato correcto
      let needsUpdate = false;
      let slugValue;
      
      if (typeof product.slug === 'string') {
        // Si el slug es una cadena, necesita ser convertido a objeto
        slugValue = product.slug;
        needsUpdate = true;
        console.log(`  Formato de slug incorrecto (string). Será convertido a objeto.`);
      } else if (product.slug && typeof product.slug === 'object' && product.slug.current) {
        // El slug ya tiene el formato correcto
        slugValue = product.slug.current;
        console.log(`  Formato de slug correcto (objeto).`);
      } else {
        // No hay slug o tiene un formato desconocido
        slugValue = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        needsUpdate = true;
        console.log(`  Formato de slug desconocido o ausente. Generando uno nuevo: ${slugValue}`);
      }
      
      if (needsUpdate) {
        console.log(`  Actualizando slug para '${product.name}'...`);
        try {
          // Actualizar el producto con el formato de slug correcto
          await client.patch(product._id)
            .set({
              slug: {
                _type: 'slug',
                current: slugValue
              }
            })
            .commit();
          
          console.log(`  ✅ Slug actualizado correctamente: { _type: 'slug', current: '${slugValue}' }`);
        } catch (updateError) {
          console.error(`  ❌ Error al actualizar slug: ${updateError.message}`);
        }
      }
      
      console.log('-'.repeat(50));
    }
    
    console.log('¡Proceso completado!');
    
  } catch (error) {
    console.error('Error al procesar los slugs:', error.message);
  }
}

// Verificar token antes de continuar
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: Se necesita configurar SANITY_API_TOKEN');
  process.exit(1);
}

console.log('Iniciando corrección de slugs para todos los productos...');
fixAllSlugs();
