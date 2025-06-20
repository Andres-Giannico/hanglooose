import { client } from "@/sanity/client";
import type { Product } from "@/sanity/types";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import ProductClientPage from "./ProductClientPage";

// This is the new Server Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      ...,
      "slug": slug.current,
      "gallery": gallery[]{
        _key,
        _type,
        asset->{
          _id,
          _type,
          _ref,
          url
        },
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

  return <ProductClientPage product={product} />;
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