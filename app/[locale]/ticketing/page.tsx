'use client';

import { useTranslations } from 'next-intl';

export default function TicketingPage() {
  const t = useTranslations();

  return (
    <main className="bg-black text-white">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('ticketing.title')}
          </h1>
          <div className="w-16 h-1 mb-8 mx-auto" style={{ backgroundColor: "var(--brand-accent)" }} />
        </div>
      </section>

      {/* Main Content */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Acheter des billets */}
          <div>
            <h2 
              className="text-3xl md:text-4xl font-bold uppercase mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('ticketing.buy_tickets')}
            </h2>
            <div className="w-12 h-1 mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />

            {/* 1. En Ligne */}
            <div className="mb-8">
              <h3 
                className="text-xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                1. {t('ticketing.online')}
              </h3>
              <p className="text-gray-300 mb-4">
                {t('ticketing.online_description')}
              </p>
              <ul className="space-y-2 ml-4 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: "var(--brand-accent)" }}>—</span>
                  <span>{t('ticketing.infomaniak_platform')}</span>
                </li>
              </ul>
              <p className="text-gray-400 text-sm italic mt-4">
                {t('ticketing.platform_setup')}
              </p>
            </div>

            {/* 2. Au Guichet */}
            <div className="mb-8">
              <h3 
                className="text-xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                2. {t('ticketing.counter')}
              </h3>
              <ul className="space-y-2 ml-4 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: "var(--brand-accent)" }}>—</span>
                  <span>{t('ticketing.counter_description')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3" style={{ color: "var(--brand-accent)" }}>—</span>
                  <span>{t('ticketing.evening_counter')}</span>
                </li>
              </ul>
              <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                {t('ticketing.full_concert')}
              </p>
              <p className="text-gray-300 mt-2 text-sm">
                {t('ticketing.buy_advance')}
              </p>
              <ul className="space-y-1 ml-4 text-gray-300 text-sm mt-2">
                <li>• {t('ticketing.surcharge')}</li>
                <li>• {t('ticketing.prices')}</li>
              </ul>
            </div>
          </div>

          {/* Conditions Générales */}
          <div className="pt-8 border-t border-white/10">
            <h2 
              className="text-3xl md:text-4xl font-bold uppercase mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('ticketing.general_conditions')}
            </h2>
            <div className="w-12 h-1 mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />

            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                {t('ticketing.conditions_text')}
              </p>
              <p>
                {t('ticketing.no_exchange')}
              </p>
              <p>
                {t('ticketing.postponement')}
              </p>
              <p>
                {t('ticketing.cancellation')}
              </p>
              <p>
                {t('ticketing.access_conditions')}
              </p>
            </div>
          </div>

          {/* Mise en Garde */}
          <div className="pt-8 border-t border-white/10 p-6 rounded-lg" style={{ backgroundColor: "rgba(200, 50, 50, 0.1)", borderColor: "var(--brand-accent)" }}>
            <h2 
              className="text-2xl font-bold uppercase mb-4"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              ⚠ {t('ticketing.warning')}
            </h2>
            <h3 className="text-lg font-bold uppercase mb-3">{t('ticketing.warning_title')}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('ticketing.warning_text')}
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
