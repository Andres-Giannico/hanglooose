'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

interface Product {
  _id: string
  name: string
  slug: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  price?: number
  shortDescription?: string
  duration?: string
  rating?: number
  reviewCount?: number
  isBestSeller?: boolean
  isLikelyToSellOut?: boolean
}

function HeartIcon({ className = "w-6 h-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}

function StarIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  )
}

function ClockIcon({ className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {product.mainImage?.asset ? (
          <Image
            src={urlForImage(product.mainImage)?.width(600).height(450).url() || ''}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button 
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
          onClick={(e) => {
            e.preventDefault() // Prevent navigation when clicking the heart
            // Add favorite functionality here later
          }}
        >
          <HeartIcon className="h-5 w-5 text-gray-600" />
        </button>

        {/* Labels */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isBestSeller && (
            <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
              Best Seller
            </span>
          )}
          {product.isLikelyToSellOut && (
            <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              Likely to Sell Out
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating */}
        {product.rating && (
          <div className="mb-2 flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-medium text-gray-900">{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="text-sm text-gray-500">
                ({product.reviewCount.toLocaleString()} {product.reviewCount === 1 ? 'Rating' : 'Ratings'})
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="flex-1 text-lg font-semibold leading-tight text-gray-900">
          {product.name}
        </h3>

        {/* Duration */}
        {product.duration && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <ClockIcon className="h-4 w-4" />
            <span>{product.duration}</span>
          </div>
        )}

        {/* Price */}
        {product.price && (
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-sm text-gray-500">from</span>
            <span className="text-xl font-bold text-gray-900">€{product.price}</span>
          </div>
        )}
      </div>
    </Link>
  )
} 