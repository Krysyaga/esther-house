import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Événements - Esther House",
  description: "Découvrez nos événements à venir et réservez vos places.",
};

export default function EventsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Nos Événements</h1>
      <p className="text-gray-600">Page en construction...</p>
    </div>
  );
}
