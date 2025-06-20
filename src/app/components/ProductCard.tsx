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
  priceSubtitle?: string
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
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
        <div className="relative aspect-[4/3] overflow-hidden">
          {product.mainImage && (
            <Image
              src={urlForImage(product.mainImage)?.width(800).height(600).url() || ''}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestSeller && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm border border-amber-400/20">
                <svg className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                </svg>
                Best Seller
              </span>
            )}
            {product.isLikelyToSellOut && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm border border-rose-400/20">
                <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Likely to Sell Out
              </span>
            )}
          </div>
          
          {/* View details button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-lg backdrop-blur-sm border border-white/20">
              View Details
              <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {product.shortDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 flex-1">
              {product.shortDescription}
            </p>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-gray-100 mt-auto">
            <div className="flex items-baseline">
              {product.price && (
                <>
                  <span className="text-xl font-bold text-blue-600">€{product.price}</span>
                  {product.priceSubtitle && (
                    <span className="ml-1 text-sm font-medium text-gray-500">/ {product.priceSubtitle}</span>
                  )}
                </>
              )}
            </div>

            {(product.duration) && (
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium text-gray-500">{product.duration}</span>
              </div>
            )}
          </div>
          
          {(product.rating !== undefined && product.reviewCount !== undefined) && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-4 w-4 flex-shrink-0 ${
                      product.rating! > rating ? 'text-amber-400' : 'text-gray-200'
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
                <p className="ml-1 text-sm font-medium text-gray-600">({product.reviewCount})</p>
              </div>
              
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Book now
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 