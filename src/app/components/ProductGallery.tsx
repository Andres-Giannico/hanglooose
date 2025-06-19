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

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? gallery.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === gallery.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className="lg:col-span-2">
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pr-2 justify-center md:justify-start">
          {gallery.map((image, index) => (
            <button
              key={image.asset._ref}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                currentIndex === index ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <Image
                src={urlForImage(image).width(100).height(100).url()}
                alt={`Product thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image with Arrows */}
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden flex-1">
          {/* Left Arrow */}
          <button 
              onClick={goToPrevious} 
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none"
              aria-label="Previous image"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
          </button>
          
          <Image
          src={urlForImage(gallery[currentIndex]).width(800).height(800).url()}
          alt={`Product image ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
          key={currentIndex}
          />

          {/* Right Arrow */}
          <button 
              onClick={goToNext}
              className="absolute top-1/2 right-3 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none"
              aria-label="Next image"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
          {gallery.map((_, slideIndex) => (
              <button
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                      currentIndex === slideIndex ? 'w-6 bg-blue-500' : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${slideIndex + 1}`}
              ></button>
          ))}
      </div>
    </div>
  )
} 