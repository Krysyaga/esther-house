import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Événements - Esther House",
  description: "Découvrez nos événements à venir et réservez vos places.",
};

export default function EventsPage() {
  const t = useTranslations();
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">{t('pages.events')}</h1>
      <p className="text-gray-600">{t('pages.construction')}</p>
    </div>
  );
}
