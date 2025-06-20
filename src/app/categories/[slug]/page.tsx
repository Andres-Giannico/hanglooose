import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ProductCard from '@/app/components/ProductCard'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'
import type { Metadata } from 'next'

interface Product {
  _id: string
  name: string
  slug: string
  mainImage?: SanityImage
  shortDescription?: string
  price?: number
  priceSubtitle?: string
  duration?: string
  rating?: number
  reviewCount?: number
  isBestSeller?: boolean
  isLikelyToSellOut?: boolean
}

interface Category {
  title: string
  description?: string
  shortDescription?: string
  headerImage?: SanityImage
  seoDescription?: string
  products?: Product[]
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategory(slug: string) {
  return await client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0]{
      title,
      description,
      shortDescription,
      headerImage,
      seoDescription,
      "products": *[_type == "product" && references(^._id)] | order(rating desc) {
        _id,
        name,
        "slug": slug.current,
        mainImage,
        shortDescription,
        price,
        priceSubtitle,
        duration,
        rating,
        reviewCount,
        isBestSeller,
        isLikelyToSellOut
      }
    }`,
    { slug }
  )
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug) as Category
  
  if (!category) {
    return {
      title: 'Category not found'
    }
  }
  
  return {
    title: `${category.title} | Hang Loose Ibiza`,
    description: category.seoDescription || category.shortDescription || `Explore ${category.title} in Ibiza with Hang Loose Ibiza`
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug) as Category

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Category not found</h1>
      </div>
    )
  }
  
  const productCount = category.products?.length || 0;

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {category.headerImage && (
            <Image
              src={urlForImage(category.headerImage)?.width(1920).height(600).url() || ''}
              alt={category.title}
              fill
              className="object-cover opacity-40"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-900/60" />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">{category.title}</h1>
            {category.shortDescription && (
              <p className="text-xl text-blue-100 mb-6">{category.shortDescription}</p>
            )}
            
            {/* Activity count badge */}
            <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {productCount} {productCount === 1 ? 'activity' : 'activities'} available
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        {/* Information Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Book in advance to secure your spot. Flexible cancellation available on most activities.
              </p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {category.description && (
          <div className="mb-12 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">About {category.title}</h2>
            <div className="prose max-w-none text-gray-700">
              <p>{category.description}</p>
            </div>
          </div>
        )}
        
        {/* Filters and Sort Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {productCount > 0 ? 'Available Activities' : 'No Activities Available'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sort Dropdown (static in SSR) */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <span className="text-sm font-medium text-gray-900 border border-gray-300 rounded-md px-3 py-1">
                Most Popular
              </span>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {productCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products?.map((product: Product) => (
              <div key={product._id} className="transform hover:-translate-y-1 duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Activities Available</h3>
            <p className="mt-2 text-gray-500">No activities were found in this category at the moment.</p>
          </div>
        )}
        
        {/* Bottom CTA */}
        {productCount > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                We have many more options available. Explore all our activities or get in touch with us for assistance.
              </p>
              <a href="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Contact Us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 