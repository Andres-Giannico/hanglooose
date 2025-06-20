'use client'

import { useEffect, useRef } from 'react'

interface BookingWidgetProps {
  settings: {
    bookingProductId: number
    billingTermIds?: number[]
    groupByBillingTerm?: boolean
    displayBillingTerm?: boolean
    useLargeSlots?: boolean
    showQuantity?: boolean
    quantityLabel?: string
    bookNowLabel?: string
  }
}

export default function BookingWidget({ settings }: BookingWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isScriptLoaded = useRef(false)

  useEffect(() => {
    if (!containerRef.current || isScriptLoaded.current) return

    // Cargar CSS primero
    const cssLink = document.createElement('link')
    cssLink.href = 'https://widgets.turbnb.com/turbnb.booking.1.0.31.min.css'
    cssLink.rel = 'stylesheet'
    document.head.appendChild(cssLink)

    // Cargar el script de Turbobooking
    const script = document.createElement('script')
    script.src = 'https://widgets.turbnb.com/turbnb.booking.1.0.31.min.js'
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.TurboBooking) {
        const turbo = new window.TurboBooking()
        turbo.run(containerRef.current, {
          companyId: 1,
          productId: settings.bookingProductId,
          channelId: 2,
          billingTermIds: settings.billingTermIds,
          customProperties: {
            groupByBillingTerm: settings.groupByBillingTerm ?? false,
            displayBillingTerm: settings.displayBillingTerm ?? false,
            useLargeSlots: settings.useLargeSlots ?? false,
            showQuantity: settings.showQuantity ?? true,
            preventAutoScroll: true,
            disableScrolling: true,
            quantity: settings.quantityLabel,
            bookNow: settings.bookNowLabel,
          },
        })
      }
    }

    document.body.appendChild(script)
    isScriptLoaded.current = true

    return () => {
      if (cssLink.parentNode) {
        cssLink.parentNode.removeChild(cssLink)
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      isScriptLoaded.current = false
    }
  }, [settings])

  return (
    <div 
      ref={containerRef} 
      id={`turbnb-booking-${settings.bookingProductId}`}
      className="w-full min-h-[400px]"
    />
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