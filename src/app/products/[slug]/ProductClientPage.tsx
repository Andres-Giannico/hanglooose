'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
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
      <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
      <p className="text-gray-600 mb-5 text-base">{paymentMethods.text}</p>
      {paymentMethods.logos?.asset && (
        <img
          src={paymentMethods.logos.asset.url}
          alt="Payment methods accepted"
          className="max-h-16 sm:max-h-20"
        />
      )}
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 text-gray-700 mt-0.5">
        {icon}
      </div>
      <div>
        <div className="text-base font-medium text-gray-900">{value}</div>
        {label && <div className="text-sm text-gray-600">{label}</div>}
      </div>
    </div>
  );
}

function EnhancedBookingCard({ 
  product, 
  onActionClick, 
  getButtonText 
}: { 
  product: Product, 
  onActionClick: () => void,
  getButtonText: () => string
}) {
  const hasDetailedInfo = product.productType || 
                          product.tripSummary || 
                          product.specificTime || 
                          product.departurePoint || 
                          product.capacity || 
                          product.season;

  // Determinar el título de la sección de detalles según el tipo de producto
  const getDetailsTitle = () => {
    if (!product.productType) return "About this activity";
    
    switch(product.productType) {
      case 'boatTrip':
        return "About this trip";
      case 'rental':
        return "About this rental";
      case 'tour':
        return "About this tour";
      case 'activity':
        return "About this activity";
      case 'experience':
        return "About this experience";
      case 'transfer':
        return "About this transfer";
      default:
        return "About this activity";
    }
  };
  
  // Simple card when no detailed info is available
  if (!hasDetailedInfo) {
    return (
      <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm overflow-hidden">
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
          onClick={onActionClick}
          className="mb-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {getButtonText()}
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
                <span className="text-base text-gray-600">Secure payment with</span>
                <Image 
                  src="/payment-methods.png" 
                  alt="Payment methods: Visa, Mastercard, American Express, Apple Pay, Google Pay, and Stripe" 
                  width={400}
                  height={80}
                  className="h-20 w-auto sm:h-24"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-24 rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Header card with price */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {product.showFromPrice && <span className="text-gray-500 font-normal mr-1">from</span>}
            €{product.price}
          </h2>
          <div className="text-right">
            {product.priceSubtitle && (
              <span className="text-sm text-gray-500">/ {product.priceSubtitle}</span>
            )}
          </div>
        </div>
        {product.duration && product.specificTime && (
          <p className="mt-1 text-sm text-gray-600">
            {product.duration} ({product.specificTime})
          </p>
        )}
        {product.duration && !product.specificTime && (
          <p className="mt-1 text-sm text-gray-600">{product.duration}</p>
        )}
      </div>

      <div className="p-6">
        {(product.childrenPrice || product.childrenPrice === 0) && product.childrenAgeRange ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500 mb-1">Adults</p>
                <p className="text-xl font-bold">€{product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Children ({product.childrenAgeRange})</p>
                <p className="text-xl font-bold">€{product.childrenPrice}</p>
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={onActionClick}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 mb-6 text-center font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {getButtonText()}
        </button>

        {product.limitedAvailability && (
          <p className="text-center text-sm text-gray-500 mb-6">{product.limitedAvailability}</p>
        )}
      </div>

      {/* Product details section - nuevo estilo elegante y limpio */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-6">{getDetailsTitle()}</h3>

        <div className="space-y-6">
          {product.freeCancellation && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              label="Cancel up to 24 hours in advance for a full refund"
              value="Free cancellation"
            />
          )}
          
          {product.reserveNowPayLater && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>}
              label="Keep your travel plans flexible — book your spot and pay nothing today."
              value="Reserve now & pay later"
            />
          )}

          {product.duration && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              label={product.specificTime ? "Check availability to see starting times" : ""}
              value={`Duration ${product.duration}`}
            />
          )}
          
          {product.departurePoint && (
            <DetailItem
              icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>}
              label="Departure"
              value={product.departurePoint}
            />
          )}

          {product.tripSummary && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>}
              label=""
              value={product.tripSummary}
            />
          )}

          {product.capacity && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>}
              label="Capacity"
              value={product.capacity}
            />
          )}

          {product.season && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>}
              label="Season"
              value={product.season}
            />
          )}
          
          {product.instructorInfo && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>}
              label="Instructor"
              value={product.instructorInfo}
            />
          )}

          {product.isPrivateGroup && (
            <DetailItem
              icon={<svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>}
              label=""
              value="Private group"
            />
          )}

          {product.customDetails && product.customDetails.map((detail, index) => (
            <DetailItem
              key={`custom-detail-${index}`}
              icon={detail.icon ? (
                <div dangerouslySetInnerHTML={{ __html: detail.icon }} />
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              )}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      </div>

      {/* Booking guarantees */}
      {!hasDetailedInfo && product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <h4 className="font-semibold mb-3">Booking Guarantees</h4>
          <ul className="space-y-2">
            {product.bookingGuarantees.map((guarantee, index) => (
              <li key={index} className="flex items-start text-sm">
                <svg className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">{guarantee}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Payment section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <p className="text-center text-base text-gray-600 mb-5">Secure payment with</p>
        <div className="flex justify-center">
          <Image 
            src="/payment-methods.png" 
            alt="Payment methods: Visa, Mastercard, American Express, Apple Pay, Google Pay, and Stripe" 
            width={400}
            height={80}
            className="h-20 w-auto sm:h-24"
            priority
          />
        </div>
      </div>
    </div>
  );
}

// Nuevo componente Collapsible para secciones desplegables en móvil
function Collapsible({ title, children, initiallyOpen = false, className = "" }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-medium text-gray-900"
      >
        <h2 className="text-xl font-bold">{title}</h2>
        <svg
          className={`h-6 w-6 transform text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

export default function ProductClientPage({ product, whatsappSettings }: ProductClientPageProps) {
  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Combinar la imagen principal con la galería si existe
  const combinedGallery = product.mainImage 
    ? [product.mainImage, ...(product.gallery || [])]
    : product.gallery || [];

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

  const hasDetailedInfo = product.productType || 
                         product.tripSummary || 
                         product.specificTime || 
                         product.departurePoint || 
                         product.capacity || 
                         product.season;

  // Determinar el título de la sección de detalles según el tipo de producto
  const getDetailsTitle = () => {
    if (!product.productType) return "About this activity";
    
    switch(product.productType) {
      case 'boatTrip':
        return "About this trip";
      case 'rental':
        return "About this rental";
      case 'tour':
        return "About this tour";
      case 'activity':
        return "About this activity";
      case 'experience':
        return "About this experience";
      case 'transfer':
        return "About this transfer";
      default:
        return "About this activity";
    }
  };

  // Función centralizada para obtener el texto del botón
  const getButtonText = () => {
    // Determinar el texto adecuado para el botón según el tipo de producto
    let buttonText = "Check Availability"; // Texto predeterminado

    // Si hay un texto personalizado definido en el CMS, usarlo
    if (product.bookButtonText) {
      buttonText = product.bookButtonText;
    }
    // Si no hay texto personalizado, usar uno predeterminado según el tipo de producto
    else if (product.productType) {
      switch (product.productType) {
        case 'boatTrip':
          buttonText = 'Book This Trip';
          break;
        case 'activity':
          buttonText = 'Book Activity';
          break;
        case 'tour':
          buttonText = 'Book This Tour';
          break;
        case 'rental':
          buttonText = 'Book Rental';
          break;
        case 'experience':
          buttonText = 'Book Experience';
          break;
        case 'transfer':
          buttonText = 'Book Transfer';
          break;
        default:
          buttonText = 'Book Now';
      }
    }

    // Si hay widget de reserva habilitado, usar el texto del widget
    if (product.bookingWidget?.enableWidget && product.bookingWidget.bookNowLabel) {
      buttonText = product.bookingWidget.bookNowLabel;
    }
    
    return buttonText;
  };

  const renderBookingButton = (className = "") => {
    return (
      <button
        onClick={handleCheckAvailability}
        className={`w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 ${className}`}
      >
        {getButtonText()}
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-4 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Inicio
            </Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <Link href={`/categories/${product.category.slug}`} className="text-sm text-gray-500 hover:text-gray-700">
              {product.category.title}
            </Link>
          </li>
          <li>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-sm text-gray-900">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{product.name}</h1>
        {product.shortDescription && (
          <p className="mt-2 text-gray-600 text-lg">{product.shortDescription}</p>
        )}
      </div>

      {/* Product card for mobile */}
      <div className="block sm:hidden mb-8">
        {!hasDetailedInfo ? (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {product.showFromPrice && <span className="text-gray-500 font-normal mr-1">from</span>}
                  €{product.price}
                </h2>
                {product.priceSubtitle && (
                  <span className="text-sm text-gray-500">/ {product.priceSubtitle}</span>
                )}
              </div>
              {product.duration && (
                <p className="mb-4 text-sm text-gray-500">{product.duration}</p>
              )}

              {renderBookingButton("mb-4")}
            </div>

            {/* Booking Guarantees Mini */}
            {!hasDetailedInfo && product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
              <div className="p-4 pt-0">
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.bookingGuarantees.slice(0, 3).map((guarantee, index) => (
                    <span key={index} className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {guarantee}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {/* Header price section */}
            <div className="p-4 bg-white border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {product.showFromPrice && <span className="text-gray-500 font-normal mr-1">from</span>}
                  €{product.price}
                </h2>
                {product.duration && (
                  <p className="text-sm text-gray-600">{product.duration}</p>
                )}
              </div>
              
              {(product.childrenPrice || product.childrenPrice === 0) && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Children {product.childrenAgeRange && `(${product.childrenAgeRange})`}</p>
                  <p className="text-base font-bold">€{product.childrenPrice}</p>
                </div>
              )}
            </div>
            
            {/* Booking button */}
            <div className="p-4">
              {renderBookingButton()}
              
              {product.limitedAvailability && (
                <p className="text-center text-xs text-gray-500 mt-2">{product.limitedAvailability}</p>
              )}
            </div>

            {/* About this activity/product */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="font-bold text-lg mb-4">{getDetailsTitle()}</h3>

              <div className="space-y-4">
                {product.freeCancellation && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Free cancellation</div>
                      <div className="text-xs text-gray-500">Cancel up to 24 hours in advance for a full refund</div>
                    </div>
                  </div>
                )}
                
                {product.reserveNowPayLater && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Reserve now & pay later</div>
                      <div className="text-xs text-gray-500">Keep your travel plans flexible</div>
                    </div>
                  </div>
                )}

                {product.departurePoint && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{product.departurePoint}</div>
                      <div className="text-xs text-gray-500">Departure</div>
                    </div>
                  </div>
                )}

                {product.specificTime && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{product.specificTime}</div>
                      <div className="text-xs text-gray-500">Time</div>
                    </div>
                  </div>
                )}

                {product.capacity && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{product.capacity}</div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                  </div>
                )}

                {product.season && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{product.season}</div>
                      <div className="text-xs text-gray-500">Season</div>
                    </div>
                  </div>
                )}
                
                {product.instructorInfo && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">{product.instructorInfo}</div>
                      <div className="text-xs text-gray-500">Instructor</div>
                    </div>
                  </div>
                )}

                {product.isPrivateGroup && (
                  <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 mt-0.5 text-gray-700" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium">Private group</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <ProductGallery gallery={combinedGallery} />
          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
            {/* Versión móvil: Secciones colapsables */}
            <div className="block sm:hidden">
              {product.highlights && (
                <Collapsible title="Highlights" initiallyOpen={true}>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-700">
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </Collapsible>
              )}
              
              {product.fullDescription && (
                <Collapsible title="Full description">
                  <div className="prose max-w-none text-sm sm:text-base">
                    <PortableText value={product.fullDescription} components={portableTextComponents} />
                  </div>
                </Collapsible>
              )}
              
              {(product.includes && product.includes.length > 0) || (product.notIncludes && product.notIncludes.length > 0) ? (
                <Collapsible title="Price Details">
                  <div className="grid grid-cols-1 gap-4">
                    {product.includes && product.includes.length > 0 && (
                      <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                        <h3 className="text-base font-semibold mb-2 text-green-700">Included</h3>
                        <ul className="space-y-2">
                          {product.includes.map((item, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.notIncludes && product.notIncludes.length > 0 && (
                      <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                        <h3 className="text-base font-semibold mb-2 text-red-700">Not Included</h3>
                        <ul className="space-y-2">
                          {product.notIncludes.map((item, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2 text-red-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Collapsible>
              ) : null}
              
              {product.importantInformation && (
                <Collapsible title="Important information">
                  <div className="prose max-w-none text-sm">
                    <PortableText value={product.importantInformation} components={portableTextComponents} />
                  </div>
                </Collapsible>
              )}
            </div>

            {/* Versión desktop: Secciones expandidas */}
            <div className="hidden sm:block">
              {product.highlights && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Highlights</h2>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-700">
                    {product.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
              {product.fullDescription && (
                <div className="prose max-w-none text-sm sm:text-base">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Full description</h2>
                  <PortableText value={product.fullDescription} components={portableTextComponents} />
                </div>
              )}
              {(product.includes && product.includes.length > 0) || (product.notIncludes && product.notIncludes.length > 0) ? (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Price Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {product.includes && product.includes.length > 0 && (
                      <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-green-700">Included</h3>
                        <ul className="space-y-2">
                          {product.includes.map((item, index) => (
                            <li key={index} className="flex items-center text-sm sm:text-base text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.notIncludes && product.notIncludes.length > 0 && (
                      <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-red-700">Not Included</h3>
                        <ul className="space-y-2">
                          {product.notIncludes.map((item, index) => (
                            <li key={index} className="flex items-center text-sm sm:text-base text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-500 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
                <div className="prose max-w-none bg-gray-50 p-4 rounded-lg text-sm sm:text-base">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Important information</h2>
                  <PortableText value={product.importantInformation} components={portableTextComponents} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Hidden on mobile since we show at top */}
        <div className="hidden sm:block">
          <EnhancedBookingCard product={product} onActionClick={handleCheckAvailability} getButtonText={getButtonText} />
        </div>
      </div>

      {/* Guarantees & Payment Methods */}
      {product.paymentMethods && (
        <div className="my-8 sm:my-12 py-6 sm:py-8 border-t">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <PaymentMethodsSection paymentMethods={product.paymentMethods} />
          </div>
        </div>
      )}

      {/* Booking Widget Section */}
      {product.bookingWidget?.enableWidget && product.bookingWidget.bookingProductId && (
        <div id="booking-widget-section" className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Make a Reservation</h2>
          <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 border border-gray-200 rounded-xl">
            <BookingWidget settings={product.bookingWidget} />
          </div>
          
          {/* Booking guarantees - mostrados abajo cuando hay card info detallada */}
          {hasDetailedInfo && product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
            <div className="max-w-4xl mx-auto mt-6 bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold mb-3 text-center">Booking Guarantees</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {product.bookingGuarantees.map((guarantee, index) => (
                  <div key={index} className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm">
                    <svg className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Booking Guarantees - mostrados después del widget de reserva en móvil cuando hay card info detallada */}
      {hasDetailedInfo && !product.bookingWidget?.enableWidget && product.bookingGuarantees && product.bookingGuarantees.length > 0 && (
        <div className="block sm:hidden mt-8 pt-6 border-t">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h4 className="font-semibold mb-3 text-center">Booking Guarantees</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {product.bookingGuarantees.map((guarantee, index) => (
                <div key={index} className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                  <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {guarantee}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="mt-10 sm:mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8">Frequently Asked Questions</h2>
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

      {/* Botón flotante para móvil */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden">
        <button
          onClick={handleCheckAvailability}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 flex items-center justify-center"
        >
          <span>{getButtonText()}</span>
          <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
} 