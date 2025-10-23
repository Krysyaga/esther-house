'use client';

import { useEffect, useState } from 'react';
import { getCountryCode, isFrancophoneCountry, detectLocaleFromBrowser, FRANCOPHONE_COUNTRIES_LIST } from '@/lib/locale-detection';

export default function LocaleDebugPage() {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isFrancophone, setIsFrancophone] = useState<boolean | null>(null);
  const [browserLocale, setBrowserLocale] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLocale = async () => {
      try {
        const country = await getCountryCode();
        setCountryCode(country);
        
        if (country) {
          setIsFrancophone(isFrancophoneCountry(country));
        }
        
        setBrowserLocale(detectLocaleFromBrowser());
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLocale();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🌍 Détection de Localisation - Debug</h1>

        {loading ? (
          <div className="text-gray-400">Chargement...</div>
        ) : (
          <div className="space-y-8">
            {/* Résumé */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">📊 Résumé</h2>
              <div className="space-y-2">
                <p className="text-lg">
                  <span className="text-gray-400">Pays détecté:</span>{' '}
                  <span className="text-green-400 font-bold">{countryCode || 'Non détecté'}</span>
                </p>
                <p className="text-lg">
                  <span className="text-gray-400">Est francophone:</span>{' '}
                  <span className={isFrancophone ? 'text-green-400 font-bold' : 'text-orange-400 font-bold'}>
                    {isFrancophone === null ? 'N/A' : (isFrancophone ? '✅ OUI (FR)' : '❌ NON (EN)')}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="text-gray-400">Langue du navigateur:</span>{' '}
                  <span className="text-blue-400 font-bold">{browserLocale}</span>
                </p>
              </div>
            </section>

            {/* Détails API */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">📡 API Géolocalisation</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-gray-400">Service:</span> ip-api.co
                </p>
                <p>
                  <span className="text-gray-400">Endpoint:</span> https://ipapi.co/json/
                </p>
                <p>
                  <span className="text-gray-400">Coût:</span> Gratuit, pas d'authentification
                </p>
                <p className="text-yellow-400 mt-2">
                  ℹ️ Fonctionne uniquement en HTTPS et en production. En local/dev, utilisez un VPN pour tester.
                </p>
              </div>
            </section>

            {/* Pays francophones */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🗺️ Pays Francophones Détectés ({FRANCOPHONE_COUNTRIES_LIST.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {FRANCOPHONE_COUNTRIES_LIST.map((country) => (
                  <div
                    key={country}
                    className={`p-2 rounded text-center text-sm font-mono ${
                      country === countryCode
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {country}
                  </div>
                ))}
              </div>
            </section>

            {/* Instructions de test */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🧪 Comment Tester</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong>✅ En production (HTTPS):</strong> La géolocalisation fonctionne automatiquement
                </p>
                <p>
                  <strong>⚠️ En développement local:</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• Utilisez un VPN (NordVPN, ExpressVPN, etc.) pour simuler un autre pays</li>
                    <li>• Ou testez manuellement en accédant à /fr ou /en directement</li>
                  </ul>
                </p>
                <p>
                  <strong>🔍 Debug:</strong> Cette page (/locale-debug) affiche les détails de détection
                </p>
              </div>
            </section>

            {/* Comportement */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">⚙️ Comportement</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong>1. Utilisateur visite / (racine):</strong>
                </p>
                <div className="ml-4 bg-gray-800 p-2 rounded text-xs font-mono">
                  <p>↓ Détection de géolocalisation</p>
                  <p>↓ {isFrancophone ? 'Pays francophone détecté' : 'Pays non francophone'}</p>
                  <p>↓ Redirection automatique vers /{isFrancophone ? 'fr' : 'en'}</p>
                </div>
              </div>
            </section>

            {/* Fallback */}
            <section className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🔄 Fallback</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Si la géolocalisation échoue, l'app regarde:</p>
                <ul className="ml-4 space-y-1">
                  <li>1. Langue du navigateur (navigator.language)</li>
                  <li>2. Sinon: English par défaut</li>
                </ul>
              </div>
            </section>

            {/* Notes */}
            <section className="bg-yellow-900/30 border border-yellow-700 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">📝 Notes Importantes</h2>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✅ La redirection se fait <strong>SEULEMENT</strong> sur la page racine (/)</li>
                <li>✅ Une fois redirigé, l'utilisateur peut changer de langue avec les boutons FR/EN</li>
                <li>✅ Les changements de langue sont conservés dans la session (URL change)</li>
                <li>⚠️ Si l'utilisateur revient à /, il sera redirigé à nouveau selon sa localisation</li>
                <li>🔒 Pas de cookies ou localStorage (pas de tracking)</li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
