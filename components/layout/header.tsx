'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

export function Header() {
  const locale = useLocale();
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: t('nav.home'), href: `/${locale}` },
    { label: t('nav.events'), href: `/${locale}/events` },
    { label: t('nav.about'), href: `/${locale}/about` },
    { label: t('nav.gallery'), href: `/${locale}/gallery` },
    { label: t('nav.contact'), href: `/${locale}/contact` },
    { label: t('nav.booking'), href: `/${locale}/booking` },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 bg-black text-white transition-all duration-300 px-4 md:px-8 lg:px-16 ${isScrolled ? 'pt-2' : 'pt-8'}`}>
        <nav className="h-18 md:h-16 flex items-center px-6 md:px-12">
          {/* Desktop Layout - 3 Columns */}
          <div className="hidden md:grid grid-cols-3 w-full items-center gap-8">
            {/* Left Column: Booking/Tickets */}
            <div className="flex justify-start">
              <Link 
                href={`/${locale}/booking`}
                className="header-link text-white text-xs font-bold tracking-widest uppercase hover:opacity-60 transition-opacity"
              >
                {t('nav.ticketing')}
              </Link>
            </div>

            {/* Center Column: Logo - Iconic & Minimal */}
            <div className="flex justify-center">
              <Link href={`/${locale}`} className="flex items-center">
                <div className={`rounded-lg hover:opacity-90 transition-all duration-300 ${isScrolled ? 'p-1' : 'p-2'}`}>
                  <Image
                    src="/icons/EH_ICON_BLACK.svg"
                    alt="Esther House"
                    width={48}
                    height={48}
                    priority
                    className={`invert transition-all duration-300 ${isScrolled ? 'w-36 h-36' : 'w-72 h-72'}`}
                  />
                </div>
              </Link>
            </div>

            {/* Right Column: Search, Language & Menu */}
            <div className="flex justify-end items-center gap-8">
              {/* Search Button */}
              <button 
                className="hover:opacity-70 transition-opacity cursor-pointer p-1"
                aria-label="Search"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <button
                  onClick={() => {
                    window.location.href = '/fr';
                  }}
                  className={`header-link transition-opacity cursor-pointer ${locale === 'fr' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  FR
                </button>
                <span className="opacity-40">/</span>
                <button
                  onClick={() => {
                    window.location.href = '/en';
                  }}
                  className={`header-link transition-opacity cursor-pointer ${locale === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  EN
                </button>
              </div>

              {/* Burger Menu */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:opacity-70 transition-opacity cursor-pointer p-1"
                aria-label="Menu"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden w-full flex items-center justify-between">
            {/* Mobile: Left - Booking/Tickets Button */}
            <Link 
              href={`/${locale}/booking`}
              className="hover:opacity-70 transition-opacity cursor-pointer p-1"
              aria-label="Booking"
            >
              <Ticket size={20} />
            </Link>

            {/* Mobile: Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href={`/${locale}`} className="flex items-center">
                <div className="bg-white rounded-lg p-1 hover:opacity-90 transition-opacity">
                  <Image
                    src="/icons/EH_ICON_BLACK.svg"
                    alt="Esther House"
                    width={28}
                    height={28}
                    priority
                    className="w-7 h-7 invert"
                  />
                </div>
              </Link>
            </div>

            {/* Mobile: Right side */}
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    window.location.href = '/fr';
                  }}
                  className={`header-link transition-opacity cursor-pointer ${locale === 'fr' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  FR
                </button>
                <span className="opacity-40">/</span>
                <button
                  onClick={() => {
                    window.location.href = '/en';
                  }}
                  className={`header-link transition-opacity cursor-pointer ${locale === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  EN
                </button>
              </div>
              <button 
                className="hover:opacity-70 transition-opacity cursor-pointer p-1"
                aria-label="Search"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Full Screen Menu Modal */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black text-white z-50 md:hidden overflow-hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Background Image */}
          <Image
            src="/images/IMG_2008.jpg"
            alt="Menu Background"
            fill
            className="object-cover absolute inset-0 pointer-events-none"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          
          {/* Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(false);
            }}
            className="absolute top-8 right-6 hover:opacity-70 transition-opacity z-10"
            aria-label="Close menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Menu Content */}
          <div 
            className="h-full flex flex-col items-center justify-center space-y-6 relative z-10 pointer-events-none"
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-bold uppercase hover:opacity-70 transition-opacity pointer-events-auto"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Menu Modal */}
      {isMenuOpen && (
        <div 
          className="hidden md:block fixed inset-0 text-white z-50 overflow-hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Background Image */}
          <Image
            src="/images/IMG_2008.jpg"
            alt="Menu Background"
            fill
            className="object-cover absolute inset-0 pointer-events-none"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none" />
          
          {/* Close Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(false);
            }}
            className="absolute top-8 right-6 hover:opacity-70 transition-opacity z-10"
            aria-label="Close menu"
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          {/* Menu Content */}
          <div 
            className="h-full flex flex-col items-center justify-center space-y-8 relative z-10 pointer-events-none"
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-bold uppercase hover:opacity-70 transition-opacity pointer-events-auto"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
