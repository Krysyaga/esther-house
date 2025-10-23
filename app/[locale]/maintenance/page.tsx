'use client';

import { useTranslations } from 'next-intl';

export default function MaintenancePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Icon */}
        <div className="space-y-4">
          <h1
            className="text-4xl md:text-6xl font-bold uppercase text-white"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('error.title')}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p
            className="text-lg md:text-xl text-gray-400"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('error.description')}
          </p>
          <p
            className="text-base md:text-lg text-gray-500"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('error.message')}
          </p>
        </div>

        {/* Contact info */}
        <div className="pt-8 border-t border-white/10">
          <p
            className="text-gray-500 mb-4"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('error.patience')}
          </p>
          <a
            href="mailto:info@estherhouse.ch"
            className="inline-block px-8 py-3 text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "var(--brand-accent)" }}
          >
            {t('error.contact_us')}
          </a>
        </div>
      </div>
    </main>
  );
}
