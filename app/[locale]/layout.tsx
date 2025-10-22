import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Esther House - Théâtre & Billetterie",
  description:
    "Découvrez la programmation culturelle d'Esther House. Réservez vos places en ligne et explorez nos événements.",
  keywords: "théâtre, événements, billetterie, réservation, culture",
  authors: [{ name: "Esther House" }],
  creator: "Esther House",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://esther-house.com",
    title: "Esther House - Théâtre & Billetterie",
    description:
      "Découvrez la programmation culturelle d'Esther House. Réservez vos places en ligne.",
    siteName: "Esther House",
  },
};

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  const locales = ["fr", "en"];
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
