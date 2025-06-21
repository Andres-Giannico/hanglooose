'use client'

import { useEffect, useState } from 'react'

interface BookingWidgetProps {
  settings: {
    bookingProductId: number
    companyId?: number
    channelId?: number
    billingTermIds?: number[]
    groupByBillingTerm?: boolean
    displayBillingTerm?: boolean
    useLargeSlots?: boolean
    showQuantity?: boolean
    quantityLabel?: string
    bookNowLabel?: string
    confirmReservationAndPayLabel?: string
    payNowLabel?: string
    selectTimeLabel?: string
    selectExperienceLabel?: string
    addonsLabel?: string
    childrenAge?: string
    infantAge?: string
    depositObservation?: string
  }
}

export default function BookingWidget({ settings }: BookingWidgetProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Extraer todas las propiedades con valores por defecto
  const productId = settings.bookingProductId || 22
  const companyId = settings.companyId || 1
  const channelId = settings.channelId || 19
  
  // Construir la URL con todos los parámetros
  const buildWidgetUrl = () => {
    const params = new URLSearchParams()
    
    // Parámetros principales
    params.append('productId', productId.toString())
    params.append('companyId', companyId.toString())
    params.append('channelId', channelId.toString())
    
    // Billing Term IDs (si existen)
    if (settings.billingTermIds && settings.billingTermIds.length > 0) {
      params.append('billingTermIds', JSON.stringify(settings.billingTermIds))
    }
    
    // Propiedades booleanas
    if (settings.groupByBillingTerm) params.append('groupByBillingTerm', 'true')
    if (settings.displayBillingTerm) params.append('displayBillingTerm', 'true')
    if (settings.useLargeSlots) params.append('useLargeSlots', 'true')
    if (settings.showQuantity === false) params.append('showQuantity', 'false')
    
    // Textos personalizados
    if (settings.quantityLabel) params.append('quantityLabel', settings.quantityLabel)
    if (settings.bookNowLabel) params.append('bookNowLabel', settings.bookNowLabel)
    if (settings.confirmReservationAndPayLabel) params.append('confirmReservationAndPayLabel', settings.confirmReservationAndPayLabel)
    if (settings.payNowLabel) params.append('payNowLabel', settings.payNowLabel)
    if (settings.selectTimeLabel) params.append('selectTimeLabel', settings.selectTimeLabel)
    if (settings.selectExperienceLabel) params.append('selectExperienceLabel', settings.selectExperienceLabel)
    if (settings.addonsLabel) params.append('addonsLabel', settings.addonsLabel)
    if (settings.childrenAge) params.append('childrenAge', settings.childrenAge)
    if (settings.infantAge) params.append('infantAge', settings.infantAge)
    if (settings.depositObservation) params.append('depositObservation', settings.depositObservation)
    
    return `/booking-widget.html?${params.toString()}`
  }
  
  const widgetUrl = buildWidgetUrl()

  // Mostrar un mensaje de carga mientras el iframe se carga
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando calendario de reservas...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center p-8 max-w-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Widget no disponible</h3>
            <p className="mt-2 text-gray-600">No se pudo cargar el calendario de reservas.</p>
            <div className="mt-6">
              <a 
                href="#contact"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contactar para reservar
              </a>
            </div>
          </div>
        </div>
      )}
      
      <iframe
        src={widgetUrl}
        className="w-full min-h-[600px] border-0"
        title="Booking Widget"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        allow="fullscreen"
      />
    </div>
  )
}

declare global {
  interface Window {
    TurboBooking?: {
      new(): {
        run: (container: HTMLElement, options: any) => void
      }
    }
  }
} 