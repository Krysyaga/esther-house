'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Grand numéro 500 */}
        <div className="space-y-4">
          <div 
            className="text-[120px] md:text-[180px] font-semibold leading-none text-white/20"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            500
          </div>
          <h1 
            className="text-4xl md:text-6xl font-bold uppercase"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('error.title')}
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-gray-400">
            {t('error.description')}
          </p>
          <p className="text-base md:text-lg text-gray-500">
            {t('error.message')}
          </p>
          <p className="text-sm text-gray-600">
            {t('error.patience')}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={() => reset()}
            className="px-8 py-3 text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "var(--brand-accent)" }}
          >
            {t('error.retry')}
          </button>
          <Link 
            href={`/${locale}`}
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
            {t('notfound.back_home')}
          </Link>
        </div>

        {/* Réseaux sociaux */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 mb-4">{t('footer.follow_us')} :</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors font-medium"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              Instagram
            </a>
            <a 
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors font-medium"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              Facebook
            </a>
            <a 
              href="mailto:contact@estherhouse.ch"
              className="hover:text-white transition-colors font-medium"
              style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
            >
              {t('error.contact_us')}
            </a>
          </div>
        </div>

        {/* Détails techniques (mode développement) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="pt-8 border-t border-white/10 bg-white/5 p-4 rounded-lg text-left">
            <p className="text-xs text-gray-400 mb-2">Détails (mode dev uniquement):</p>
            <p className="text-xs text-red-400 font-mono break-words">{error.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
