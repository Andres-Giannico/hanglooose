import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ProductCard from './components/ProductCard'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/image'

async function getHomeData() {
  return client.fetch(groq`{
    "homeSettings": *[_type == "homeSettings"][0] {
      heroTitle,
      heroSubtitle,
      heroImage,
      heroButtonText,
      heroButtonLink,
      aboutTitle,
      aboutDescription,
      aboutFeatures,
      featuresTitle,
      features,
      ctaTitle,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink
    },
    "featuredProducts": *[_type == "product" && showOnHome == true] | order(rating desc) [0...10] {
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
  }`)
}

export default async function Home() {
  const { homeSettings, featuredProducts } = await getHomeData()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {homeSettings?.heroImage ? (
            <Image
              src={urlForImage(homeSettings.heroImage)?.url() || ''}
              alt="Hero background"
              fill
              className="object-cover opacity-30"
              priority
            />
          ) : (
            <Image
              src="/hero-bg.jpg"
              alt="Default hero background"
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
        </div>
        <div className="relative container mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {homeSettings?.heroTitle || "Discover Ibiza's Hidden Gems by Boat"}
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              {homeSettings?.heroSubtitle || "Experience the magic of Ibiza's crystal-clear waters and secluded coves. No license needed for selected boats."}
            </p>
            <Link 
              href={homeSettings?.heroButtonLink || "/categories/boat-hire-ibiza"}
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              {homeSettings?.heroButtonText || "Explore Our Boats"}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {homeSettings?.aboutTitle || "Your Premier Boat Rental Service in Ibiza"}
            </h2>
            <p className="text-xl text-gray-600 mb-16 leading-relaxed">
              {homeSettings?.aboutDescription || "At Hang Loose Ibiza, we specialize in providing unforgettable boating experiences around the beautiful island of Ibiza. Whether you're looking for a relaxing day trip to Formentera, an exciting coastal adventure, or a sunset cruise, we have the perfect boat for you."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(homeSettings?.aboutFeatures || []).map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg 
                      className="w-10 h-10 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {/* Iconos personalizados basados en el título */}
                      {feature.title.toLowerCase().includes('license') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {feature.title.toLowerCase().includes('location') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      )}
                      {feature.title.toLowerCase().includes('support') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      )}
                      {feature.title.toLowerCase().includes('jet') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Most Popular Boats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {homeSettings?.featuresTitle || "Why Choose Hang Loose Ibiza"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(homeSettings?.features || []).map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {feature.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                    {feature.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {feature.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                    {feature.icon === 'phone' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {homeSettings?.ctaTitle || "Ready to Start Your Adventure?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {homeSettings?.ctaDescription || "Book your boat today and discover the magic of Ibiza's waters"}
          </p>
          <Link 
            href={homeSettings?.ctaButtonLink || "/categories/boat-hire-ibiza"}
            className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            {homeSettings?.ctaButtonText || "View All Boats"}
          </Link>
        </div>
      </section>
    </main>
  )
}
