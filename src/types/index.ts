import type { SanityImage } from '@/sanity/types'

export interface Feature {
  key: string
  value: string
}

export interface PaymentMethods {
  text?: string
  logos?: {
    asset: {
      url: string
    }
  }
}

export interface BookingWidget {
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

export interface Product {
  _id: string
  name: string
  slug: string
  mainImage: SanityImage
  gallery: SanityImage[]
  price: number
  showFromPrice?: boolean
  showOnHome?: boolean
  priceSubtitle?: string
  shortDescription?: string
  duration?: string
  rating?: number
  reviewCount?: number
  highlights?: string[]
  fullDescription?: any // Este any es necesario por el formato de Portable Text
  features?: Feature[]
  includes?: string[]
  notIncludes?: string[]
  importantInformation?: any // Este any es necesario por el formato de Portable Text
  bookingGuarantees?: string[]
  paymentMethods?: PaymentMethods
  bookingWidget?: BookingWidget
  category: {
    title: string
    slug: string
  }
  faqs?: Array<{
    question: string
    answer: string
  }>
}

export interface FooterLink {
  text: string
  url: string
}

export interface FooterSettings {
  title: string
  footerLogo?: SanityImage
  logo?: SanityImage
  footerTagline?: string
  contactEmail?: string
  contactPhoneNumber?: string
  contactPhoneNumberDisplay?: string
  address?: string
  footerQuickLinks?: {
    title: string
    links: FooterLink[]
  }
  footerLegalLinks?: {
    title: string
    links: FooterLink[]
  }
  footerSocialTitle?: string
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  footerCopyright?: string
  footerCredits?: string
}

export interface HomeFeature {
  title: string
  description: string
  icon?: string
}

export interface AboutFeature {
  title: string
  description: string
}

export interface HomeSettings {
  heroTitle: string
  heroSubtitle: string
  heroImage: SanityImage
  heroButtonText: string
  heroButtonLink: string
  
  aboutTitle: string
  aboutDescription: string
  aboutFeatures: AboutFeature[]
  
  featuresTitle: string
  features: HomeFeature[]
  
  featuredProductsTitle: string
  featuredProductsCount: number
  
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonLink: string
} 