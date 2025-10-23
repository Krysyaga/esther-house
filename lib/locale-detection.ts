/**
 * Détection automatique de la langue selon la localisation géographique
 */

// Pays francophones
const FRANCOPHONE_COUNTRIES = [
  'FR', // France
  'BE', // Belgique
  'CH', // Suisse
  'LU', // Luxembourg
  'CA', // Canada
  'SN', // Sénégal
  'CI', // Côte d'Ivoire
  'CM', // Cameroun
  'BJ', // Bénin
  'BF', // Burkina Faso
  'CD', // République Démocratique du Congo
  'CG', // République du Congo
  'GA', // Gabon
  'GN', // Guinée
  'HT', // Haïti
  'ML', // Mali
  'MZ', // Mozambique
  'NE', // Niger
  'RE', // La Réunion
  'RW', // Rwanda
  'TG', // Togo
  'TD', // Tchad
  'TN', // Tunisie
  'VU', // Vanuatu
  'GP', // Guadeloupe
  'MQ', // Martinique
  'BL', // Saint-Barthélemy
  'MF', // Saint-Martin
  'GF', // Guyane française
  'PM', // Saint-Pierre-et-Miquelon
  'YT', // Mayotte
  'WF', // Wallis-et-Futuna
  'PF', // Polynésie française
  'NC', // Nouvelle-Calédonie
  'BW', // Botswana (anglophone majoritaire, mais francophone minoritaire)
  'BI', // Burundi
  'DJ', // Djibouti
  'EQ', // Guinée équatoriale
  'KM', // Comores
  'MG', // Madagascar
  'ML', // Mali
  'MR', // Mauritanie
  'SC', // Seychelles
  'SO', // Somalie
];

/**
 * Récupère le code pays depuis une API de géolocalisation
 * @returns Promise<string | null> Code pays ISO 3166-1 alpha-2 (ex: 'FR', 'EN', etc.)
 */
export async function getCountryCode(): Promise<string | null> {
  try {
    // Utiliser ip-api.com (gratuit, pas d'authentification requise)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Erreur de géolocalisation:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.warn('Impossible de détecter le pays:', error);
    return null;
  }
}

/**
 * Détermine si un pays est francophone
 * @param countryCode Code pays ISO 3166-1 alpha-2
 * @returns boolean true si le pays est francophone
 */
export function isFrancophoneCountry(countryCode: string): boolean {
  return FRANCOPHONE_COUNTRIES.includes(countryCode.toUpperCase());
}

/**
 * Détecte la locale par géolocalisation
 * @returns Promise<'fr' | 'en'> 'fr' si francophone, 'en' sinon
 */
export async function detectLocaleByGeolocation(): Promise<'fr' | 'en'> {
  try {
    const countryCode = await getCountryCode();
    
    if (!countryCode) {
      // Fallback: regarder la langue du navigateur
      return detectLocaleFromBrowser();
    }

    return isFrancophoneCountry(countryCode) ? 'fr' : 'en';
  } catch (error) {
    console.warn('Erreur dans la détection de locale:', error);
    return detectLocaleFromBrowser();
  }
}

/**
 * Détecte la locale depuis la langue du navigateur
 * @returns 'fr' | 'en'
 */
export function detectLocaleFromBrowser(): 'fr' | 'en' {
  if (typeof window === 'undefined') {
    return 'en'; // Serveur
  }

  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  return browserLanguage.startsWith('fr') ? 'fr' : 'en';
}

/**
 * Liste des pays francophones (exportée pour debug/admin)
 */
export const FRANCOPHONE_COUNTRIES_LIST = FRANCOPHONE_COUNTRIES;
