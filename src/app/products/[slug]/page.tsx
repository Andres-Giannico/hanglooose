/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { Product, SanityImage } from "@/sanity/types";
import { PortableText } from "@portabletext/react";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import ProductGallery from "@/app/components/ProductGallery";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product: Product = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      gallery,
      price,
      priceSubtitle,
      highlights,
      fullDescription,
      includes,
      notIncludes,
      features,
      freeCancellation,
      reserveNowPayLater,
      instructorInfo,
      isPrivateGroup,
      importantInformation
    }`,
    { slug: params.slug }
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
        <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h1>
            {/* Breadcrumbs or category can go here */}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Image Gallery */}
        <ProductGallery gallery={product.gallery} />

        {/* Pricing & Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-white border rounded-lg shadow-lg">
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold">€{product.price}</span>
              {product.priceSubtitle && <span className="ml-2 text-gray-500">{product.priceSubtitle}</span>}
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Check availability
            </button>
            <div className="mt-4 text-sm text-gray-600">
              {product.reserveNowPayLater && <p className="mb-2">✓ Reserve now & pay later</p>}
              {product.freeCancellation && <p>✓ Free cancellation available</p>}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 mt-8 lg:mt-0">
            {/* Highlights */}
            {product.highlights && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-3">Highlights</h2>
                    <ul className="list-disc list-inside space-y-1">
                        {product.highlights.map((highlight: string, index: number) => (
                            <li key={index}>{highlight}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Full Description */}
            {product.fullDescription && (
                <div className="mb-8 prose max-w-none">
                    <h2 className="text-2xl font-bold mb-3">Full description</h2>
                    <PortableText value={product.fullDescription} />
                </div>
            )}

            {/* Price Details (Includes / Not Includes) */}
            {(product.includes && product.includes.length > 0) || (product.notIncludes && product.notIncludes.length > 0) ? (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Detalles de precio</h2>
                    
                    {product.includes && product.includes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3 text-green-700">Incluido en el precio</h3>
                            <ul className="space-y-2">
                                {product.includes.map((item: string, index: number) => (
                                    <li key={index} className="flex items-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-3 text-green-500 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {product.notIncludes && product.notIncludes.length > 0 && (
                         <div>
                            <h3 className="text-lg font-semibold mb-3 text-red-700">No incluido en el precio</h3>
                            <ul className="space-y-2">
                                {product.notIncludes.map((item: string, index: number) => (
                                    <li key={index} className="flex items-center text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-3 text-red-500 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : null}

            {/* Important Information */}
            {product.importantInformation && (
                <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-2xl font-bold mb-3">Important information</h2>
                    <PortableText value={product.importantInformation} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Generate static pages for better SEO
// Temporarily disabled to resolve build issue
// export async function generateStaticParams() {
//   const products: Pick<Product, 'slug'>[] = await client.fetch(groq`*[_type == "product"]{"slug": slug.current}`);
//   return products.map((product) => ({
//     slug: product.slug,
//   }));
// } 