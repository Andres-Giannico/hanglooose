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
        <span className="text-gray-400">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg bg-gray-100">
        {getImageUrl(gallery[selectedImage], 1200, 900) ? (
          <Image
            src={getImageUrl(gallery[selectedImage], 1200, 900)!}
            alt={`Product image ${selectedImage + 1}`}
            fill
            className="object-cover"
            priority={selectedImage === 0}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
          {gallery.map((image, index) => {
            const thumbUrl = getImageUrl(image, 200, 200)
            if (!thumbUrl) return null

            return (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden rounded-lg ${
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
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
} 