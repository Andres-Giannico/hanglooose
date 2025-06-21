import type { SanityImage } from '@/sanity/types'

export interface Feature {
  key: string
  value: string
}

export interface PaymentMethods {
  text?: string
  logos?: SanityImage
}

export interface BookingWidget {
  enableWidget: boolean
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
}

export interface CustomDetail {
  icon?: string
  label?: string
  value: string
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
  // Campos adicionales
  productType?: string
  bookButtonText?: string
  tripSummary?: string
  specificTime?: string
  departurePoint?: string
  capacity?: string
  season?: string
  limitedAvailability?: string
  customDetails?: CustomDetail[]
  childrenPrice?: number
  childrenAgeRange?: string
  freeCancellation?: boolean
  reserveNowPayLater?: boolean
  instructorInfo?: string
  isPrivateGroup?: boolean
  isBestSeller?: boolean
  isLikelyToSellOut?: boolean
  productLabels?: ProductLabel[]
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
  whatsappNumber?: string
  whatsappDefaultMessage?: string
  whatsappButtonText?: string
  showWhatsAppButton?: boolean
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

export interface BookingWidgetSettings {
  enableWidget: boolean
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

export interface ProductLabel {
  text: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange'
  icon: 'star' | 'fire' | 'lightning' | 'alert' | 'heart' | 'check' | 'clock' | 'trend' | 'none'
} 