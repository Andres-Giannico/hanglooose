import { client } from "@/sanity/client";
import type { Product } from "@/sanity/types";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import type { Viewport } from 'next';
import ProductClientPage from "./ProductClientPage";

// Prevent automatic scroll restoration
export const dynamic = 'force-dynamic';
export const viewport: Viewport = {
  themeColor: '#1e3a8a'
};

// Configuración personalizada para el comportamiento de scroll
export const metadata = {
  other: {
    scrollBehavior: 'manual'
  }
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
      highlights,
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
      productType,
      bookButtonText,
      tripSummary,
      specificTime,
      departurePoint,
      capacity,
      season,
      limitedAvailability,
      childrenPrice,
      childrenAgeRange,
      "customDetails": customDetails[]{
        icon,
        label,
        value
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
  // En Next.js 15, debemos evitar usar params.slug directamente
  // Usamos un enfoque más seguro
  const slugValue = typeof params === 'object' && params ? params.slug || '' : '';
  
  const product = await getProduct(slugValue);
  const settings = await getSettings();

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
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