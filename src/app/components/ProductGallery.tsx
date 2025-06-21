'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

// Helper function to check if an image is valid
const isValidSanityImage = (image: SanityImage | null | undefined): image is SanityImage => {
  return Boolean(image && image.asset && image.asset._ref)
}

interface ProductGalleryProps {
  gallery: SanityImage[]
}

// Función optimizada para obtener URLs de imágenes con formatos modernos y calidad optimizada
const getImageUrl = (image: SanityImage | null | undefined, width: number, height: number): string | undefined => {
  if (!isValidSanityImage(image)) {
    return undefined
  }
  
  // Usar formatos modernos (webp) y ajustar la calidad para optimizar
  const url = urlForImage(image)
    ?.width(width)
    ?.height(height)
    ?.format('webp') // Usar formato webp para mejor compresión
    ?.quality(80) // Reducir ligeramente la calidad para mejorar el rendimiento
    ?.fit('crop')
    ?.url()
    
  if (!url) {
    return undefined
  }
  
  return url
}

// Blur hash placeholder (base64) para mostrar mientras se cargan las imágenes
const blurHashPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJ5cZRj3wAAAABJRU5ErkJggg=='

export default function ProductGallery({ gallery }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoaded, setIsLoaded] = useState<boolean[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const imagesCount = gallery?.length || 0

  // Inicializar el estado de carga para cada imagen
  useEffect(() => {
    if (imagesCount > 0) {
      setIsLoaded(new Array(imagesCount).fill(false))
    }
  }, [imagesCount])

  // Función para navegar a la siguiente imagen
  const goToNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % imagesCount)
  }, [imagesCount])

  // Función para navegar a la imagen anterior
  const goToPrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + imagesCount) % imagesCount)
  }, [imagesCount])

  // Configurar el autoplay
  useEffect(() => {
    if (imagesCount <= 1) return

    // Iniciar el temporizador para cambiar la imagen cada 4 segundos
    timerRef.current = setInterval(() => {
      goToNextImage()
    }, 4000)

    // Limpiar el temporizador cuando el componente se desmonte
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [goToNextImage, imagesCount])

  // Reiniciar el temporizador cuando se cambie manualmente la imagen
  const handleImageChange = (index: number) => {
    setSelectedImage(index)
    
    // Reiniciar el temporizador
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        goToNextImage()
      }, 4000)
    }
  }

  // Manejar la carga completa de una imagen
  const handleImageLoaded = (index: number) => {
    setIsLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  if (!gallery || gallery.length === 0) {
    return (
      <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm sm:text-base">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Main Image */}
      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg bg-gray-100">
        {getImageUrl(gallery[selectedImage], 1200, 900) ? (
          <>
            {/* Imagen de baja resolución para mostrar inmediatamente */}
            <Image
              src={getImageUrl(gallery[selectedImage], 120, 90) || blurHashPlaceholder}
              alt={`Product thumbnail ${selectedImage + 1}`}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded[selectedImage] ? 'opacity-0' : 'opacity-100 blur-sm scale-105'}`}
              priority={false}
              unoptimized
              sizes="20vw"
            />
            
            {/* Imagen principal de alta calidad */}
            <Image
              src={getImageUrl(gallery[selectedImage], 1200, 900) || ''}
              alt={`Product image ${selectedImage + 1}`}
              fill
              className={`object-cover transition-opacity duration-300 ${isLoaded[selectedImage] ? 'opacity-100' : 'opacity-0'}`}
              priority={selectedImage === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
              onLoadingComplete={() => handleImageLoaded(selectedImage)}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-400 text-sm sm:text-base">Image not available</span>
          </div>
        )}

        {/* Navigation Arrows */}
        {
          <>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleImageChange((selectedImage - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md transition-colors"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleImageChange((selectedImage + 1) % gallery.length);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 p-2 rounded-full shadow-md transition-colors"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        }

        {/* Dots Indicators */}
        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {gallery.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => handleImageChange(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Current image indicator for mobile */}
        {gallery.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white font-medium sm:hidden">
            {selectedImage + 1} / {gallery.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex overflow-x-auto pb-2 sm:grid sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 hide-scrollbar">
          {gallery.map((image, index) => {
            const thumbUrl = getImageUrl(image, 150, 150)
            if (!thumbUrl) return null

            return (
              <button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`relative flex-none w-16 h-16 sm:w-auto sm:h-auto aspect-square overflow-hidden rounded-lg ${
                  selectedImage === index
                    ? 'ring-2 ring-blue-500'
                    : 'hover:opacity-75 transition-opacity'
                }`}
              >
                {/* Usar el componente Image de Next.js con optimización */}
                <Image
                  src={thumbUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  loading="lazy" // Cargar de forma diferida las miniaturas que no están en el viewport
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
} 