import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ProductCard from './components/ProductCard'
import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  shortDescription?: string;
  price?: number;
  priceSubtitle?: string;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  isBestSeller?: boolean;
  isLikelyToSellOut?: boolean;
}

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
      <section className="relative h-screen max-h-[800px] min-h-[600px] bg-gradient-to-r from-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {homeSettings?.heroImage ? (
            <Image
              src={urlForImage(homeSettings.heroImage)?.url() || ''}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <Image
              src="/hero-bg.jpg"
              alt="Default hero background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent"></div>
          
          {/* Optional decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent opacity-10"></div>
          
          {/* Animated wave effect */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-10">
              <path fill="#ffffff" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Highlighted tag */}
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm mb-6">
                <span className="text-sm font-medium text-white">
                  Experience Ibiza like never before
                </span>
              </div>
              
              {/* Hero Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {homeSettings?.heroTitle || (
                  <>
                    Live the Best <span className="text-blue-300">Sea & Land</span> Adventures
                  </>
                )}
              </h1>
              
              {/* Hero Subtitle */}
              <p className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl">
                {homeSettings?.heroSubtitle || "From license-free boats to thrilling quad tours, explore the magic of Ibiza your way with Hangloose."}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href={homeSettings?.heroButtonLink || "/categories"}
                  className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {homeSettings?.heroButtonText || "Explore More"}
                </Link>
                
                <Link 
                  href="/contact"
                  className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-14 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {homeSettings?.aboutTitle || "Your Premier Boat Rental Service in Ibiza"}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {homeSettings?.aboutDescription || "At Hang Loose Ibiza, we specialize in providing unforgettable boating experiences around the beautiful island of Ibiza. Whether you're looking for a relaxing day trip to Formentera, an exciting coastal adventure, or a sunset cruise, we have the perfect boat for you."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {(homeSettings?.aboutFeatures || []).map((feature: Feature, index: number) => {
              // Determine icon based on feature title
              let iconPath;
              if (feature.title.toLowerCase().includes('license')) {
                iconPath = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
              } else if (feature.title.toLowerCase().includes('location')) {
                iconPath = "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z";
              } else if (feature.title.toLowerCase().includes('support')) {
                iconPath = "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z";
              } else {
                iconPath = "M13 10V3L4 14h7v7l9-11h-7z";
              }
              
              return (
                <div 
                  key={index} 
                  className="flex items-center bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                    <svg 
                      className="w-5 h-5 text-blue-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Most Popular Services
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts?.map((product: Product) => (
              <div key={product._id} className="transform hover:-translate-y-1 duration-300">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/categories" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors group"
            >
              Explore all our services
              <svg 
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
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
            {(homeSettings?.features || []).map((feature: Feature, index: number) => (
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
