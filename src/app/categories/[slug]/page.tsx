import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'
import ProductCard from '@/app/components/ProductCard'

// Types
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

interface Category {
  _id: string
  name: string
  description?: string
  image?: SanityImage
  products?: Product[]
}

// Query
const categoryQuery = groq`*[_type == "category" && slug.current == $slug][0]{
  _id,
  name,
  description,
  image,
  "products": *[_type == "product" && references(^._id)]{
    _id,
    name,
    "slug": slug.current,
    mainImage,
    price,
    shortDescription,
    duration,
    rating,
    reviewCount,
    isBestSeller,
    isLikelyToSellOut
  }
}`

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

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category: Category = await client.fetch(categoryQuery, { slug: params.slug })

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="relative mb-8">
          {category.image?.asset && (
            <div className="relative h-64 w-full overflow-hidden rounded-2xl">
              <Image
                src={urlForImage(category.image)?.width(1920).height(512).url() || ''}
                alt={category.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center">{category.name}</h1>
              </div>
            </div>
          )}
          {!category.image?.asset && (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          )}
          {category.description && (
            <p className="mt-4 text-lg text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Products Grid */}
        {category.products && category.products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products in this category</h3>
            <p className="mt-1 text-sm text-gray-500">
              We haven't added any products to this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 