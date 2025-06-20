import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import ProductCard from '@/app/components/ProductCard'
import type { Product } from '@/sanity/types'

interface Category {
  title: string
  products: Product[]
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category: Category = await client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0]{
      title,
      "products": *[_type == "product" && references(^._id)]{
        _id,
        name,
        "slug": slug.current,
        mainImage,
        price,
        priceSubtitle,
        shortDescription,
        duration,
        rating,
        reviewCount,
        isBestSeller,
        isLikelyToSellOut
      }
    }`,
    { slug: params.slug }
  )

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{category.title}</h1>
      
      {category.products && category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  )
} 