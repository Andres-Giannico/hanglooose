import { uploadImagesFromDirectory } from './uploadImages'
import { importProducts } from './importProducts'
import path from 'path'

async function importAll() {
  try {
    // 1. Subir imágenes primero
    console.log('Starting image upload...')
    const imagesDir = path.join(process.cwd(), 'product-images')
    const imageRefs = await uploadImagesFromDirectory(imagesDir)
    console.log('Images uploaded successfully!')

    // 2. Importar productos
    console.log('Starting product import...')
    await importProducts(imageRefs)
    console.log('Products imported successfully!')

    console.log('All done! 🎉')
  } catch (error) {
    console.error('Error during import:', error)
    process.exit(1)
  }
}

// Ejecutar el script
importAll() 