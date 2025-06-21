// Script para corregir el formato del slug en el producto Galea 630
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

async function fixSlug() {
  try {
    // Buscar todos los productos
    const allProducts = await client.fetch(`*[_type == "product"]`);
    
    if (allProducts.length === 0) {
      console.log('No se encontraron productos');
      return;
    }
    
    console.log(`Se encontraron ${allProducts.length} productos en total:`);
    
    // Mostrar info de todos los productos
    allProducts.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} (ID: ${p._id})`);
      console.log(`   Slug: ${JSON.stringify(p.slug)}`);
    });
    
    // Buscar productos relacionados con "Galea"
    const galeaProducts = allProducts.filter(p => 
      p.name && p.name.toLowerCase().includes('galea') || 
      (typeof p.slug === 'string' && p.slug.toLowerCase().includes('galea')) ||
      (p.slug && p.slug.current && p.slug.current.toLowerCase().includes('galea'))
    );
    
    if (galeaProducts.length === 0) {
      console.log('No se encontraron productos relacionados con "Galea"');
      
      // Preguntar si quiere corregir todos los productos con slug incorrecto
      console.log('¿Quieres corregir todos los productos con formato de slug incorrecto? (s/n)');
      
      // Buscar productos con slug de tipo string
      const productsWithStringSlug = allProducts.filter(p => typeof p.slug === 'string');
      
      if (productsWithStringSlug.length > 0) {
        console.log(`Se encontraron ${productsWithStringSlug.length} productos con slug de tipo string:`);
        
        // Corregir cada producto
        for (const product of productsWithStringSlug) {
          console.log(`Corrigiendo producto: ${product.name} (ID: ${product._id})`);
          console.log(`Slug actual: ${product.slug}`);
          
          // Actualizar el documento con el formato de slug correcto
          await client.patch(product._id)
            .set({
              slug: {
                _type: 'slug',
                current: product.slug
              }
            })
            .commit();
          
          console.log(`Slug actualizado correctamente para el producto ${product.name}`);
        }
        
        console.log('¡Todos los slugs han sido corregidos!');
      } else {
        console.log('No se encontraron productos con slug de tipo string');
      }
      
      return;
    }
    
    console.log(`Se encontraron ${galeaProducts.length} productos relacionados con "Galea":`);
    
    // Corregir cada producto relacionado con Galea
    for (const product of galeaProducts) {
      console.log(`Corrigiendo producto: ${product.name} (ID: ${product._id})`);
      
      // Determinar valor del slug
      let slugValue;
      if (typeof product.slug === 'string') {
        slugValue = product.slug;
        console.log(`Slug actual (string): ${product.slug}`);
      } else if (product.slug && product.slug.current) {
        slugValue = product.slug.current;
        console.log(`Slug actual (objeto): ${product.slug.current}`);
      } else {
        slugValue = 'galea-galeon-630-boat-rental-ibiza';
        console.log(`No se encontró slug, usando valor predeterminado: ${slugValue}`);
      }
      
      // Actualizar el documento con el formato de slug correcto
      await client.patch(product._id)
        .set({
          slug: {
            _type: 'slug',
            current: slugValue
          }
        })
        .commit();
      
      console.log(`Slug actualizado correctamente para el producto ${product.name}`);
    }
    
  } catch (error) {
    console.error('Error al corregir el slug:', error.message);
  }
}

// Verificar token antes de continuar
if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: Se necesita configurar SANITY_API_TOKEN');
  process.exit(1);
}

console.log('Iniciando corrección del slug...');
fixSlug();
