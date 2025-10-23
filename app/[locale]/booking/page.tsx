import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Réservation - Esther House",
  description: "Réservez vos places pour les événements d'Esther House.",
};

export default function BookingPage() {
  const t = useTranslations();
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.booking')}</h1>
      <p className="text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.construction')}</p>
    </div>
  );
}
