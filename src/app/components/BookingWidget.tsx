'use client'

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import type { Product } from '@/sanity/types';

interface BookingWidgetProps {
    config: Product['bookingWidget'];
}

// Define the shape of the TurboBooking class if available on window
declare global {
    interface Window {
        TurboBooking: any;
    }
}

export default function BookingWidget({ config }: BookingWidgetProps) {
    const widgetContainerRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // This gets the unique part of the CSS file name (e.g., 1.0.31)
    const cssVersion = "1.0.31";
    const cssHref = `https://widgets.turbnb.com/turbnb.booking.${cssVersion}.min.css`;
    
    // This gets the unique part of the JS file name (e.g., 1.0.31)
    const jsVersion = "1.0.31";
    const jsSrc = `https://widgets.turbnb.com/turbnb.booking.${jsVersion}.min.js`;

    const initializeWidget = () => {
        if (hasInitialized.current || !widgetContainerRef.current || typeof window.TurboBooking === 'undefined' || !config?.bookingProductId) {
            return;
        }

        try {
            const el = widgetContainerRef.current;
            const turbo = new window.TurboBooking();

            // Build custom properties, providing fallbacks
            const customProperties: Record<string, any> = {
                "groupByBillingTerm": config.groupByBillingTerm ?? false,
                "displayBillingTerm": config.displayBillingTerm ?? false,
                "useLargeSlots": config.useLargeSlots ?? false,
                "showQuantity": config.showQuantity ?? true,
            };

            // Add text labels only if they are provided
            if (config.quantityLabel) customProperties.quantity = config.quantityLabel;
            if (config.bookNowLabel) customProperties.bookNow = config.bookNowLabel;

            turbo.run(el, {
                companyId: 1, // Assuming this is constant
                productId: config.bookingProductId,
                channelId: 2, // Assuming this is constant
                customProperties,
            });

            hasInitialized.current = true;
        } catch (error) {
            console.error("Failed to initialize TurboBooking widget:", error);
        }
    };

    return (
        <>
            <link href={cssHref} rel="stylesheet" />
            <Script
                src={jsSrc}
                strategy="lazyOnload"
                onLoad={initializeWidget}
                onError={(e) => console.error("Failed to load TurboBooking script:", e)}
            />
            <div ref={widgetContainerRef} id={`turbnb-booking-${config?.bookingProductId}`}></div>
        </>
    );
} 