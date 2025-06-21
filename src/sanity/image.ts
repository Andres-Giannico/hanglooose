import createImageUrlBuilder from '@sanity/image-url'
import type {Image} from 'sanity'
import {dataset, projectId} from './env'

// Define a type for your enriched Sanity image object
// This can be the basic 'Image' type from 'sanity' or a more specific one
export type SanityImage = Image

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

/**
 * Función optimizada para generar URLs de imágenes de Sanity
 * 
 * @param source - Objeto de imagen de Sanity
 * @returns Generador de URL de imagen o undefined si la imagen no es válida
 */
export const urlForImage = (source: SanityImage) => {
  // Ensure that source image is valid before trying to build a URL
  if (!source?.asset?._ref) {
    return undefined;
  }
  
  return imageBuilder
    .image(source)
    .auto('format') // Elegir automáticamente el mejor formato según el navegador
    .fit('max') // Mantener la relación de aspecto
} 