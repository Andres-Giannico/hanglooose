'use client'

import { PortableText } from '@portabletext/react'
import type { Product } from '@/sanity/types'
import ProductGallery from '@/app/components/ProductGallery'
import BookingWidget from '@/app/components/BookingWidget'
import { urlFor } from '@/sanity/lib/image'

const BookingCard = ({ product, onCheckAvailabilityClick }: { product: Product, onCheckAvailabilityClick: () => void }) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 p-6 bg-white border rounded-lg shadow-lg">
        <div className="flex items-baseline mb-4">
          <span className="text-gray-500 mr-2 text-lg">From</span>
          <span className="text-3xl font-bold text-gray-900">€{product.price}</span>
        </div>
        {product.priceSubtitle && <p className="text-gray-600 mb-6">{product.priceSubtitle}</p>}
        <button
          onClick={onCheckAvailabilityClick}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Check availability
        </button>
        
        {product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
             <h3 className="text-lg font-semibold mb-3 text-gray-800">Booking Guarantees</h3>
             <ul className="space-y-3">
                {product.bookingGuarantees.map((item, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

const PaymentMethodsSection = ({ paymentMethods }: { paymentMethods: Product['paymentMethods'] }) => {
    if (!paymentMethods?.text && !paymentMethods?.logos) return null;

    return (
        <div className="p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
            {paymentMethods.text && <p className="text-gray-700 mb-4">{paymentMethods.text}</p>}
            {paymentMethods.logos && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                    src={urlFor(paymentMethods.logos).width(400).url()} 
                    alt="Payment method logos"
                    className="max-w-full h-auto"
                />
            )}
        </div>
    )
}


export default function ProductClientPage({ product }: { product: Product }) {
  const handleCheckAvailability = () => {
    document.getElementById('booking-widget-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {product.highlights.map((highlight: string, index: number) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            {product.fullDescription && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-3">Full description</h2>
                <PortableText value={product.fullDescription} />
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
                        {product.includes.map((item: string, index: number) => (
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
                        {product.notIncludes.map((item: string, index: number) => (
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
                <PortableText value={product.importantInformation} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <BookingCard product={product} onCheckAvailabilityClick={handleCheckAvailability} />
      </div>

      {/* Guarantees & Payment Methods */}
      {(product.paymentMethods) && (
        <div className="my-12 py-8 border-t">
             <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.paymentMethods && <PaymentMethodsSection paymentMethods={product.paymentMethods} />}
             </div>
        </div>
      )}

      {/* Booking Widget Section */}
      {product.bookingWidget?.enableWidget && product.bookingWidget.bookingProductId && (
        <div id="booking-widget-section" className="mt-12 pt-8 border-t">
          <h2 className="text-3xl font-bold text-center mb-8">Realizar Reserva</h2>
          <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl">
            <BookingWidget config={product.bookingWidget} />
          </div>
        </div>
      )}
    </div>
  )
} 