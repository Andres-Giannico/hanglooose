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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.mainImage && (
          <Image
            src={urlForImage(product.mainImage)?.width(600).height(600).url() || ''}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="inline-flex items-center rounded-full bg-yellow-400/90 px-2 py-1 text-xs font-medium text-yellow-900">
              Best Seller
            </span>
          )}
          {product.isLikelyToSellOut && (
            <span className="inline-flex items-center rounded-full bg-red-500/90 px-2 py-1 text-xs font-medium text-white">
              Likely to Sell Out
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        
        {product.shortDescription && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            {product.price && (
              <>
                <span className="text-lg font-bold text-gray-900">€{product.price}</span>
                {product.duration && (
                  <span className="ml-2 text-sm text-gray-500">{product.duration}</span>
                )}
              </>
            )}
          </div>

          {(product.rating !== undefined && product.reviewCount !== undefined) && (
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-4 w-4 flex-shrink-0 ${
                      product.rating! > rating ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <p className="ml-1 text-sm text-gray-500">({product.reviewCount})</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 