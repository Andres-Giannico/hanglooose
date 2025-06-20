'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import ProductGallery from '@/app/components/ProductGallery'
import BookingWidget from '@/app/components/BookingWidget'
import WhatsAppButton from '@/app/components/WhatsAppButton'
import FAQ from '@/app/components/FAQ'
import { urlForImage } from '@/sanity/image'
import type { Product } from '@/types'

interface Feature {
  key: string
  value: string
}

interface PaymentMethods {
  text?: string
  logos?: {
    asset: {
      url: string
    }
  }
}

interface BookingWidget {
  enableWidget: boolean
  bookingProductId: number
  billingTermIds?: number[]
  groupByBillingTerm?: boolean
  displayBillingTerm?: boolean
  useLargeSlots?: boolean
  showQuantity?: boolean
  quantityLabel?: string
  bookNowLabel?: string
}

interface ProductClientPageProps {
  product: Product
  whatsappSettings?: {
    whatsappNumber?: string
    whatsappDefaultMessage?: string
    whatsappButtonText?: string
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = urlForImage(value)?.url()
      return (
        <div className="my-6">
          <img
            src={imageUrl || ''}
            alt={value.alt || 'Product image'}
            className="rounded-lg"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-gray-500">{value.caption}</p>
          )}
        </div>
      )
    },
    htmlContent: ({ value }: { value: { code: string } }) => {
      return (
        <div 
          className="my-6"
          dangerouslySetInnerHTML={{ __html: value.code }} 
        />
      )
    }
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noopener noreferrer' : undefined
      const target = !value.href.startsWith('/') ? '_blank' : undefined
      return (
        <a href={value.href} rel={rel} target={target} className="text-blue-600 hover:underline">
          {children}
        </a>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
  },
}

function PaymentMethodsSection({ paymentMethods }: { paymentMethods: Product['paymentMethods'] }) {
  if (!paymentMethods?.text && !paymentMethods?.logos) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
      <p className="text-gray-600 mb-4">{paymentMethods.text}</p>
      {paymentMethods.logos?.asset && (
        <img
          src={paymentMethods.logos.asset.url}
          alt="Payment methods accepted"
          className="max-h-8"
        />
      )}
    </div>
  )
}

function BookingCard({ product, onCheckAvailabilityClick }: { product: Product, onCheckAvailabilityClick: () => void }) {
  return (
    <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">
            {product.showFromPrice && <span className="text-gray-500 font-normal mr-1">from</span>}
            €{product.price}
          </h2>
          {product.priceSubtitle && (
            <span className="text-sm text-gray-500">/ {product.priceSubtitle}</span>
          )}
        </div>
        {product.duration && (
          <p className="mt-1 text-sm text-gray-500">{product.duration}</p>
        )}
      </div>

      <button
        onClick={onCheckAvailabilityClick}
        className="mb-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Check Availability
      </button>

      {/* Booking Guarantees */}
      {product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Booking Guarantees</h3>
          <ul className="space-y-3">
            {product.bookingGuarantees.map((guarantee, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600">{guarantee}</span>
              </li>
            ))}
          </ul>

          {/* Payment Methods */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="flex flex-col items-center space-y-4">
              <span className="text-sm text-gray-600">Secure payment with</span>
              <Image 
                src="/payment-methods.png" 
                alt="Payment methods: Visa, Mastercard, American Express, Apple Pay, Google Pay, and Stripe" 
                width={300}
                height={50}
                className="h-16 w-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductClientPage({ product, whatsappSettings }: ProductClientPageProps) {
  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCheckAvailability = () => {
    const bookingSection = document.getElementById('booking-widget-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Ocultar el botón global de WhatsApp cuando estamos en la página de un producto
  useEffect(() => {
    // Agregar una clase al body para ocultar el botón global de WhatsApp
    document.body.classList.add('hide-global-whatsapp')
    
    return () => {
      // Eliminar la clase cuando se desmonte el componente
      document.body.classList.remove('hide-global-whatsapp')
    }
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Inicio
            </Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <Link href={`/categories/${product.category.slug}`} className="text-gray-500 hover:text-gray-700">
              {product.category.title}
            </Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <ProductGallery gallery={product.gallery} />
          <div className="mt-8 space-y-8">
            {product.highlights && (
              <div>
                <h2 className="text-2xl font-bold mb-3">Highlights</h2>
                <ul className="list-disc list-inside space-y-1">
                  {product.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.fullDescription && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-3">Full description</h2>
                <PortableText value={product.fullDescription} components={portableTextComponents} />
              </div>
            )}
            {(product.includes && product.includes.length > 0) || (product.notIncludes && product.notIncludes.length > 0) ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Price Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.includes && product.includes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-700">Included</h3>
                      <ul className="space-y-2">
                        {product.includes.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-3 text-green-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.notIncludes && product.notIncludes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-700">Not Included</h3>
                      <ul className="space-y-2">
                        {product.notIncludes.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-3 text-red-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {product.importantInformation && (
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                <h2 className="text-2xl font-bold mb-3">Important information</h2>
                <PortableText value={product.importantInformation} components={portableTextComponents} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <BookingCard product={product} onCheckAvailabilityClick={handleCheckAvailability} />
      </div>

      {/* Guarantees & Payment Methods */}
      {product.paymentMethods && (
        <div className="my-12 py-8 border-t">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <PaymentMethodsSection paymentMethods={product.paymentMethods} />
          </div>
        </div>
      )}

      {/* Booking Widget Section */}
      {product.bookingWidget?.enableWidget && product.bookingWidget.bookingProductId && (
        <div id="booking-widget-section" className="mt-12 pt-8 border-t">
          <h2 className="text-3xl font-bold text-center mb-8">Make a Reservation</h2>
          <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
            <BookingWidget settings={product.bookingWidget} />
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow">
              {product.faqs.map((faq, index) => (
                <FAQ 
                  key={`faq-${index}`} 
                  question={faq.question} 
                  answer={faq.answer} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botón de WhatsApp específico para el producto */}
      {whatsappSettings?.whatsappNumber && (
        <WhatsAppButton 
          phoneNumber={whatsappSettings.whatsappNumber}
          productName={product.name}
          defaultMessage={whatsappSettings.whatsappDefaultMessage}
          buttonText={whatsappSettings.whatsappButtonText}
        />
      )}
    </div>
  )
} 