'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

interface ProductGalleryProps {
  gallery: SanityImage[]
}

const isValidSanityImage = (image: unknown): image is SanityImage => {
  return image !== null && 
         typeof image === 'object' && 
         image !== null &&
         'asset' in image &&
         image.asset !== null &&
         typeof image.asset === 'object'
}

const getImageUrl = (image: SanityImage | null | undefined, width: number, height: number): string | undefined => {
  if (!isValidSanityImage(image)) {
    return undefined
  }
  
  const url = urlForImage(image)?.width(width).height(height).fit('crop').url()
  if (!url) {
    // console.warn('Could not generate URL for image:', image) // Silenced for production
    return undefined
  }
  
  return url
}

const GalleryImage = ({ image, index, openLightbox, priority = false }: { image: SanityImage, index: number, openLightbox: (index: number) => void, priority?: boolean }) => {
  const imageUrl = getImageUrl(image, 800, 800)
  if (!imageUrl) return <div className="bg-gray-200 w-full h-full animate-pulse" />
  
  return (
    <button onClick={() => openLightbox(index)} className="w-full h-full relative overflow-hidden rounded-lg block">
      <Image
        src={imageUrl}
        alt={`Product image ${index + 1}`}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-300 hover:scale-105"
        priority={priority}
      />
    </button>
  )
}

export default function ProductGallery({ gallery: initialGallery }: ProductGalleryProps) {
  const [gallery] = useState(initialGallery || [])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mainImageUrl, setMainImageUrl] = useState<string | undefined>()

  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goToNext = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % gallery.length)
  }, [gallery.length])

  const goToPrevious = useCallback(() => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + gallery.length) % gallery.length)
  }, [gallery.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!lightboxOpen) return

      switch (event.key) {
        case 'ArrowRight':
          goToNext()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'Escape':
          closeLightbox()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToNext, goToPrevious, closeLightbox])

  useEffect(() => {
    if (lightboxOpen && gallery[selectedImageIndex]) {
      const url = getImageUrl(gallery[selectedImageIndex], 1200, 1200)
      setMainImageUrl(url)
    }
  }, [selectedImageIndex, lightboxOpen, gallery])

  const renderGrid = () => {
    if (!gallery || gallery.length === 0) {
      return (
        <div className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse" />
      )
    }

    if (gallery.length === 1) {
      return (
        <div className="aspect-[4/3]">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
        </div>
      )
    }

    if (gallery.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-4">
          {gallery.map((image, index) => (
            <div key={index} className="aspect-[4/3]">
              <GalleryImage image={image} index={index} openLightbox={openLightbox} priority={index === 0} />
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="aspect-[4/3]">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
        </div>
        <div className="grid grid-rows-2 gap-4">
          {gallery.slice(1, 3).map((image, index) => (
            <div key={index} className="aspect-[4/3]">
              <GalleryImage image={image} index={index + 1} openLightbox={openLightbox} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-2">
      {renderGrid()}
      
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white z-50 p-2" aria-label="Close gallery">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          
          <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex flex-col items-center justify-center">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={`Product image ${selectedImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                className="transition-opacity duration-300"
                key={selectedImageIndex}
                priority
              />
            ) : (
              <div className="text-white">Image not available</div>
            )}
            <div className="absolute bottom-4 text-white text-lg bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 