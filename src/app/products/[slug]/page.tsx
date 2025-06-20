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

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  return await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      mainImage,
      gallery,
      shortDescription,
      fullDescription[]{
        ...,
        _type == "image" => {
          ...,
          asset->
        },
        _type == "htmlContent" => {
          ...,
          code
        }
      },
      price,
      showFromPrice,
      priceSubtitle,
      duration,
      rating,
      reviewCount,
      isBestSeller,
      isLikelyToSellOut,
      features,
      includes,
      notIncludes,
      freeCancellation,
      reserveNowPayLater,
      instructorInfo,
      isPrivateGroup,
      bookingGuarantees,
      paymentMethods,
      importantInformation,
      bookingWidget,
      "faqs": faqs[]{
        question,
        answer
      },
      category->{
        _id,
        title,
        "slug": slug.current
      }
    }`,
    { slug }
  );
}

async function getSettings() {
  return await client.fetch(groq`*[_type == "siteSettings"][0]{
    whatsappNumber,
    whatsappDefaultMessage,
    whatsappButtonText
  }`);
}

// This is the new Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);
  const settings = await getSettings();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen scroll-smooth" style={{ scrollBehavior: 'auto' }}>
      <ProductClientPage product={product} whatsappSettings={settings} />
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