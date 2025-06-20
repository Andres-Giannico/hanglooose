'use client';

import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/sanity/image'
import type { SanityImage } from '@/sanity/types'
import ProductCard from '@/app/components/ProductCard'

interface Product {
  _id: string
  name: string
  slug: string
  mainImage?: SanityImage
  shortDescription?: string
  price?: number
  priceSubtitle?: string
  duration?: string
  rating?: number
  reviewCount?: number
  isBestSeller?: boolean
  isLikelyToSellOut?: boolean
}

interface Category {
  title: string
  description?: string
  shortDescription?: string
  headerImage?: SanityImage
  seoDescription?: string
  products?: Product[]
}

interface CategoryClientPageProps {
  category: Category
}

export default function CategoryClientPage({ category }: CategoryClientPageProps) {
  const productCount = category.products?.length || 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[35vh] min-h-[280px] bg-gradient-to-r from-blue-800 to-indigo-800 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -left-20 -top-20 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl"></div>
        
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          {category.headerImage && (
            <div className="h-full w-full relative scale-[1.15] origin-center motion-safe:animate-subtle-zoom">
              <Image
                src={urlForImage(category.headerImage)?.width(1920).height(1080).url() || ''}
                alt={category.title}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
                priority
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 backdrop-blur-sm" />
        </div>
        
        {/* Breadcrumbs */}
        <div className="relative container mx-auto px-4 pt-6 sm:pt-8">
          <nav className="flex text-xs sm:text-sm font-medium">
            <Link href="/" className="text-blue-100 hover:text-white transition">
              Inicio
            </Link>
            <span className="mx-1 sm:mx-2 text-blue-200">/</span>
            <span className="text-white truncate max-w-[200px]">{category.title}</span>
          </nav>
        </div>
        
        {/* Hero content */}
        <div className="relative container mx-auto px-4 flex flex-col justify-center h-full pb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
              <span className="inline-block motion-safe:animate-fade-in-up">{category.title}</span>
            </h1>
            
            {category.shortDescription && (
              <p className="text-lg text-blue-50 mb-5 max-w-2xl motion-safe:animate-fade-in-up motion-safe:animate-delay-200 drop-shadow-sm">
                {category.shortDescription}
              </p>
            )}
            
            {/* Activity count badge */}
            <div className="flex flex-wrap gap-4 motion-safe:animate-fade-in-up motion-safe:animate-delay-300">
              <div className="inline-flex items-center rounded-full bg-blue-700/80 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-md border border-blue-600/20">
                <svg 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-blue-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="mr-1 font-bold">{productCount}</span> 
                <span className="hidden xs:inline">{productCount === 1 ? 'activity' : 'activities'} </span>
                <span>available</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute -bottom-1 left-0 right-0 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" fill="white" preserveAspectRatio="none" className="h-8 w-full">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        {/* Information Banner */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-blue-50 border border-blue-200 p-3 sm:p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 shadow-inner w-fit mb-2 sm:mb-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="sm:ml-3">
              <p className="text-blue-800 font-medium text-xs sm:text-sm">
                Book in advance to secure your spot. Flexible cancellation available on most activities.
              </p>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {category.description && (
          <div className="mb-16 max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-3">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              About {category.title}
            </h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p>{category.description}</p>
            </div>
          </div>
        )}
        
        {/* Filters and Sort Row */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 sm:mb-10 sm:pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                {productCount > 0 ? (
                  <>
                    <span>Available Activities</span>
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-blue-600 bg-blue-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                      {productCount}
                    </span>
                  </>
                ) : (
                  'No Activities Available'
                )}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 mt-3 md:mt-0">
              {/* Sort Dropdown (static in SSR) */}
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-gray-500 mr-1 sm:mr-2">Sort by:</span>
                <div className="relative">
                  <span className="text-xs sm:text-sm font-medium bg-white border border-gray-300 rounded-lg px-2 sm:px-4 py-1 sm:py-2 inline-flex items-center cursor-default">
                    Most Popular
                    <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {productCount > 0 ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {category.products?.map((product: Product, index: number) => (
                <div 
                  key={product._id} 
                  className="transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl shadow-inner max-w-4xl mx-auto">
            <div className="mx-auto h-32 w-32 text-gray-300">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">No Activities Available</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">We're constantly adding new experiences to our catalog. Please check back soon or explore our other categories.</p>
            <div className="mt-8">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        )}
        
        {/* Bottom CTA */}
        {productCount > 0 && (
          <div className="mt-16 sm:mt-20 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-white shadow-lg overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-blue-500/30 rounded-full blur-xl"></div>
              <div className="absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-indigo-500/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Can't find what you're looking for?</h3>
                <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg">
                  We have many more options available. Explore all our activities or get in touch with us for assistance.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-4 border border-transparent text-sm sm:text-base font-bold rounded-lg shadow-lg bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transform transition-all duration-300"
                >
                  Contact Us
                  <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add some custom animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes subtleZoom {
          from {
            transform: scale(1.15);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-delay-200 {
          animation-delay: 200ms;
        }
        
        .animate-delay-300 {
          animation-delay: 300ms;
        }
        
        .animate-subtle-zoom {
          animation: subtleZoom 15s ease-out forwards;
        }
      `}</style>
    </div>
  )
} 