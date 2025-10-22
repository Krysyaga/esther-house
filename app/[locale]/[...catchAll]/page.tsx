'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function CatchAll() {
  const locale = useLocale();

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
            Page Non Trouvée
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-gray-400">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <p className="text-base md:text-lg text-gray-500">
            Code d&apos;erreur: 404 - Page Not Found
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href={`/${locale}`}
            className="px-8 py-3 bg-[#860000] text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link 
            href={`/${locale}/events`}
            className="px-8 py-3 border-2 border-[#860000] text-[#860000] font-bold hover:bg-[#860000] hover:text-white transition-all rounded-lg"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Voir les événements
          </Link>
        </div>

        {/* Liens utiles */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href={`/${locale}/about`}
              className="text-[#860000] hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              À propos
            </Link>
            <Link 
              href={`/${locale}/contact`}
              className="text-[#860000] hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Contact
            </Link>
            <Link 
              href={`/${locale}/gallery`}
              className="text-[#860000] hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Galerie
            </Link>
            <Link 
              href={`/${locale}/booking`}
              className="text-[#860000] hover:text-white transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Réservation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
