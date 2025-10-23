'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Grand numéro 404 */}
        <div className="space-y-4">
          <div 
            className="text-[120px] md:text-[180px] font-semibold leading-none text-white/20"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            404
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold uppercase"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('notfound.title')}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-gray-400">
            {t('notfound.description')}
          </p>
          <p className="text-base md:text-lg text-gray-500">
            {t('notfound.error_code')}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href={`/${locale}`}
            className="px-8 py-3 text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "var(--brand-accent)" }}
          >
            {t('notfound.back_home')}
          </Link>
          <Link 
            href={`/${locale}/events`}
            className="px-8 py-3 border-2 font-bold hover:text-white transition-all rounded-lg"
            style={{ 
              fontFamily: "'Jost', sans-serif",
              borderColor: "var(--brand-accent)",
              color: "var(--brand-accent)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--brand-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t('notfound.view_events')}
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 mb-4">{t('notfound.useful_links')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/about`}
              className="hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              {t('nav.about')}
            </Link>
            <Link 
              href={`/${locale}/contact`}
              className="hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              {t('nav.contact')}
            </Link>
            <Link 
              href={`/${locale}/gallery`}
              className="hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              {t('nav.gallery')}
            </Link>
            <Link 
              href={`/${locale}/booking`}
              className="hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              {t('nav.booking')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
