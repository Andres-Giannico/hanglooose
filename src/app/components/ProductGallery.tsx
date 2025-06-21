'use client'

import { useState } from 'react'
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
    return undefined
  }
  
  return url
}

export default function ProductGallery({ gallery }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

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
          <Image
            src={getImageUrl(gallery[selectedImage], 1200, 900)!}
            alt={`Product image ${selectedImage + 1}`}
            fill
            className="object-cover"
            priority={selectedImage === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-400 text-sm sm:text-base">Image not available</span>
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
                onClick={() => setSelectedImage(index)}
                className={`relative flex-none w-16 h-16 sm:w-auto sm:h-auto aspect-square overflow-hidden rounded-lg ${
                  selectedImage === index
                    ? 'ring-2 ring-blue-500'
                    : 'hover:opacity-75 transition-opacity'
                }`}
              >
                <Image
                  src={thumbUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
} 