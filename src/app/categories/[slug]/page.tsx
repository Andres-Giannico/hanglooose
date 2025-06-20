import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ProductCard from '@/app/components/ProductCard'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategory(slug: string) {
  return await client.fetch(
    groq`*[_type == "category" && slug.current == $slug][0]{
      title,
      "products": *[_type == "product" && references(^._id)]{
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Categoría no encontrada</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{category.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.products?.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
} 