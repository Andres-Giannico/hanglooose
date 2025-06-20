"use client"

import Link from 'next/link'
import Image from 'next/image'
import {client} from '@/sanity/client'
import {groq} from 'next-sanity'
import {urlForImage, SanityImage} from '@/sanity/image'
import type { SVGProps } from 'react';
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu as HeadlessMenu, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid'

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
  link?: {
    slug: string;
  }
}

interface MenuItem {
  _key: string;
  text: string;
  link?: {
    slug: string;
  };
  submenu?: SubMenuItem[];
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
    link->{
      "slug": slug.current
    },
    submenu[]{
      _key,
      text,
      link->{
        "slug": slug.current
      }
    }
  }
}`

// Icon Component
const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

const SocialIcon = ({ platform, ...props }: { platform: string } & SVGProps<SVGSVGElement>) => {
  const icons: Record<string, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
    facebook: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm2.64 8.44h-1.9v6.84h-2.7v-6.84h-1.32V8.44h1.32V7.15c0-1.1.53-2.79 2.79-2.79h1.75v2.21h-1.25c-.25 0-.62.12-.62.69v1.18h1.93l-.23 2.37z" /></svg>
    ),
    instagram: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-2.72 0-3.05.01-4.12.06-1.06.05-1.79.23-2.42.47-.65.25-1.23.58-1.79 1.14-.56.56-.89 1.14-1.14 1.79-.24.63-.42 1.36-.47 2.42C2.01 8.95 2 9.28 2 12s.01 3.05.06 4.12c.05 1.06.23 1.79.47 2.42.25.65.58 1.23 1.14 1.79.56.56 1.14.89 1.79 1.14.63.24 1.36.42 2.42.47 1.07.05 1.4.06 4.12.06s3.05-.01 4.12-.06c1.06-.05 1.79-.23 2.42-.47.65-.25 1.23-.58 1.79-1.14.56-.56.89 1.14-1.14-1.79-.24-.63-.42-1.36-.47-2.42-.05-1.07-.06-1.4-.06-4.12s.01-3.05.06-4.12c.05-1.06.23-1.79.47-2.42.25-.65.58 1.23 1.14-1.79.56-.56 1.14-.89 1.79-1.14.63-.24 1.36-.42 2.42-.47C15.05 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.99.01 4.05.06 1.02.05 1.58.22 1.9.35.42.16.72.36 1.03.67.31.31.51.6.67 1.03.13.32.3.88.35 1.9.05 1.06.06 1.38.06 4.05s-.01 2.99-.06 4.05c-.05 1.02-.22 1.58-.35 1.9-.16.42-.36.72-.67 1.03-.31.31-.6.51-1.03.67-.32.13-.88.3-1.9.35-1.06.05-1.38.06-4.05.06s-2.99-.01-4.05-.06c-1.02-.05-1.58-.22-1.9-.35-.42-.16-.72-.36-1.03-.67s-.51-.6-.67-1.03c-.13-.32-.3-.88-.35-1.9-.05-1.06-.06-1.38-.06-4.05s.01-2.99.06-4.05c.05-1.02.22-1.58.35-1.9.16-.42.36-.72.67-1.03.31-.31.6-.51 1.03-.67.32-.13.88-.3 1.9-.35C9.01 3.81 9.33 3.8 12 3.8zm0 3.35c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7.2c-1.49 0-2.7-1.21-2.7-2.7s1.21-2.7 2.7-2.7 2.7 1.21 2.7 2.7-1.21 2.7-2.7 2.7zm5.55-7.35c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1 1.1-.49 1.1-1.1-.49-1.1-1.1-1.1z" /></svg>
    ),
    tripadvisor: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.12 13.43c-2.35 0-4.25-1.9-4.25-4.25s1.9-4.25 4.25-4.25c1.1 0 2.1.42 2.87 1.1l-1.42 1.42c-.37-.37-.88-.6-1.45-.6-1.2 0-2.18 1-2.18 2.2s.98 2.2 2.18 2.2c1.47 0 2.04-1.02 2.14-1.58h-2.14v-2h3.5c.03.1.05.2.05.35 0 2.18-1.44 3.7-3.55 3.7zm5.5-4.18c0-1.48-1.2-2.68-2.68-2.68s-2.68 1.2-2.68 2.68c0 1.48 1.2 2.68 2.68 2.68s2.68-1.2 2.68-2.68z"/></svg>
    ),
    whatsapp: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.94L2 22l5.3-1.44c1.41.81 3.02 1.25 4.71 1.25h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.56 10.97c-.24.42-.87.78-1.52.92-.65.14-1.32.14-1.95-.08-.63-.22-1.32-.47-2.3-1.23-1.25-.96-2.07-2.16-2.19-2.35-.12-.19-.94-1.25-.94-2.3s.59-1.58.83-1.8c.24-.22.53-.27.72-.27.19 0 .38.01.53.01.24 0 .53.05.78.53.25.48.87 1.5.94 1.6.07.1.12.22 0 .36-.12.14-.19.22-.36.38-.17.16-.3.27-.47.42-.19.17-.38.33-.24.62.14.29.65 1.1 1.4 1.76.96.83 1.76 1.1 2 1.18.24.08.38.07.53-.04.14-.12.62-.73.78-.97.17-.25.33-.19.56-.1.24.08 1.5.7 1.76.83.25.12.42.19.47.29.05.1.05.62-.19 1.04z"/></svg>
    ),
    youtube: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6.5 4.5-6.5 4.5z"/></svg>
    ),
  };
  const Icon = icons[platform];
  return Icon ? Icon(props) : null;
};

// Component
export default function Header() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [menu, setMenu] = useState<NavigationData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      }
    };
    fetchHeaderData();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="Back to homepage">
              {settings?.logo?.asset ? (
                <Image
                  src={urlForImage(settings.logo)?.width(500).url() || ''}
                  alt={settings.title || 'Hang Loose Ibiza Logo'}
                  width={240}
                  height={70}
                  className="h-20 w-auto object-contain"
                  priority
                />
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-gray-900">{settings?.title || 'HANG LOOSE'}</span>
              )}
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {menu?.items?.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const hasLink = item.link?.slug;

              if (hasSubmenu) {
                return (
                  <HeadlessMenu as="div" className="relative inline-block text-left" key={item._key}>
                    <HeadlessMenu.Button className="inline-flex w-full justify-center items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                      {item.text}
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </HeadlessMenu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          {hasLink && (
                             <HeadlessMenu.Item>
                              {({ active }) => (
                                <Link
                                  href={`/categories/${item.link?.slug}`}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold`}
                                >
                                  {item.text} (Main)
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                          )}
                          {item.submenu?.map((subItem) => (
                             <HeadlessMenu.Item key={subItem._key}>
                              {({ active }) => (
                                <Link
                                  href={`/products/${subItem.link?.slug}`}
                                  className={`${
                                    active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  {subItem.text}
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                          ))}
                        </div>
                      </HeadlessMenu.Items>
                    </Transition>
                  </HeadlessMenu>
                );
              }

              if (hasLink) {
                return (
                  <Link
                    key={item._key}
                    href={`/categories/${item.link?.slug}`}
                    className="rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {item.text}
                  </Link>
                );
              }
              
              // Fallback for items that are neither a link nor a submenu (e.g. just text)
              return (
                <span key={item._key} className="rounded-md px-3 py-2 text-base font-medium text-gray-700">
                  {item.text}
                </span>
              );
            })}
          </nav>

          {/* Contact & Mobile Menu Button */}
          <div className="flex items-center">
            <div className="hidden lg:flex lg:items-center">
              {settings?.contactPhoneNumberDisplay && settings?.contactPhoneNumber && (
                <a href={`tel:${settings.contactPhoneNumber}`} className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900">
                  <PhoneIcon className="h-5 w-5" />
                  <span>{settings.contactPhoneNumberDisplay}</span>
                </a>
              )}
              {settings?.contactButtonText && settings.contactButtonLink && (
                <Link href={settings.contactButtonLink} className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700">
                  {settings.contactButtonText}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">{settings?.title || 'Hang Loose Ibiza'}</span>
              {settings?.logo?.asset ? (
                <Image
                  src={urlForImage(settings.logo)?.width(500).url() || ''}
                  alt={settings.title || 'Hang Loose Ibiza Logo'}
                  width={160}
                  height={48}
                  className="h-12 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">{settings?.title}</span>
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                 {menu?.items?.map((item) => (
                  <Popover className="relative" key={item._key}>
                  {({ open }) => (
                    <>
                      <div className="flex items-center justify-between">
                        {item.link?.slug && (!item.submenu || item.submenu.length === 0) ? (
                            <Link 
                              href={`/categories/${item.link.slug}`} 
                              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.text}
                            </Link>
                          ) : (
                            <span className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900">
                              {item.text}
                            </span>
                        )}
                        {item.submenu && item.submenu.length > 0 && (
                          <Popover.Button
                            className={`${
                              open ? 'text-gray-900' : 'text-gray-700'
                            } group flex items-center rounded-md p-2 text-base font-semibold hover:bg-gray-50`}
                          >
                            <ChevronDownIcon
                              className={`${open ? 'rotate-180' : ''} h-5 w-5 flex-none transition-transform duration-200`}
                              aria-hidden="true"
                            />
                          </Popover.Button>
                        )}
                      </div>

                      {item.submenu && (
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="mt-2 space-y-2 pl-6">
                             {item.link?.slug && (
                              <Link
                                key={`${item._key}-main`}
                                href={`/categories/${item.link.slug}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-700 hover:bg-gray-50"
                              >
                                {item.text} (Main)
                              </Link>
                            )}
                            {item.submenu.map((subItem) =>
                              subItem.link?.slug ? (
                                <Link
                                  key={subItem._key}
                                  href={`/products/${subItem.link.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-700 hover:bg-gray-50"
                                >
                                  {subItem.text}
                                </Link>
                              ) : null
                            )}
                          </Popover.Panel>
                        </Transition>
                      )}
                    </>
                  )}
                  </Popover>
                ))}
              </div>
              <div className="py-6">
                {settings?.contactButtonText && settings.contactButtonLink && (
                  <Link href={settings.contactButtonLink} className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    {settings.contactButtonText}
                  </Link>
                )}
                 {settings?.contactPhoneNumberDisplay && settings.contactPhoneNumber && (
                   <a href={`tel:${settings.contactPhoneNumber}`} className="-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                     <PhoneIcon className="h-5 w-5" />
                    {settings.contactPhoneNumberDisplay}
                  </a>
                )}
                <div className="mt-4 flex items-center space-x-4">
                  {settings?.socialLinks?.map((social) => (
                    <a key={social._key} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                       <span className="sr-only">{social.platform}</span>
                       <SocialIcon platform={social.platform} className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
} 