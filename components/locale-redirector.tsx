'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { detectLocaleByGeolocation } from '@/lib/locale-detection';

/**
 * Composant qui redirige automatiquement vers la bonne langue
 * Fonctionne uniquement côté client
 */
export function LocaleRedirector() {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const redirectToLocale = async () => {
      try {
        // Récupérer la locale détectée
        const detectedLocale = await detectLocaleByGeolocation();
        
        // Rediriger l'utilisateur
        router.push(`/${detectedLocale}`);
      } catch (error) {
        console.error('Erreur lors de la redirection de locale:', error);
        // Fallback à l'anglais
        router.push('/en');
      } finally {
        setHasChecked(true);
      }
    };

    redirectToLocale();
  }, [router]);

  // Afficher rien pendant la redirection
  if (!hasChecked) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center z-50">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">Esther House</div>
          <p className="text-gray-400">Détection de votre localisation...</p>
        </div>
      </div>
    );
  }

  return null;
}
