'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'
import type { FooterSettings } from '@/types'

interface FooterLink {
    text: string
    url: string
}

interface FooterProps {
    settings: FooterSettings
}

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'whatsapp':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            )
        case 'tripadvisor':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.011 9.532c-.301-3.215-3.351-5.753-7.096-5.827h-.098c-1.885.048-3.182.367-4.817.993-1.612-.615-2.909-.945-4.794-.993h-.098c-3.733.074-6.795 2.612-7.096 5.827-.043.52-.047 1.166-.047 1.166s.068 2.126.23 3.017c.189 1.042.561 1.99 1.104 2.822.669 1.036 1.674 1.943 2.841 2.641 1.981 1.187 4.178 1.478 5.76 1.478.656 0 1.067-.047 1.067-.047s.417.047 1.067.047c1.582 0 3.779-.291 5.76-1.478 1.167-.698 2.172-1.605 2.841-2.641.543-.832.915-1.78 1.104-2.822.162-.891.23-3.017.23-3.017s-.004-.646-.052-1.166zM7.167 15.77c-2.295 0-4.158-1.856-4.158-4.143s1.863-4.143 4.158-4.143c2.295 0 4.158 1.856 4.158 4.143s-1.863 4.143-4.158 4.143zm9.666 0c-2.295 0-4.158-1.856-4.158-4.143s1.863-4.143 4.158-4.143c2.295 0 4.158 1.856 4.158 4.143s-1.863 4.143-4.158 4.143zm-9.666-6.537c-1.326 0-2.399 1.071-2.399 2.394s1.073 2.394 2.399 2.394c1.326 0 2.399-1.071 2.399-2.394s-1.073-2.394-2.399-2.394zm9.666 0c-1.326 0-2.399 1.071-2.399 2.394s1.073 2.394 2.399 2.394c1.326 0 2.399-1.071 2.399-2.394s-1.073-2.394-2.399-2.394z"/>
                </svg>
            )
        case 'instagram':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
            )
        case 'facebook':
            return (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
            )
        default:
            return null
    }
}

export default function Footer({ settings }: FooterProps) {
    const logo = settings.footerLogo || settings.logo
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-gradient-to-b from-[#0f172a] to-[#0c1222] text-gray-300">
            {/* Decorative element */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80"></div>
            <div className="absolute top-1 inset-x-0 h-[1px] bg-white/10"></div>
            
            {/* Main Footer */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="space-y-5">
                        {logo?.asset && (
                            <div className="inline-block bg-gradient-to-br from-white/15 to-white/5 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
                                <Image
                                    src={urlForImage(logo)?.width(100).height(100).url() || ''}
                                    alt={settings.title || 'Logo'}
                                    width={80}
                                    height={80}
                                    className="h-14 w-auto"
                                />
                            </div>
                        )}
                        <p className="text-sm text-gray-300/90">
                            {settings.footerTagline || 'Experience adventure and create lasting memories with our premium services.'}
                        </p>
                        <div className="space-y-3 pt-2">
                            {settings.contactEmail && (
                                <a href={`mailto:${settings.contactEmail}`} 
                                   className="flex items-center text-sm group hover:text-white transition-all duration-200">
                                    <span className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 mr-3 group-hover:bg-white/15 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        {settings.contactEmail}
                                    </span>
                                </a>
                            )}
                            {settings.contactPhoneNumber && (
                                <a href={`tel:${settings.contactPhoneNumber}`} 
                                   className="flex items-center text-sm group hover:text-white transition-all duration-200">
                                    <span className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 mr-3 group-hover:bg-white/15 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        {settings.contactPhoneNumberDisplay || settings.contactPhoneNumber}
                                    </span>
                                </a>
                            )}
                            {settings.address && (
                                <div className="flex items-start text-sm">
                                    <span className="flex items-center justify-center bg-white/10 rounded-full w-8 h-8 mr-3 flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    <span>{settings.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-5 border-b border-white/10 pb-2 inline-block">
                            {settings.footerQuickLinks?.title || 'Quick Links'}
                        </h3>
                        <ul className="space-y-3">
                            {settings.footerQuickLinks?.links?.map((link: FooterLink, index: number) => (
                                <li key={index}>
                                    <Link 
                                        href={link.url} 
                                        className="text-sm hover:text-white group flex items-center transition-all duration-200"
                                    >
                                        <svg className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.text}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-5 border-b border-white/10 pb-2 inline-block">
                            {settings.footerLegalLinks?.title || 'Legal'}
                        </h3>
                        <ul className="space-y-3">
                            {settings.footerLegalLinks?.links?.map((link: FooterLink, index: number) => (
                                <li key={index}>
                                    <Link 
                                        href={link.url} 
                                        className="text-sm hover:text-white group flex items-center transition-all duration-200"
                                    >
                                        <svg className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.text}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-5 border-b border-white/10 pb-2 inline-block">
                            {settings.footerSocialTitle || 'Connect With Us'}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {settings.socialLinks?.map((social: { platform: string; url: string }, index: number) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gradient-to-br from-white/15 to-white/5 p-3 rounded-full hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg"
                                    aria-label={`Follow us on ${social.platform}`}
                                >
                                    <SocialIcon platform={social.platform} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 bg-[#080e1a]/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <div className="text-sm">
                            © {currentYear} {settings.footerCopyright || settings.title || 'Company Name'}. All rights reserved.
                        </div>
                        {settings.footerCredits && (
                            <div className="text-sm flex items-center">
                                <span>Made with</span>
                                <span className="text-red-500 animate-pulse mx-1">❤️</span>
                                <span>by {settings.footerCredits}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
} 