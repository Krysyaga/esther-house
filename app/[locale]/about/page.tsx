import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "À Propos - Esther House",
  description: "Découvrez l'histoire et les valeurs d'Esther House.",
};

export default function AboutPage() {
  const t = useTranslations();
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.about')}</h1>
      <p className="text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.construction')}</p>
    </div>
  );
}
