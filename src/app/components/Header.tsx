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
    slug: {
      current: string;
    };
  }
}

interface MenuItem {
  _key: string;
  text: string;
  link?: {
    slug: {
      current: string;
    };
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
      slug
    },
    submenu[]{
      _key,
      text,
      link->{
        slug
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
                      href={`/categories/${item.link?.slug?.current}`}
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
                      href={`/products/${subItem.link?.slug?.current}`}
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
        href={`/categories/${item.link?.slug?.current}`}
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
      <Link
        href={`/categories/${item.link?.slug?.current}`}
        className="px-3 py-2 text-base font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-100/80 hover:text-gray-900"
      >
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
                <Link href={`/categories/${item.link.slug.current}`} onClick={closeMenu} className="block py-2 pr-3 text-sm font-semibold leading-7 text-gray-700 rounded-lg pl-9 hover:bg-gray-50">
                  {item.text} (Main)
                </Link>
              )}
              {item.submenu?.map((subItem) => (
                subItem.link?.slug && (
                  <Link key={subItem._key} href={`/products/${subItem.link.slug.current}`} onClick={closeMenu} className="block py-2 pr-3 text-sm font-semibold leading-7 text-gray-700 rounded-lg pl-9 hover:bg-gray-50">
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