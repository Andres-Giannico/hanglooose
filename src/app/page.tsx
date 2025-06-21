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
  productType?: string;
  bookButtonText?: string;
  tripSummary?: string;
  specificTime?: string;
  childrenPrice?: number;
  childrenAgeRange?: string;
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
      isLikelyToSellOut,
      productType,
      bookButtonText,
      tripSummary,
      specificTime,
      childrenPrice,
      childrenAgeRange
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
                    Live the Best <span className="text-blue-300">Adventure</span> Experience
                  </>
                )}
              </h1>
              
              {/* Hero Subtitle */}
              <p className="text-xl sm:text-2xl mb-10 text-blue-100 max-w-2xl">
                {homeSettings?.heroSubtitle || "Experience unforgettable adventures with our premium services tailored to create memories that last a lifetime."}
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
              {homeSettings?.aboutTitle || "Your Premier Adventure Service"}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {homeSettings?.aboutDescription || "We specialize in providing unforgettable experiences tailored to your needs. Whether you're looking for relaxation, excitement, or adventure, we have the perfect service for you."}
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
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-70"></div>
        <div className="absolute top-20 right-10 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-blue-50 rounded-full opacity-40"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2 inline-block">Why us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {homeSettings?.featuresTitle || "Why Choose Our Services"}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We pride ourselves on delivering exceptional experiences and superior customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {(homeSettings?.features || []).map((feature: Feature, index: number) => {
              // Determine the best icon and color based on feature name/type
              let iconPath, bgColor, iconColor;
              if (feature.icon === 'check' || feature.title.toLowerCase().includes('booking')) {
                iconPath = "M5 13l4 4L19 7";
                bgColor = "bg-emerald-100";
                iconColor = "text-emerald-600";
              } else if (feature.icon === 'clock' || feature.title.toLowerCase().includes('hour') || feature.title.toLowerCase().includes('flexible')) {
                iconPath = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
                bgColor = "bg-amber-100";
                iconColor = "text-amber-600";
              } else if (feature.icon === 'shield' || feature.title.toLowerCase().includes('safe')) {
                iconPath = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";
                bgColor = "bg-blue-100";
                iconColor = "text-blue-600";
              } else if (feature.icon === 'phone' || feature.title.toLowerCase().includes('support')) {
                iconPath = "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z";
                bgColor = "bg-indigo-100";
                iconColor = "text-indigo-600";
              } else {
                iconPath = "M13 10V3L4 14h7v7l9-11h-7z";
                bgColor = "bg-blue-100";
                iconColor = "text-blue-600";
              }
              
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
                  <div className={`w-14 h-14 ${bgColor} rounded-lg mb-5 flex items-center justify-center`}>
                    <svg className={`w-7 h-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 flex-grow">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          {/* Decorative waves */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full opacity-20">
              <path fill="#ffffff" fillOpacity="1" d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,202.7C672,203,768,245,864,272C960,299,1056,309,1152,288C1248,267,1344,213,1392,186.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          
          {/* Animated particles/dots */}
          <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-white opacity-10 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-white opacity-10 animate-pulse" style={{animationDelay: "1s"}}></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white opacity-10 animate-pulse" style={{animationDelay: "2s"}}></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm mb-6">
              <span className="text-sm font-medium text-white">Start today</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              {homeSettings?.ctaTitle || "Ready to Start Your Adventure?"}
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {homeSettings?.ctaDescription || "Book your experience today and discover the magic of your next adventure"}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={homeSettings?.ctaButtonLink || "/categories"}
                className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {homeSettings?.ctaButtonText || "Browse Services"}
              </Link>
              
              {homeSettings?.contactPhoneNumber && (
                <a
                  href={`tel:${homeSettings.contactPhoneNumber}`}
                  className="inline-flex items-center justify-center gap-x-2 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Us</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
