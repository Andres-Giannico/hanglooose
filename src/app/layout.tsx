import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

const settingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  logo,
  footerLogo,
  footerTagline,
  contactEmail,
  contactPhoneNumber,
  contactPhoneNumberDisplay,
  whatsappNumber,
  whatsappDefaultMessage,
  whatsappButtonText,
  showWhatsAppButton,
  address,
  footerQuickLinks,
  footerLegalLinks,
  footerSocialTitle,
  socialLinks,
  footerCopyright,
  footerCredits
}`

export const metadata: Metadata = {
  title: {
    template: '%s | Hang Loose Ibiza',
    default: 'Hang Loose Ibiza'
  },
  description: 'Experience the best boat rentals and water activities in Ibiza'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await client.fetch(settingsQuery)

  return (
    <html lang="en" className="h-full bg-white light" style={{colorScheme: 'light'}}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} h-full flex flex-col bg-white`} style={{backgroundColor: '#ffffff'}}>
        <Header />
        <main className="flex-grow bg-white">
          {children}
        </main>
        <Footer settings={settings} />
        {settings.showWhatsAppButton !== false && settings.whatsappNumber && (
          <WhatsAppButton 
            phoneNumber={settings.whatsappNumber}
            defaultMessage={settings.whatsappDefaultMessage}
            buttonText={settings.whatsappButtonText}
            className="global-whatsapp-button"
          />
        )}
      </body>
    </html>
  )
}
