import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03'
})

async function uploadImage(imagePath: string): Promise<string> {
  try {
    // Leer el archivo de imagen
    const imageBuffer = fs.readFileSync(imagePath)
    
    // Subir la imagen a Sanity
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath)
    })
    
    // Devolver la referencia de la imagen
    return asset._id
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error)
    throw error
  }
}

async function uploadImagesFromDirectory(directoryPath: string): Promise<Record<string, string>> {
  const imageRefs: Record<string, string> = {}
  
  try {
    // Leer todos los archivos del directorio
    const files = fs.readdirSync(directoryPath)
    
    // Filtrar solo archivos de imagen
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    )
    
    console.log(`Found ${imageFiles.length} images to upload`)
    
    // Subir cada imagen
    for (const file of imageFiles) {
      const imagePath = path.join(directoryPath, file)
      const imageRef = await uploadImage(imagePath)
      imageRefs[file] = imageRef
      console.log(`Uploaded ${file} -> ${imageRef}`)
    }
    
    // Guardar las referencias en un archivo
    const refsPath = path.join(directoryPath, 'image-refs.json')
    fs.writeFileSync(refsPath, JSON.stringify(imageRefs, null, 2))
    console.log(`Image references saved to ${refsPath}`)
    
    return imageRefs
  } catch (error) {
    console.error('Error uploading images:', error)
    throw error
  }
}

// Ejecutar el script
const imagesDir = path.join(process.cwd(), 'product-images')
uploadImagesFromDirectory(imagesDir)
  .then(() => console.log('All images uploaded successfully!'))
  .catch(error => {
    console.error('Failed to upload images:', error)
    process.exit(1)
  }) 