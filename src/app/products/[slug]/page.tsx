import { client } from "@/sanity/client";
import type { Product } from "@/sanity/types";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import ProductClientPage from "./ProductClientPage";

// Prevent automatic scroll restoration
export const dynamic = 'force-dynamic';
export const viewport = {
  scrollBehavior: 'manual'
};

// This is the new Server Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      ...,
      "slug": slug.current,
      "gallery": gallery[]{
        _key,
        _type,
        asset,
        hotspot,
        crop
      },
      "paymentMethods": {
        ...,
        "logos": logos{
          _type,
          asset->{
            _id,
            _type,
            _ref,
            url
          }
        }
      }
    }`,
    { slug: params.slug }
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen scroll-smooth" style={{ scrollBehavior: 'auto' }}>
      <ProductClientPage product={product} />
    </div>
  );
}

// Re-enable static page generation for better performance and SEO
/*
export async function generateStaticParams() {
  const products: Pick<Product, 'slug'>[] = await client.fetch(groq`*[_type == "product"]{"slug": slug.current}`);
  return products.map((product) => ({
    slug: product.slug,
  }));
} 
*/ 