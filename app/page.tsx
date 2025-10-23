import { LocaleRedirector } from "@/components/locale-redirector";

/**
 * Page racine qui détecte automatiquement la localisation
 * et redirige vers la bonne langue
 */
export default function RootPage() {
  return <LocaleRedirector />;
}
