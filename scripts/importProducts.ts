import { createClient } from '@sanity/client'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Configuración del cliente de Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN, // Necesitarás un token con permisos de escritura
  useCdn: false,
  apiVersion: '2023-05-03'
})

async function importProducts() {
  try {
    // Leer el archivo YAML
    const yamlFile = path.join(process.cwd(), 'scripts', 'products.yaml')
    const fileContents = fs.readFileSync(yamlFile, 'utf8')
    const data = yaml.load(fileContents) as { products: any[] }

    console.log(`Found ${data.products.length} products to import`)

    // Procesar cada producto
    for (const product of data.products) {
      // Generar un _id único para el documento
      const documentId = `product-${uuidv4()}`

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
      }

      // Crear el documento en Sanity
      await client.createOrReplace(sanityDocument)
      console.log(`Imported product: ${product.name}`)
    }

    console.log('Import completed successfully!')
  } catch (error) {
    console.error('Error importing products:', error)
    process.exit(1)
  }
}

// Ejecutar el script
importProducts() 