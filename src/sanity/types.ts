import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
    [key: string]: unknown; // Allow other properties like hotspot, crop etc.
}

// Type for the product cards shown on the homepage grid
export interface ProductCard {
    _id: string;
    name: string;
    slug: string;
    mainImage: SanityImage;
    price: number;
    priceSubtitle?: string;
}

// Type for the full product object on the detail page
export interface Product extends ProductCard {
    gallery?: SanityImage[];
    highlights?: string[];
    fullDescription?: PortableTextBlock[]; // Use specific Portable Text type
    includes?: string[];
    notIncludes?: string[];
    features?: { key: string; value: string }[];
    freeCancellation?: boolean;
    reserveNowPayLater?: boolean;
    instructorInfo?: string;
    isPrivateGroup?: boolean;
    importantInformation?: PortableTextBlock[]; // Use specific Portable Text type

    bookingWidget?: {
        enableWidget?: boolean;
        bookingProductId?: number;
        groupByBillingTerm?: boolean;
        displayBillingTerm?: boolean;
        useLargeSlots?: boolean;
        showQuantity?: boolean;
        quantityLabel?: string;
        bookNowLabel?: string;
    };
} 