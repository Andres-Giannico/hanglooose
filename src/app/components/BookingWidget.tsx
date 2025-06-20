'use client'

import { useRef, useState } from 'react'
import Script from 'next/script'
import type { Product } from '@/sanity/types'

interface BookingWidgetProps {
    config: Product['bookingWidget']
}

// Define the shape of the TurboBooking class if available on window
declare global {
    interface Window {
        TurboBooking: new () => {
            run: (container: HTMLElement, options: Record<string, unknown>) => void
        }
        userInitiatedScroll?: boolean
        loadBookingWidget?: () => void
    }
}

export default function BookingWidget({ config }: BookingWidgetProps) {
    const widgetContainerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // This gets the unique part of the CSS file name (e.g., 1.0.31)
    const cssVersion = "1.0.31"
    const cssHref = `https://widgets.turbnb.com/turbnb.booking.${cssVersion}.min.css`
    
    // This gets the unique part of the JS file name (e.g., 1.0.31)
    const jsVersion = "1.0.31"
    const jsSrc = `https://widgets.turbnb.com/turbnb.booking.${jsVersion}.min.js`

    const initializeWidget = () => {
        if (!widgetContainerRef.current || !config?.bookingProductId) {
            return
        }

        try {
            const el = widgetContainerRef.current
            const turbo = new window.TurboBooking()

            const customProperties: Record<string, string | boolean> = {
                groupByBillingTerm: config.groupByBillingTerm ?? false,
                displayBillingTerm: config.displayBillingTerm ?? false,
                useLargeSlots: config.useLargeSlots ?? false,
                showQuantity: config.showQuantity ?? true,
                preventAutoScroll: true,
                disableScrolling: true,
            }

            if (config.quantityLabel) customProperties.quantity = config.quantityLabel
            if (config.bookNowLabel) customProperties.bookNow = config.bookNowLabel

            turbo.run(el, {
                companyId: 1,
                productId: config.bookingProductId,
                channelId: 2,
                billingTermIds: config.billingTermIds,
                customProperties,
            })

            setIsLoading(false)
            setError(null)
        } catch (error) {
            console.error("Failed to initialize TurboBooking widget:", error)
            setError('Failed to load booking widget. Please try refreshing the page.')
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-[400px]">
            <link 
                href={cssHref} 
                rel="stylesheet" 
            />
            <Script
                src={jsSrc}
                strategy="afterInteractive"
                onLoad={initializeWidget}
                onError={(e) => {
                    console.error("Failed to load TurboBooking script:", e)
                    setError('Failed to load booking widget. Please try refreshing the page.')
                    setIsLoading(false)
                }}
            />
            
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        <p className="text-gray-600">Loading booking widget...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
                    <div className="flex flex-col items-center space-y-4 px-4 text-center">
                        <div className="rounded-full bg-red-100 p-3">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )}

            <div 
                ref={widgetContainerRef} 
                id={`turbnb-booking-${config?.bookingProductId}`}
                className={`transition-opacity duration-300 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
                style={{ minHeight: '400px' }}
            />
        </div>
    )
} 