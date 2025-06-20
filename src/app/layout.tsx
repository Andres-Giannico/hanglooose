import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

const inter = Inter({ subsets: ['latin'] })

const settingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  logo,
  footerLogo,
  footerTagline,
  contactEmail,
  contactPhoneNumber,
  contactPhoneNumberDisplay,
  address,
  footerQuickLinks,
  footerLegalLinks,
  footerSocialTitle,
  socialLinks,
  footerCopyright,
  footerCredits
}`

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await client.fetch(settingsQuery)

  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
