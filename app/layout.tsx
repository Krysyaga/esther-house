import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Esther House - Théâtre & Billetterie",
  description:
    "Découvrez la programmation culturelle d'Esther House. Réservez vos places en ligne et explorez nos événements.",
  keywords: "théâtre, événements, billetterie, réservation, culture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
