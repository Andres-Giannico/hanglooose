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
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const hasLink = item.link?.slug;

  if (hasSubmenu) {
    return (
      <HeadlessMenu as="div" className="relative inline-block text-left">
        <HeadlessMenu.Button className="inline-flex items-center justify-center px-3 py-2 text-base font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100/80 hover:text-gray-900">
          <span>{item.text}</span>
          <ChevronDownIcon className="w-5 h-5 ml-1 text-gray-500" aria-hidden="true" />
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
          <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {hasLink && (
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <Link
                      href={`/categories/${item.link?.slug}`}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm font-medium`}
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
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm`}
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
        href={`/categories/${item.link?.slug}`}
        className="px-3 py-2 text-base font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100/80 hover:text-gray-900"
      >
        {item.text}
      </Link>
    );
  }
  
  return (
    <span className="px-3 py-2 text-base font-medium text-gray-700 rounded-lg">
      {item.text}
    </span>
  );
}

const MobileMenu = ({ open, setOpen, menu, settings }: { open: boolean, setOpen: (open: boolean) => void, menu: NavigationData | null, settings: SiteSettings | null }) => {
  return (
    <Dialog as="div" className="lg:hidden" open={open} onClose={setOpen}>
      <div className="fixed inset-0 z-50" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="-m-1.5 p-1.5" onClick={() => setOpen(false)}>
            <span className="sr-only">{settings?.title || 'Hang Loose Ibiza'}</span>
            {settings?.logo?.asset ? (
              <Image
                src={urlForImage(settings.logo)?.width(100).height(100).url() || ''}
                alt={settings.title || 'Hang Loose Ibiza Logo'}
                width={64}
                height={64}
                className="object-contain w-auto h-16"
                priority
              />
            ) : (
              <span className="text-3xl font-extrabold tracking-tight text-gray-900">{settings?.title || 'Brand'}</span>
            )}
          </Link>
          <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setOpen(false)}>
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {menu?.items?.map((item) => <MobileNavItem key={item._key} item={item} closeMenu={() => setOpen(false)} />)}
            </div>
            <div className="py-6 space-y-4">
              {settings?.contactPhoneNumberDisplay && (
                 <a href={`tel:${settings.contactPhoneNumber}`} className="flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                   <PhoneIcon className="w-5 h-5" />
                   {settings.contactPhoneNumberDisplay}
                </a>
              )}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  )
}

const MobileNavItem = ({ item, closeMenu }: { item: MenuItem, closeMenu: () => void }) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  
  if (!hasSubmenu) {
    return (
      <Link href={item.link?.slug ? `/categories/${item.link.slug}` : '#'} onClick={closeMenu} className="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">
        {item.text}
      </Link>
    );
  }
  
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="flex items-center justify-between w-full px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">
            {item.text}
            <ChevronDownIcon className={`${open ? 'rotate-180' : ''} h-5 w-5 flex-none transition-transform duration-200`} />
          </Popover.Button>
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
                <Link href={`/categories/${item.link.slug}`} onClick={closeMenu} className="block py-2 pr-3 text-sm font-semibold leading-7 text-gray-700 rounded-lg pl-9 hover:bg-gray-50">
                  {item.text} (Main)
                </Link>
              )}
              {item.submenu?.map((subItem) => (
                subItem.link?.slug && (
                  <Link key={subItem._key} href={`/products/${subItem.link.slug}`} onClick={closeMenu} className="block py-2 pr-3 text-sm font-semibold leading-7 text-gray-700 rounded-lg pl-9 hover:bg-gray-50">
                    {subItem.text}
                  </Link>
                )
              ))}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

// MAIN COMPONENT
export default function Header() {
  const { settings, menu, loading } = useHeaderData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return <header className="h-20 bg-white border-b border-gray-200" />
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-20 items-center justify-between">
            {/* Logo section */}
            <div className="flex-shrink-0">
              <Link href="/" className="block" aria-label="Home">
                {settings?.logo?.asset ? (
                  <div className="h-14 w-14">
                    <Image
                      src={urlForImage(settings.logo)?.width(120).height(120).url() || ''}
                      alt={settings.title || 'Logo'}
                      width={120}
                      height={120}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {settings?.title || 'Brand'}
                  </span>
                )}
              </Link>
            </div>

            {/* Navigation section */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-8">
              <nav className="flex gap-x-4" aria-label="Main navigation">
                {menu?.items?.map((item) => (
                  <DesktopNavItem key={item._key} item={item} />
                ))}
              </nav>
              <div className="h-6 w-px bg-gray-200" />
              <div className="w-64">
                <SearchBar />
              </div>
            </div>

            {/* Contact section */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-6">
              {settings?.contactPhoneNumber && (
                <a
                  href={`tel:${settings.contactPhoneNumber}`}
                  className="flex items-center gap-x-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100/80 hover:text-gray-900"
                >
                  <PhoneIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{settings.contactPhoneNumberDisplay}</span>
                </a>
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