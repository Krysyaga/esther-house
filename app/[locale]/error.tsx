'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const locale = useLocale();

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
            Erreur Serveur
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-gray-400">
            Oups ! Une erreur inattendue s&apos;est produite.
          </p>
          <p className="text-base md:text-lg text-gray-500">
            Notre équipe a été notifiée et travaille pour résoudre le problème.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-600 font-mono">
              ID d&apos;erreur: {error.digest}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-[#860000] text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Réessayer
          </button>
          <Link 
            href={`/${locale}`}
            className="px-8 py-3 border-2 border-[#860000] text-[#860000] font-bold hover:bg-[#860000] hover:text-white transition-all rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Support */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 mb-4">Besoin d&apos;aide ?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/contact`}
              className="text-[#860000] hover:text-white transition-colors font-medium"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Nous contacter
            </Link>
            <a 
              href="mailto:support@estherhouse.ch"
              className="text-[#860000] hover:text-white transition-colors font-medium"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Email support
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
