import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Contact - Esther House",
  description: "Contactez-nous pour toute demande ou information.",
};

export default function ContactPage() {
  const t = useTranslations();
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.contact')}</h1>
      <p className="text-gray-600" style={{ fontFamily: "'Jost', sans-serif" }}>{t('pages.construction')}</p>
    </div>
  );
}
