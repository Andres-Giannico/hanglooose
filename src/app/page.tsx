import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { ProductCard } from "@/sanity/types";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products: ProductCard[] = await client.fetch(
    groq`*[_type == "product"]{
      _id,
      name,
      "slug": slug.current,
      "mainImage": gallery[0],
      price,
      priceSubtitle
    }`
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <h1 className="text-4xl font-bold text-center w-full">Hang Loose Ibiza</h1>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product.slug}`} className="group">
            <div className="block overflow-hidden rounded-lg border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-xl">
              <div className="relative h-64 w-full overflow-hidden">
                {product.mainImage ? (
            <Image
                    src={urlForImage(product.mainImage).width(500).height(400).url()}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                ) : <div className="w-full h-full bg-gray-200"></div> }
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline">
                  <p className="text-xl font-bold text-gray-900">
                    From {product.price} EUR
                  </p>
                  {product.priceSubtitle && (
                    <p className="ml-2 text-sm text-gray-500">
                      {product.priceSubtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
        </div>
      </main>
  );
}
