import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Galerie - Esther House",
  description: "Découvrez la galerie photos et vidéos de nos événements.",
};

export default function GalleryPage() {
  const t = useTranslations();
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.gallery')}</h1>
      <p className="text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.construction')}</p>
    </div>
  );
}
