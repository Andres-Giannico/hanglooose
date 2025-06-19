'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

interface ProductGalleryProps {
  gallery?: SanityImage[]
}

export default function ProductGallery({ gallery }: ProductGalleryProps) {
  if (!gallery || gallery.length === 0) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-gray-200 rounded-lg w-full h-96 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    )
  }

  const [selectedImage, setSelectedImage] = useState(gallery[0])

  return (
    <div className="lg:col-span-2 flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pr-2">
        {gallery.map((image) => (
          <button
            key={image.asset._ref}
            onClick={() => setSelectedImage(image)}
            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage.asset._ref === image.asset._ref ? 'border-blue-500' : 'border-transparent'
            }`}
          >
            <Image
              src={urlForImage(image).width(100).height(100).url()}
              alt="Product thumbnail"
              layout="fill"
              objectFit="cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden flex-1">
        <Image
          src={urlForImage(selectedImage).width(800).height(800).url()}
          alt="Main product image"
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
        />
      </div>
    </div>
  )
} 