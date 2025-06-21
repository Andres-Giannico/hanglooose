import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ProductCard from '@/app/components/ProductCard'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'
import type { Metadata, Viewport } from 'next'
import CategoryClientPage from './CategoryClientPage'

// Configuración de viewport
export const viewport: Viewport = {
  themeColor: '#1e3a8a'
}

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
  productType?: string
  bookButtonText?: string
  tripSummary?: string
  specificTime?: string
  childrenPrice?: number
  childrenAgeRange?: string
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
        isLikelyToSellOut,
        productType,
        bookButtonText,
        tripSummary,
        specificTime,
        childrenPrice,
        childrenAgeRange
      }
    }`,
    { slug }
  )
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // En Next.js 15, debemos evitar usar params.slug directamente
  const slugValue = typeof params === 'object' && params ? params.slug || '' : '';
  const category = await getCategory(slugValue) as Category
  
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
  // En Next.js 15, debemos evitar usar params.slug directamente
  const slugValue = typeof params === 'object' && params ? params.slug || '' : '';
  const category = await getCategory(slugValue) as Category

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Category not found</h1>
      </div>
    )
  }
  
  // Pasamos los datos al componente cliente
  return <CategoryClientPage category={category} />
} 