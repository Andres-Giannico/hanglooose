'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

interface ProductGalleryProps {
  gallery?: (SanityImage | null)[]
}

const isValidSanityImage = (image: SanityImage | null | undefined): image is SanityImage => {
  if (!image || !image.asset || !image.asset._ref) {
    // console.warn('Invalid image:', image) // Silenced for production
    return false
  }
  return true
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const gallery = initialGallery?.filter(isValidSanityImage) || []

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'ArrowLeft') goToPrevious()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  if (gallery.length === 0) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-gray-200 rounded-lg w-full h-96 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const goToPrevious = () => {
    setSelectedImageIndex(prevIndex => (prevIndex === 0 ? gallery.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setSelectedImageIndex(prevIndex => (prevIndex === gallery.length - 1 ? 0 : prevIndex + 1))
  }

  const mainImage = gallery[selectedImageIndex]
  const mainImageUrl = getImageUrl(mainImage, 1200, 1200)

  const renderGrid = () => {
    const count = gallery.length
    
    if (count === 1) {
      return (
        <div className="h-96 md:h-[500px]">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
        </div>
      )
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-96 md:h-[500px]">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
          <GalleryImage image={gallery[1]} index={1} openLightbox={openLightbox} />
        </div>
      )
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 h-96 md:h-[500px]">
          <div className="md:col-span-2 md:row-span-2">
            <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
          </div>
          <div className="hidden md:block">
            <GalleryImage image={gallery[1]} index={1} openLightbox={openLightbox} />
          </div>
          <div className="hidden md:block">
            <GalleryImage image={gallery[2]} index={2} openLightbox={openLightbox} />
          </div>
        </div>
      )
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 h-96 md:h-[500px]">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
          <GalleryImage image={gallery[1]} index={1} openLightbox={openLightbox} />
          <GalleryImage image={gallery[2]} index={2} openLightbox={openLightbox} />
          <GalleryImage image={gallery[3]} index={3} openLightbox={openLightbox} />
        </div>
      )
    }
    
    // 5 or more images
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 h-96 md:h-[500px]">
        <div className="md:col-span-2 md:row-span-2">
          <GalleryImage image={gallery[0]} index={0} openLightbox={openLightbox} priority />
        </div>
        <div className="hidden md:block">
          {gallery[1] && <GalleryImage image={gallery[1]} index={1} openLightbox={openLightbox} />}
        </div>
        <div className="hidden md:block relative">
          {gallery[2] && <GalleryImage image={gallery[2]} index={2} openLightbox={openLightbox} />}
          {count > 3 && (
            <button onClick={() => openLightbox(2)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-2xl font-bold rounded-lg">
              +{count - 3}
            </button>
          )}
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