"use client"

import Link from 'next/link'
import Image from 'next/image'
import {client} from '@/sanity/client'
import {groq} from 'next-sanity'
import {urlForImage, SanityImage} from '@/sanity/image'
import type { SVGProps } from 'react';
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import SearchBar from './SearchBar'

// Types
interface SocialLink {
  _key: string;
  platform: string;
  url: string;
}

interface SiteSettings {
  title: string
  logo?: SanityImage
  contactPhoneNumber?: string
  contactPhoneNumberDisplay?: string
  contactButtonText?: string
  contactButtonLink?: string
  socialLinks?: SocialLink[]
}

interface SubMenuItem {
  _key: string;
  text: string;
  linkType?: string;
  categoryLink?: {
    slug: {
      current: string;
    };
    title: string;
  };
  productLink?: {
    slug: {
      current: string;
    };
    name: string;
  };
  externalUrl?: string;
  internalPage?: string;
  icon?: string;
}

interface MenuItem {
  _key: string;
  text: string;
  link?: {
    slug: {
      current: string;
    };
    title: string;
  };
  submenuType?: string;
  submenuColumns?: number;
  featuredImage?: SanityImage;
  submenu?: SubMenuItem[];
  productsFilter?: {
    category?: {
      _id: string;
      title: string;
    };
    limit?: number;
  };
}

interface NavigationData {
  items?: MenuItem[];
}

// Queries
const settingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  logo,
  contactPhoneNumber,
  contactPhoneNumberDisplay,
  contactButtonText,
  contactButtonLink,
  socialLinks[]{_key, platform, url}
}`

const menuQuery = groq`*[_type == "navigationMenu" && _id == "main-menu"][0]{
  items[]{
    _key,
    text,
    submenuType,
    submenuColumns,
    featuredImage,
    link->{
      title,
      slug
    },
    submenu[]{
      _key,
      text,
      linkType,
      icon,
      categoryLink->{
        title,
        slug
      },
      productLink->{
        name,
        slug
      },
      externalUrl,
      internalPage
    },
    productsFilter{
      category->{
        _id,
        title
      },
      limit
    }
  }
}`

// Icon Component
const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

// HOOKS
function useHeaderData() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [menu, setMenu] = useState<NavigationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [settingsData, menuData] = await Promise.all([
          client.fetch(settingsQuery),
          client.fetch(menuQuery)
        ]);
        setSettings(settingsData);
        setMenu(menuData);
      } catch (error) {
        console.error('Failed to fetch header data:', error);
      } finally {
        setLoading(false)
      }
    };
    fetchHeaderData();
  }, []);

  return { settings, menu, loading }
}

// SUB-COMPONENTS
const DesktopNavItem = ({ item }: { item: MenuItem }) => {
  const hasSubmenu = item.submenuType !== 'none' && item.submenuType !== undefined;
  const hasLink = item.link?.slug;

  // Helper function to get the correct URL for a submenu item
  const getSubmenuItemUrl = (subItem: SubMenuItem) => {
    if (subItem.linkType === 'category' && subItem.categoryLink?.slug) {
      return `/categories/${subItem.categoryLink.slug.current}`;
    } else if (subItem.linkType === 'product' && subItem.productLink?.slug) {
      return `/products/${subItem.productLink.slug.current}`;
    } else if (subItem.linkType === 'external' && subItem.externalUrl) {
      return subItem.externalUrl;
    } else if (subItem.linkType === 'internal' && subItem.internalPage) {
      return subItem.internalPage;
    }
    return '#';
  };

  if (hasSubmenu) {
    const columns = item.submenuColumns || 1;
    
    return (
      <HeadlessMenu as="div" className="relative inline-block text-left">
        <HeadlessMenu.Button className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-300 rounded-lg hover:text-blue-600 group">
          <span className="relative">
            {item.text}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </span>
          <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
        </HeadlessMenu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <HeadlessMenu.Items className={`absolute right-0 z-10 mt-1 ${columns === 3 ? 'w-96' : columns === 2 ? 'w-80' : 'w-64'} origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none`}>
            <div className="p-3">
              {/* Top bar with link to main category if available */}
              {hasLink && (
                <div className="border-b border-gray-100 pb-2 mb-2">
                  <HeadlessMenu.Item>
                    {({ active }) => (
                      <Link
                        href={`/categories/${item.link?.slug?.current}`}
                        className={`${
                          active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        } flex items-center px-3 py-1.5 text-sm font-medium group rounded-lg`}
                      >
                        <span className="flex-1">All {item.text}</span>
                        <span className={`${active ? 'opacity-100' : 'opacity-0'} transform transition-all duration-300 text-blue-600`}>
                          →
                        </span>
                      </Link>
                    )}
                  </HeadlessMenu.Item>
                </div>
              )}

              {/* Grid for submenu items */}
              <div className={columns === 3 ? 'grid grid-cols-3 gap-4' : columns === 2 ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4'}>
                {/* Custom menu items from Sanity */}
                {item.submenuType === 'custom' && item.submenu && item.submenu.length > 0 && (
                  <>
                    {item.submenu.map((subItem) => (
                      <HeadlessMenu.Item key={subItem._key}>
                        {({ active }) => (
                          <Link
                            href={getSubmenuItemUrl(subItem)}
                            target={subItem.linkType === 'external' ? '_blank' : undefined}
                            rel={subItem.linkType === 'external' ? 'noopener noreferrer' : undefined}
                            className={`${
                              active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            } flex items-center px-4 py-2 text-sm group rounded-lg`}
                          >
                            {subItem.icon && (
                              <span className="mr-3 text-gray-400">
                                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  {/* This is a placeholder - in a real app you'd use proper icon mapping */}
                                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </span>
                            )}
                            <span className="flex-1">{subItem.text}</span>
                            <span className={`${active ? 'opacity-100' : 'opacity-0'} transform transition-all duration-300 text-blue-600`}>
                              →
                            </span>
                          </Link>
                        )}
                      </HeadlessMenu.Item>
                    ))}
                  </>
                )}

                {/* Featured image if available */}
                {item.featuredImage?.asset && columns > 1 && (
                  <div className={columns === 3 ? 'col-span-1' : 'col-span-1'}>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                      <Image 
                        src={urlForImage(item.featuredImage)?.width(300).height(200).url() || ''}
                        alt={item.text}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </HeadlessMenu.Items>
        </Transition>
      </HeadlessMenu>
    );
  }

  if (hasLink) {
    return (
      <Link
        href={`/categories/${item.link?.slug?.current}`}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600 group relative"
      >
        <span className="relative">
          {item.text}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
        </span>
      </Link>
    );
  }
  
  return (
    <span className="px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg">
      {item.text}
    </span>
  );
}

const MobileMenu = ({ open, setOpen, menu, settings }: { open: boolean, setOpen: (open: boolean) => void, menu: NavigationData | null, settings: SiteSettings | null }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  // Helper function to get the correct URL for a submenu item
  const getSubmenuItemUrl = (subItem: SubMenuItem) => {
    if (subItem.linkType === 'category' && subItem.categoryLink?.slug) {
      return `/categories/${subItem.categoryLink.slug.current}`;
    } else if (subItem.linkType === 'product' && subItem.productLink?.slug) {
      return `/products/${subItem.productLink.slug.current}`;
    } else if (subItem.linkType === 'external' && subItem.externalUrl) {
      return subItem.externalUrl;
    } else if (subItem.linkType === 'internal' && subItem.internalPage) {
      return subItem.internalPage;
    }
    return '#';
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-end">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative w-full max-w-xs bg-white shadow-2xl flex flex-col overflow-y-auto min-h-full">
              <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-gray-100">
                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setOpen(false)}>
                  <span className="sr-only">{settings?.title || 'Hang Loose Ibiza'}</span>
                  {settings?.logo?.asset ? (
                    <div className="h-10 w-auto">
                      <Image
                        src={urlForImage(settings.logo)?.width(200).url() || ''}
                        alt={settings.title || 'Logo'}
                        width={100}
                        height={40}
                        className="h-full w-full object-contain"
                        priority
                      />
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      {settings?.title || 'Brand'}
                    </span>
                  )}
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 px-4 py-6 space-y-2">
                {menu?.items?.map((item) => (
                  <div key={item._key}>
                    {item.submenuType !== 'none' && item.submenuType ? (
                      <div>
                        <button
                          onClick={() => setActiveSubmenu(activeSubmenu === item._key ? null : item._key)}
                          className="flex w-full items-center justify-between rounded-lg py-3 px-3 text-base font-semibold text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <span>{item.text}</span>
                          <ChevronDownIcon
                            className={`h-5 w-5 flex-none transition-transform duration-200 ${
                              activeSubmenu === item._key ? 'rotate-180 text-blue-600' : 'text-gray-500'
                            }`}
                          />
                        </button>
                        <div
                          className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                            activeSubmenu === item._key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          {item.link?.slug && (
                            <Link
                              href={`/categories/${item.link.slug.current}`}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg py-2 pl-8 pr-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              All {item.text}
                            </Link>
                          )}
                          
                          {item.submenuType === 'custom' && item.submenu?.map((subItem) => (
                            <Link
                              key={subItem._key}
                              href={getSubmenuItemUrl(subItem)}
                              target={subItem.linkType === 'external' ? '_blank' : undefined}
                              rel={subItem.linkType === 'external' ? 'noopener noreferrer' : undefined}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg py-2 pl-8 pr-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {subItem.text}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      item.link?.slug && (
                        <Link
                          href={`/categories/${item.link.slug.current}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-3 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {item.text}
                        </Link>
                      )
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="mb-4">
                  <SearchBar />
                </div>
                {settings?.contactPhoneNumber && (
                  <a
                    href={`tel:${settings.contactPhoneNumber}`}
                    className="flex w-full items-center justify-center gap-x-2 rounded-lg bg-blue-600 px-3.5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-all hover:shadow-md"
                  >
                    <PhoneIcon className="h-5 w-5 flex-shrink-0" />
                    <span>{settings.contactPhoneNumberDisplay || settings.contactPhoneNumber}</span>
                  </a>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

// MAIN COMPONENT
export default function Header() {
  const { settings, menu, loading } = useHeaderData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Track scroll position for enhanced header effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  if (loading) {
    return <header className="h-16 bg-white border-b border-gray-200" />
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <Link href="/" className="block" aria-label="Home">
                {settings?.logo?.asset ? (
                  <div className="h-12 w-auto">
                    <Image
                      src={urlForImage(settings.logo)?.width(120).height(120).url() || ''}
                      alt={settings.title || 'Logo'}
                      width={120}
                      height={120}
                      className="h-full w-auto object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    {settings?.title || 'Brand'}
                  </span>
                )}
              </Link>
            </div>

            {/* Navigation section */}
            <div className="hidden lg:flex lg:items-center lg:flex-grow justify-center">
              <nav className="flex gap-x-1" aria-label="Main navigation">
                {menu?.items?.map((item) => (
                  <DesktopNavItem key={item._key} item={item} />
                ))}
              </nav>
            </div>

            {/* Right section - Search & Contact */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-3">
              <div className="relative">
                <SearchBar compact={true} />
              </div>
              
              {settings?.contactPhoneNumber && (
                <a
                  href={`tel:${settings.contactPhoneNumber}`}
                  className="flex items-center gap-x-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-md ml-2"
                >
                  <PhoneIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{settings.contactPhoneNumberDisplay || settings.contactPhoneNumber}</span>
                </a>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
        menu={menu}
        settings={settings}
      />
    </>
  )
} 